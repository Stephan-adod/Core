#!/usr/bin/env node
import fs from "fs";
import path from "path";

const NOW = new Date();
const TODAY = NOW.toISOString().slice(0,10);

const OUT_DIR = "artefacts/logs/meta";
const OUT_MD  = `${OUT_DIR}/diagnose_meta_v1.8.md`;
const OUT_JSON= `${OUT_DIR}/diagnose_meta_v1.8.json`;

const ARCH     = "meta/AI_First_System_Architecture_v1.8.md";
const HORIZON  = "meta/Horizon_Map_v1.8.md";
const BUSINESS = "docs/BUSINESS_CASE_Horizon_v1.8.md";
const LEDGER   = "artefacts/sync/System_Harmony_Ledger.md";
const CORE_DIAG= "artefacts/logs/diagnose_core_v3.json";
const TRUST_J  = "artefacts/logs/trust_probe_v1.8.json";
const LESSONS  = "artefacts/logs/lessons_AT-015_v1.md";

function read(p){ try { return fs.readFileSync(p,"utf8"); } catch { return ""; } }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }
function has(s,pat){ return s.includes(pat); }
function ageDays(p){
  try{ const st=fs.statSync(p); return Math.floor((NOW - st.mtime)/(1000*60*60*24)); }
  catch{ return Infinity; }
}

const findings = [];
function add(area, severity, message, pathRef){ findings.push({area,severity,message,path:pathRef||null}); }

// 1) Freeze Integrity (Governance == Ledger)
const arch = read(ARCH);
const ledger = read(LEDGER);
const freezeArch = has(arch, "governance: freeze v1.8") && has(arch, "version: v1.8");
const freezeLedger = /governance:\s*freeze v1\.8/.test(ledger) || /Freeze Status\s*\|\s*true/.test(ledger);
if(!freezeArch)   add("freeze","high","Architecture not in freeze v1.8",ARCH);
if(!freezeLedger) add("freeze","high","Ledger does not reflect freeze v1.8",LEDGER);

// 2) Diagnostics Coverage (core v3 + trust v1.8 exist + valid)
let coreOK=false, trustOK=false, trustScore=0;
try{
  const j = JSON.parse(read(CORE_DIAG)||"{}");
  coreOK = (j.exit_code===0);
  if(!coreOK) add("diagnostics","high","diagnose_core_v3 exit_code != 0",CORE_DIAG);
}catch{ add("diagnostics","high","diagnose_core_v3.json not parseable",CORE_DIAG); }

try{
  const t = JSON.parse(read(TRUST_J)||"{}");
  trustScore = Number(t.score||t.trust_score||0);
  const exit = Number(t.exit_code ?? 1);
  trustOK = (exit===0 && trustScore>=90);
  if(!trustOK) add("trust","medium",`Trust Probe below threshold (score=${trustScore} / exit=${exit})`,TRUST_J);
}catch{ add("trust","high","trust_probe_v1.8.json missing or invalid",TRUST_J); }

// 3) Lessons Compliance (exist & fresh <=14d)
const lessonsExist = exists(LESSONS);
const lessonsAge = ageDays(LESSONS);
const lessonsFresh = lessonsExist && lessonsAge <= 14;
if(!lessonsExist) add("lessons","medium","Lessons log missing",LESSONS);
else if(!lessonsFresh) add("lessons","medium",`Lessons older than 14 days (age=${lessonsAge}d)`,LESSONS);

// 4) Meta-Harmony (Cross-Refs)
const horizon = read(HORIZON);
const business = read(BUSINESS);
const linksOK =
  (/AI_First_System_Architecture_v1\.8\.md/.test(horizon) || /path:\s*meta\/AI_First_System_Architecture_v1\.8\.md/.test(horizon)) &&
  (/BUSINESS_CASE_Horizon_v1\.8\.md/.test(horizon) || /path:\s*docs\/BUSINESS_CASE_Horizon_v1\.8\.md/.test(horizon)) &&
  (/System_Harmony_Ledger\.md/.test(horizon) || /path:\s*artefacts\/sync\/System_Harmony_Ledger\.md/.test(horizon));
if(!linksOK) add("meta-links","medium","Horizon linked_meta incomplete (arch/business/ledger)",HORIZON);

// Score gemäß Prompt (Freeze 25, Coverage 20, Trust 25, Lessons 15, Meta 15)
const w = {freeze:0.25, coverage:0.20, trust:0.25, lessons:0.15, meta:0.15};
const freezeOK = freezeArch && freezeLedger;
const coverageOK = coreOK && exists(TRUST_J);
const lessonsOK = lessonsFresh;
const metaOK = linksOK;

function asBool(b){ return b?1:0; }
const score =
  asBool(freezeOK)*w.freeze +
  asBool(coverageOK)*w.coverage +
  asBool(trustOK)*w.trust +
  asBool(lessonsOK)*w.lessons +
  asBool(metaOK)*w.meta;
const scorePct = Math.round(score*100);

// Exit mapping
let exit = 0;
if (findings.some(f=>f.severity==="high")) exit = 1;
else if (findings.length>0) exit = 2;

// Ensure output dir
fs.mkdirSync(OUT_DIR, {recursive:true});

// Markdown report
const md = [
  "# Meta Diagnosis · v1.8",
  `Date: ${TODAY}`,
  "",
  `**Meta Score:** ${scorePct}% ${exit===0?"🟢":exit===2?"🟡":"🔴"}`,
  "",
  "## Summary",
  `- Freeze Integrity: ${freezeOK?"✅":"❌"}`,
  `- Diagnostics Coverage: ${coverageOK?"✅":"⚠️"}`,
  `- Trust Probe ≥ 90%: ${trustOK?`✅ (${trustScore}%)`:`⚠️ (${trustScore}%)`}`,
  `- Lessons fresh (≤14d): ${lessonsOK?`✅ (${lessonsAge}d)`:"⚠️ (" + (isFinite(lessonsAge)?lessonsAge:"n/a") + "d)"}`,
  `- Meta Links: ${metaOK?"✅":"⚠️"}`,
  "",
  "## Findings",
  findings.length ? findings.map(f=>`- [${f.area}] (${f.severity}) ${f.message}${f.path?` · ${f.path}`:""}`).join("\n") : "- none",
  "",
  "## Exit",
  `exit_code=${exit}`
].join("\n") + "\n";
fs.writeFileSync(OUT_MD, md);

// JSON report
fs.writeFileSync(OUT_JSON, JSON.stringify({
  timestamp: TODAY,
  score: scorePct,
  exit_code: exit,
  checks: {
    freeze_integrity: freezeOK,
    diagnostics_coverage: coverageOK,
    trust_probe_ok: trustOK,
    lessons_fresh: lessonsOK,
    meta_links_ok: metaOK,
    trust_score: trustScore,
    lessons_age_days: lessonsAge
  },
  findings
}, null, 2) + "\n");

// Append ledger record
let led = ledger || "";
if (!/## Meta Diagnostics Records/.test(led)) {
  led += "\n\n## Meta Diagnostics Records\n\n| Metric | Value | Target | Source | Last Update |\n|---|---|---|---|---|\n";
}
led += `| Last Meta Diagnosis | ${scorePct}% | ≥ 95% | ${OUT_MD} | ${TODAY} |\n`;
fs.writeFileSync(LEDGER, led);

// Console 5-liner
console.log("status: running | diagnose_meta_v1_8");
console.log(`freeze=${freezeOK} | coverage=${coverageOK} | trust=${trustOK} | lessons=${lessonsOK} | meta=${metaOK}`);
console.log(`meta_score=${scorePct}`);
console.log(`reports=written (${OUT_MD}, ${OUT_JSON})`);
console.log(`exit_code=${exit}`);
process.exit(exit);
