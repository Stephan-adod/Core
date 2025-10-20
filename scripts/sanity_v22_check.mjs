import fs from "fs";
const r = (p) => fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
const e = (p) => fs.existsSync(p);

const errors = [];
const notes = [];

function has(str, pat){ return str && str.includes(pat); }

// 1) system_version.json
const sysRaw = r("meta/system_version.json");
if (!sysRaw) errors.push("Missing meta/system_version.json");
let sys = {};
try { sys = JSON.parse(sysRaw||"{}"); } catch { errors.push("system_version.json not valid JSON"); }
if (sys.target_version !== "v2.2.5") errors.push(`target_version expected "v2.2.5" but got "${sys.target_version}"`);
if (sys.phase !== "daas_factory_transition") errors.push(`phase expected "daas_factory_transition" but got "${sys.phase}"`);
if (!Array.isArray(sys.core_docs) || sys.core_docs.length < 5) errors.push("core_docs missing or incomplete in system_version.json");

// 2) Prompt Inventory checks
const inv = r("meta/Prompt_Inventory.md");
if (!inv) errors.push("Missing meta/Prompt_Inventory.md");
if (inv && !has(inv, "| RS-001 |")) errors.push("RS-001 not registered in Prompt_Inventory.md");
if (inv && !has(inv, "| P-010 |")) errors.push("P-010 not registered in Prompt_Inventory.md");

// 3) Lessons/Synthesis presence
if (!e("artefacts/lessons/lesson_snippets")) errors.push("Missing lessons directory");
if (!e("artefacts/syntheses/S-001_reflexive-governance.md")) errors.push("Missing S-001_reflexive-governance.md");

// 4) Lesson Log header
const logRaw = r("artefacts/logs/lesson_log.csv");
if (!logRaw) errors.push("Missing artefacts/logs/lesson_log.csv");
if (logRaw && !/^lesson_id/i.test(logRaw.split(/\r?\n/)[0]||"")) errors.push("lesson_log.csv missing header (first row should be a header)");

// 5) KPI reports
if (!e("artefacts/reports/governance_kpis.json")) errors.push("Missing governance_kpis.json");
if (!e("artefacts/reports/governance_kpis.md")) errors.push("Missing governance_kpis.md");

// Result
const ok = errors.length === 0;
console.log(ok ? "✅ Sanity v2.2.5 — ALL GREEN" : "❌ Sanity v2.2.5 — issues found:");
errors.forEach((m,i)=>console.log(`  ${i+1}. ${m}`));

// summary note (useful in CI job summary)
if (ok) {
  console.log("Notes: RS-001 + P-010 registered; system_version v2.2.5; KPI reports present.");
}

process.exit(ok ? 0 : 1);
