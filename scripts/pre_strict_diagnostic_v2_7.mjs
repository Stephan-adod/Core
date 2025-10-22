#!/usr/bin/env node
/**
 * Pre-Strict Diagnostic v2.7 (Readiness Check)
 * - Nicht-destruktiv, exit 0
 * - Schreibt:
 *   - artefacts/logs/pre_strict_diagnostic_report_v2_7.md
 *   - artefacts/logs/pre_strict_sync_status_v2_7.json
 */
import fs from "fs";
import path from "path";

const outDir   = "artefacts/logs";
const mdPath   = path.join(outDir, "pre_strict_diagnostic_report_v2_7.md");
const jsonPath = path.join(outDir, "pre_strict_sync_status_v2_7.json");

// utils
const exists = (p) => { try { fs.statSync(p); return true; } catch { return false; } };
const read  = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const readJson = (p) => { try { return JSON.parse(read(p)); } catch { return null; } };
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const warn = (msg) => console.warn(`::warning::${msg}`);

// canonical expectations
const EXPECT = {
  metaFile: "meta/system_version.json",
  policySourceKey: "policy_source",
  lessonsCsv: "artefacts/logs/lessons_log.csv",
  proofsCsv:  "artefacts/logs/proofs/proof_log.csv",
  backlogPattern: /^artefacts\/logs\/backlog_matrix_v[\d.]+\.md$/,
  prTemplate: ".github/pull_request_template.md",
  prRequiredAnchors: [
    /^# AI-First Handbook Compliance/m,
    /^## Intent/m,
    /^## Logging Reference/m,
    /^## Policy Source/m,
    /^## Policy Version/m
  ]
};

// scoring helper
function scorePart(ok){ return ok ? 1 : 0; }
/** weighted score in percent */
function computeScore(flags){
  const weights = {
    metaKeys: 3, policySourceExists: 2, lessonsCsv: 2, proofsCsv: 2,
    backlogPresent: 2, backlogHeaderCanonical: 2,
    prTemplateExists: 2, prAnchorsOk: 3
  };
  const max = Object.values(weights).reduce((a,b)=>a+b,0);
  const got = (
    weights.metaKeys                * scorePart(flags.metaKeys) +
    weights.policySourceExists      * scorePart(flags.policySourceExists) +
    weights.lessonsCsv              * scorePart(flags.lessonsCsv) +
    weights.proofsCsv               * scorePart(flags.proofsCsv) +
    weights.backlogPresent          * scorePart(flags.backlogPresent) +
    weights.backlogHeaderCanonical  * scorePart(flags.backlogHeaderCanonical) +
    weights.prTemplateExists        * scorePart(flags.prTemplateExists) +
    weights.prAnchorsOk             * scorePart(flags.prAnchorsOk)
  );
  return Math.round(100 * got / max);
}

function checkBacklog(files){
  const matrices = files.filter(f => EXPECT.backlogPattern.test(f));
  if (!matrices.length) return { present:false, headerCanonical:false, files:[] };
  const file = matrices.sort().reverse()[0];
  const txt = read(file) || "";
  const lines = txt.split("\n");
  const header1 = "| ID | Title | Type | Status | Owner | Freeze |";
  const header2 = "|---:|-------|------|--------|-------|--------|";
  const headerCanonical = lines[0]?.trim()===header1 && lines[1]?.trim()===header2;
  return { present:true, headerCanonical, files: matrices };
}

function listTracked(){
  try {
    return require("child_process").execSync("git ls-files", {encoding:"utf8"})
      .split("\n").filter(Boolean);
  } catch {
    // naive fallback
    const walk=(d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{
      const p=path.join(d,e.name);
      return e.isDirectory()?walk(p):[p];
    });
    return walk(".");
  }
}

(function main(){
  const files = listTracked();

  // META
  const meta = readJson(EXPECT.metaFile);
  let metaKeysOk=false, policySrcOk=false;
  if (!meta) {
    warn(`Missing or invalid JSON: ${EXPECT.metaFile}`);
  } else {
    const need = ["version","freeze","updated_at"];
    const missing = need.filter(k=>!(k in meta));
    metaKeysOk = missing.length===0;
    if (!metaKeysOk) warn(`Missing meta keys in system_version.json: ${missing.join(", ")}`);
    const pkey = EXPECT.policySourceKey;
    policySrcOk = !!(meta && meta[pkey] && exists(meta[pkey]));
    if (!policySrcOk) warn(`Policy source missing or path invalid (key "${pkey}")`);
  }

  // LOGS
  const lessonsOk = exists(EXPECT.lessonsCsv);
  if (!lessonsOk) warn("lessons_log.csv not found (artefacts/logs)");
  const proofsOk  = exists(EXPECT.proofsCsv);
  if (!proofsOk)  warn("proof_log.csv not found (artefacts/logs/proofs)");

  // BACKLOG
  const backlog = checkBacklog(files);
  if (!backlog.present) warn("No backlog_matrix_v*.md present under artefacts/logs");
  if (backlog.present && !backlog.headerCanonical) warn("Backlog matrix header is not canonical");

  // PR TEMPLATE
  const prTplExists = exists(EXPECT.prTemplate);
  let prAnchorsOk=false;
  if (!prTplExists) {
    warn("PR template (.github/pull_request_template.md) not found");
  } else {
    const body = read(EXPECT.prTemplate) || "";
    prAnchorsOk = EXPECT.prRequiredAnchors.every((re)=>re.test(body));
    if (!prAnchorsOk) warn("PR template is missing one or more required anchors (Compliance, Intent, Logging Reference, Policy Source, Policy Version).");
  }

  const flags = {
    metaKeys: metaKeysOk,
    policySourceExists: policySrcOk,
    lessonsCsv: lessonsOk,
    proofsCsv: proofsOk,
    backlogPresent: backlog.present,
    backlogHeaderCanonical: backlog.headerCanonical,
    prTemplateExists: prTplExists,
    prAnchorsOk: prAnchorsOk
  };
  const score = computeScore(flags);

  // write outputs
  ensureDir(outDir);

  const summary = {
    timestamp: new Date().toISOString(),
    score,
    gates: flags,
    pointers: {
      meta_file: EXPECT.metaFile,
      policy_source: meta?.[EXPECT.policySourceKey] || null,
      lessons_csv: EXPECT.lessonsCsv,
      proofs_csv: EXPECT.proofsCsv,
      backlog_candidates: backlog.files,
      pr_template: EXPECT.prTemplate
    }
  };
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

  const lines = [];
  lines.push("# Pre-Strict Diagnostic Report v2.7");
  lines.push(`_generated: ${summary.timestamp}_`);
  lines.push("");
  lines.push("## Readiness Score");
  lines.push("```json");
  lines.push(JSON.stringify({ score }, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Gates");
  lines.push("```json");
  lines.push(JSON.stringify(flags, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Notes");
  if (score === 100) {
    lines.push("- All strict gates satisfied. You can safely enable v2.7 (Strict).");
  } else {
    lines.push("- See ::warning annotations in CI logs for remediation hints.");
  }
  lines.push("");
  lines.push("## Pointers");
  lines.push("```json");
  lines.push(JSON.stringify(summary.pointers, null, 2));
  lines.push("```");
  fs.writeFileSync(mdPath, lines.join("\n"));

  console.log(`Pre-Strict Diagnostic complete → ${mdPath}`);
  console.log(`Status JSON → ${jsonPath}`);
  process.exitCode = 0; // never fail (read-only)
})();
