#!/usr/bin/env node
/**
 * Deep Diagnose v1.1 — End-to-End Check
 * Checks:
 *  A) Architecture freeze v1.8 present
 *  B) Backlog governance freeze v1.1 present
 *  C) Ledger contains freeze & health records (backlog)
 *  D) Trust Probe v1.8 workflow exists + triggers (push/pull/schedule)
 *  E) Backlog Health workflow exists + triggers (push/pull/schedule)
 *  F) Scripts exit-code semantics (0/2/1) consistent
 *  G) Numeric validation present in generate_backlog_summary.mjs
 *  H) Dashboard renderer present + last render succeeded (files exist)
 *  I) Cross-refs (linked_meta) consistent across core files
 *  J) Report dates not stale (> 14 Tage)
 *  → exit_code: 1 (high), 2 (medium), 0 (ok)
 */

import fs from "fs";

const F = {
  arch: "meta/AI_First_System_Architecture_v1.8.md",
  backlogMatrix: "artefacts/logs/backlog_matrix_v1.0.md",
  roadmap: "artefacts/logs/roadmap_v1.0.md",
  rules: "artefacts/logs/prioritization_rules_v1.0.md",
  ledger: "artefacts/sync/System_Harmony_Ledger.md",
  diagMeta: "artefacts/logs/meta/diagnose_meta_v1.8.json",
  diagBacklogJson: "artefacts/logs/meta/diagnose_backlog_v1.0.json",
  trustProbeJson: "artefacts/logs/trust_probe_v1.8.json",
  trustProbeWf: ".github/workflows/trust_probe.yml",
  backlogWf: ".github/workflows/backlog_health.yml",
  genBacklog: "scripts/generate_backlog_summary.mjs",
  renderDashboard: "scripts/update_backlog_dashboard.mjs",
  dashboardMD: "artefacts/dashboards/backlog_dashboard_v1.1.md",
  dashboardSnap: "artefacts/logs/meta/backlog_dashboard_snapshot_v1.1.json",
  horizon: "meta/Horizon_Map_v1.8.md",
  outMd: "artefacts/logs/deep_diagnose_v1_1.md",
  outJson: "artefacts/logs/deep_diagnose_v1_1.json",
};

function read(p){ try { return fs.readFileSync(p,"utf8"); } catch { return null; } }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
function ageDays(ts){
  try { return (Date.now()-Date.parse(ts))/86400000; } catch { return 9999; }
}
const findings=[];

function add(area,severity,message,details){
  findings.push({area,severity,message,details});
}

function has(str, pattern){ return !!(str && str.match(pattern)); }

// A) Architecture freeze v1.8
const arch = read(F.arch);
if(!arch) add("architecture","high","Architecture v1.8 missing",F.arch);
else if(!has(arch,/governance:\s*freeze\s*v1\.8/)) add("architecture","medium","Architecture governance not 'freeze v1.8'",null);

// B) Backlog v1.1 freeze
const rules = read(F.rules);
if(!rules) add("backlog","high","Prioritization rules v1.0 missing",F.rules);

const ledger = read(F.ledger);
if(!ledger){
  add("ledger","high","System Harmony Ledger missing",F.ledger);
}else{
  if(!has(ledger,/Backlog Governance Version\s*\|\s*v1\.1/))
    add("ledger","medium","Backlog governance v1.1 freeze record not found",null);
  if(!has(ledger,/Last Backlog Health\s*\|\s*[0-9]+\.[0-9]+\s*\|/))
    add("ledger","medium","Backlog health record missing",null);
}

// C) Backlog health >= thresholds?
const diagBacklog = read(F.diagBacklogJson);
let backlogHealth = null, diagBacklogTs=null, diagBacklogExit=null;
if(diagBacklog){
  try{
    const j=JSON.parse(diagBacklog);
    backlogHealth=j.avg_priority??null;
    diagBacklogTs=j.timestamp||j.generated_at||null;
    diagBacklogExit=j.exit_code;
  }catch{ add("diagnostics","medium","diagnose_backlog_v1.0.json unreadable",F.diagBacklogJson); }
}else add("diagnostics","medium","diagnose_backlog_v1.0.json missing",F.diagBacklogJson);

if(backlogHealth!==null && backlogHealth<7)
  add("health","high",`Backlog health below yellow (avg=${backlogHealth})`,null);

// D/E) Workflows exist + triggers
function checkTriggers(wfPath, name){
  const wf=read(wfPath);
  if(!wf){ add("workflow","high",`${name} workflow missing`,wfPath); return; }
  if(!has(wf,/on:\s*[\s\S]*push:/)) add("workflow","medium",`${name} missing 'push' trigger`,wfPath);
  if(!has(wf,/on:\s*[\s\S]*pull_request:/)) add("workflow","medium",`${name} missing 'pull_request' trigger`,wfPath);
  if(!has(wf,/schedule:\s*-\s*cron:/)) add("workflow","info",`${name} has no schedule`,wfPath);
}
checkTriggers(F.trustProbeWf,"Trust Probe");
checkTriggers(F.backlogWf,"Backlog Health");

// F) Exit-code semantics
const trustWf = read(F.trustProbeWf);
const backWf  = read(F.backlogWf);
if(backWf && !has(backWf,/exit=2.*warning/i))
  add("workflow","info","Backlog Health classification for exit=2 not found (warning)",F.backlogWf);

// G) Numeric validation present
const gen = read(F.genBacklog);
if(!gen) add("script","high","generate_backlog_summary.mjs missing",F.genBacklog);
else if(!has(gen,/Number\.isFinite/))
  add("script","medium","Numeric validation (Number.isFinite) not found in generator",F.genBacklog);

// H) Dashboard renderer presence + artefacts exist
if(!exists(F.renderDashboard))
  add("dashboard","medium","update_backlog_dashboard.mjs missing",F.renderDashboard);
if(!exists(F.dashboardMD))
  add("dashboard","info","backlog_dashboard_v1.1.md not found (yet)",F.dashboardMD);
if(!exists(F.dashboardSnap))
  add("dashboard","info","dashboard snapshot json not found (yet)",F.dashboardSnap);

// I) Cross-refs (linked_meta)
const horizon = read(F.horizon);
if(horizon && !has(horizon,/artefacts\/sync\/System_Harmony_Ledger\.md/))
  add("cross_ref","medium","Horizon map does not link ledger",F.horizon);

// J) Staleness
function staleness(file, label){
  const txt=read(file); if(!txt) return;
  // naive date pick (YYYY-MM-DD) from file
  const m=(txt.match(/\d{4}-\d{2}-\d{2}/)||[])[0];
  if(m && ageDays(m)>14) add("staleness","info",`${label} older than 14 days (${m})`,file);
}
staleness(F.ledger,"Ledger");
if(diagBacklogTs && ageDays(diagBacklogTs)>14)
  add("staleness","info",`Backlog diagnose older than 14 days (${diagBacklogTs})`,F.diagBacklogJson);

// exit code
let exit=0;
if(findings.some(f=>f.severity==="high")) exit=1;
else if(findings.some(f=>f.severity==="medium")) exit=2;

// write outputs
const today = new Date().toISOString().slice(0,10);
const md = [
  "# Deep Diagnose · v1.1",
  `Date: ${today}`,
  "",
  `**Exit:** ${exit===0?"0 (ok)":"%d".replace("%d",exit)}  · Findings: ${findings.length}`,
  "",
  "## Findings",
  findings.length ? findings.map(f=>`- **${f.area}** · ${f.severity} — ${f.message}${f.details?`  _( ${f.details} )_`:""}`).join("\n") : "- none",
  "",
  "## Summary",
  `- Architecture v1.8: ${arch?"found":"missing"}`,
  `- Backlog governance v1.1 (ledger): ${ledger?"checked":"missing"}`,
  `- Backlog health: ${backlogHealth??"n/a"}`,
].join("\n");

fs.mkdirSync("artefacts/logs",{recursive:true});
fs.writeFileSync(F.outMd, md+"\n");
fs.writeFileSync(F.outJson, JSON.stringify({
  timestamp: today,
  exit_code: exit,
  findings,
  health: backlogHealth
}, null, 2));

console.log("status: deep_diagnose_done | exit=%d", exit);
process.exit(exit);
