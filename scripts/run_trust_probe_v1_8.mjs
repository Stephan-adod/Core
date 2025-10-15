#!/usr/bin/env node
import fs from "fs";
import path from "path";

const nowISO = new Date().toISOString().slice(0,10);
const OUT_MD   = "artefacts/logs/trust_probe_v1.8.md";
const OUT_JSON = "artefacts/logs/trust_probe_v1.8.json";
const LEDGER   = "artefacts/sync/System_Harmony_Ledger.md";
const ARCH     = "meta/AI_First_System_Architecture_v1.8.md";
const HORIZON  = "meta/Horizon_Map_v1.8.md";
const BUSINESS = "docs/BUSINESS_CASE_Horizon_v1.8.md";
const DIAG_JSON= "artefacts/logs/diagnose_core_v3.json";
const LESSONS  = "artefacts/logs/lessons_AT-015_v1.md";

function safeRead(p){ try{ return fs.readFileSync(p,"utf8"); }catch{ return ""; } }
function has(s, pat){ return s.includes(pat); }

let findings = [];
function add(area, severity, message, pathRef){ findings.push({area,severity,message,path:pathRef||null}); }

const arch = safeRead(ARCH);
const horizon = safeRead(HORIZON);
const business = safeRead(BUSINESS);
const ledger = safeRead(LEDGER);
const diag = safeRead(DIAG_JSON);
const lessons = safeRead(LESSONS);

// 1) Architecture Integrity (20%)
let archOK = has(arch,"version: v1.8") && has(arch,"governance: freeze v1.8");
if(!archOK) add("architecture","high","Architecture not frozen v1.8",ARCH);

// 2) Linked Meta / Freeze Cohesion (Horizon/Business)
let linkOK = has(horizon, "AI_First_System_Architecture_v1.8.md") && has(horizon, "BUSINESS_CASE_Horizon_v1.8.md");
if(!linkOK) add("links","medium","Horizon linked_meta missing references",HORIZON);

// 3) Ledger Validity (25%) – Harmony & required KPIs present
let ledgerOK = has(ledger,"System Harmony Ledger") &&
               /Last Updated\s*\|\s*\d{4}-\d{2}-\d{2}/.test(ledger) &&
               has(ledger,"System Harmony Score") && has(ledger,"Policy Valid") && has(ledger,"Version Sync");
if(!ledgerOK) add("ledger","high","Ledger missing core metrics or last updated",LEDGER);

// 4) Diagnostics (exit_code=0 & harmony ok)
let diagOK = false;
try {
  const d = JSON.parse(diag || "{}");
  const exit = (typeof d.exit_code === "number") ? d.exit_code : (d.exit_code ?? d.exitCode);
  diagOK = exit === 0;
  if(!diagOK) add("diagnostics","high","diagnose_core_v3 exit_code != 0",DIAG_JSON);
} catch {
  add("diagnostics","high","diagnose_core_v3.json not parseable",DIAG_JSON);
}

// 5) CI Reliability (20%) – validator supports exit 2 and workflow has push/pr
const wf = safeRead(".github/workflows/ledger_validate.yml");
const ciOK = /push:|pull_request:/.test(wf) && /continue-on-error:\s*true/.test(wf);
if(!ciOK) add("ci","medium","CI missing push/pr triggers or tolerate-warnings mode",".github/workflows/ledger_validate.yml");

// 6) Human Audit (15%) – Lessons exist with ≥1 section
const lessonsOK = lessons && /What Worked|Challenges|Next Iteration/i.test(lessons);
if(!lessonsOK) add("human","medium","Lessons log missing or incomplete",LESSONS);

// 7) Meta-Sync Coherence (20%) – governance freeze reflected in ledger & links
const metaSyncOK = has(ledger,"governance: freeze v1.8") || /Freeze Status\s*\|\s*true/.test(ledger);
if(!metaSyncOK) add("meta-sync","medium","Ledger not reflecting freeze v1.8",LEDGER);

// Scoreberechnung
function pct(b){ return b?1:0; }
const w = {arch:0.20, ledger:0.25, ci:0.20, human:0.15, meta:0.20};
const score =
  pct(archOK)*w.arch +
  pct(ledgerOK)*w.ledger +
  pct(ciOK)*w.ci +
  pct(lessonsOK)*w.human +
  pct(metaSyncOK)*w.meta;

const scorePct = Math.round(score*100);

// Exit Mapping
let exit = 0;
if (findings.some(f=>f.severity==="high")) exit = 1;
else if (findings.length>0) exit = 2;

// Markdown Report
fs.mkdirSync(path.dirname(OUT_MD), {recursive:true});
fs.writeFileSync(OUT_MD, [
  "# Trust Probe Report · v1.8",
  `Date: ${nowISO}`,
  "",
  `**Trust Score:** ${scorePct}%  ${exit===0?"🟢":" "}${exit===2?"🟡":""}${exit===1?"🔴":""}`,
  "",
  "## Summary",
  `- Architecture Frozen v1.8: ${archOK? "✅":"❌"}`,
  `- Ledger Validity: ${ledgerOK? "✅":"❌"}`,
  `- CI Reliability: ${ciOK? "✅":"⚠️"}`,
  `- Lessons Present: ${lessonsOK? "✅":"⚠️"}`,
  `- Meta-Sync Coherence: ${metaSyncOK? "✅":"⚠️"}`,
  "",
  "## Findings",
  findings.length? findings.map(f=>`- [${f.area}] (${f.severity}) ${f.message}${f.path?` · ${f.path}`:""}`).join("\n") : "- none",
  "",
  "## Exit",
  `exit_code=${exit}`
].join("\n") + "\n");

// JSON Report
fs.writeFileSync(OUT_JSON, JSON.stringify({
  timestamp: nowISO,
  score: scorePct,
  exit_code: exit,
  checks: {
    architecture: archOK,
    ledger: ledgerOK,
    ci_reliability: ciOK,
    lessons_present: lessonsOK,
    meta_sync: metaSyncOK
  },
  findings
}, null, 2) + "\n");

// Ledger-Update: Trust-Audit-Record (nicht-destruktiv, Header beibehalten)
let led = ledger || "";
if (!/## Governance Freeze Records/.test(led)) {
  led += "\n\n## Governance Freeze Records\n\n| Metric | Value | Target | Source | Last Update |\n|---|---|---|---|---|\n";
}
led += `| Last Trust Audit | ${scorePct}% | ≥ 90% | artefacts/logs/trust_probe_v1.8.md | ${nowISO} |\n`;
fs.writeFileSync(LEDGER, led);

// Console 5-Zeilen-Output
console.log("status: running | trust_probe_v1_8");
console.log(`arch=${archOK} | ledger=${ledgerOK} | ci=${ciOK} | lessons=${lessonsOK} | metasync=${metaSyncOK}`);
console.log(`trust_score=${scorePct}`);
console.log("reports=written (artefacts/logs/trust_probe_v1.8.*)");
console.log(`exit_code=${exit}`);
process.exit(exit);
