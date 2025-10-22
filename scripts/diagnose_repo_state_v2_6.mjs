#!/usr/bin/env node
/**
 * Diagnostic Read-Only Scan v2.6
 * - erzeugt artefacts/logs/diagnostic_report_v2_6.md
 * - erzeugt artefacts/logs/meta_sync_status_v2_6.json
 * - niemals mit Exit-Code != 0 beenden
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const outDir = "artefacts/logs";
const reportPath = path.join(outDir, "diagnostic_report_v2_6.md");
const jsonPath   = path.join(outDir, "meta_sync_status_v2_6.json");

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function readText(p){ try { return fs.readFileSync(p, "utf8"); } catch { return null; } }
function fileExists(p){ try { return fs.statSync(p).isFile(); } catch { return false; } }
function listFilesGitSafe() {
  try {
    const stdout = execSync("git ls-files", { encoding: "utf8" });
    return stdout.split("\n").filter(Boolean);
  } catch {
    // Fallback: naive listing
    const walk = (dir) => {
      let res = [];
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) res = res.concat(walk(full));
        else res.push(full);
      }
      return res;
    };
    return walk(".");
  }
}

function warn(msg){ console.warn(`::warning::${msg}`); }

const checks = {
  meta: {
    systemVersionFile: "meta/system_version.json",
    requiredKeys: ["phase","version","freeze","updated_at"]
  },
  logs: {
    lessonsLog: "artefacts/logs/lessons_log.csv",
    proofLog:   "artefacts/logs/proofs/proof_log.csv",
    backlogMatrixPattern: /^artefacts\/logs\/backlog_matrix_v[\d.]+\.md$/
  },
  workflowsDir: ".github/workflows",
  scriptsDir: "scripts",
  docsDir: "docs"
};

function safeJsonParse(txt){
  try { return JSON.parse(txt); } catch { return null; }
}

function checkMetaSystemVersion() {
  const p = checks.meta.systemVersionFile;
  const raw = readText(p);
  const out = { path: p, exists: !!raw, validJson: false, missingKeys: [], data: null };
  if (!raw) return out;
  const obj = safeJsonParse(raw);
  if (!obj) { return { ...out, validJson:false }; }
  out.validJson = true;
  out.data = obj;
  for (const k of checks.meta.requiredKeys) {
    if (!(k in obj)) out.missingKeys.push(k);
  }
  return out;
}

function grepWorkflowScriptRefs(text){
  // heuristisch: run: node scripts/<file>.mjs
  const re = /run:\s*(?:.+\s)?node\s+scripts\/([\w.\-]+\.mjs)\b/gi;
  const found = new Set();
  let m; 
  while ((m = re.exec(text))) found.add(m[1]);
  return [...found];
}

function basicYamlSanity(text){
  // keine echte YAML-Validierung; heuristischer Check
  const hasName = /^name:\s*.+/m.test(text);
  const hasJobs = /^\s*jobs:\s*$/m.test(text) || /^\s*jobs:\s*\n/m.test(text);
  return { hasName, hasJobs };
}

function scanWorkflows(allFiles){
  const wfFiles = allFiles.filter(f => f.startsWith(checks.workflowsDir) && f.endsWith(".yml"));
  const results = [];
  const missingScripts = new Set();
  const sanityIssues = [];
  for (const wf of wfFiles) {
    const txt = readText(wf) ?? "";
    const sanity = basicYamlSanity(txt);
    if (!sanity.hasName || !sanity.hasJobs) {
      sanityIssues.push({ workflow: wf, sanity });
    }
    const refs = grepWorkflowScriptRefs(txt);
    for (const r of refs) {
      const p = path.join(checks.scriptsDir, r);
      if (!fileExists(p)) missingScripts.add(p);
    }
    results.push({ workflow: wf, scriptRefs: refs });
  }
  return { wfFiles, results, missingScripts: [...missingScripts], sanityIssues };
}

function checkBacklogMatrices(allFiles){
  const matrices = allFiles.filter(f => checks.logs.backlogMatrixPattern.test(f));
  const headerCanonical = [
    "| ID | Title | Type | Status | Owner | Freeze |",
    "|---:|-------|------|--------|-------|--------|"
  ];
  const drifts = [];
  for (const m of matrices) {
    const txt = readText(m) || "";
    const lines = txt.split("\n").slice(0,6);
    const mismatch = !(lines[0]?.trim()===headerCanonical[0] && lines[1]?.trim()===headerCanonical[1]);
    if (mismatch) drifts.push({ file: m, hint: "Header != canonical" });
  }
  return { matrices, drifts };
}

function checkDocsPresence(){
  // Minimal: README + docs/ existiert? (heuristisch)
  const readme = ["README.md","Readme.md","readme.md"].find(fileExists);
  const hasDocsDir = (()=>{ try { return fs.statSync(checks.docsDir).isDirectory(); } catch { return false; }})();
  return { readme: readme || null, hasDocsDir };
}

function checkLessonsProofs(){
  return {
    lessonsExists: fileExists(checks.logs.lessonsLog),
    proofsExists:  fileExists(checks.logs.proofLog),
  };
}

function writeReport({ metaStatus, wf, backlog, docs, lp, allFiles }) {
  const ts = new Date().toISOString();
  const lines = [];
  lines.push(`# Diagnostic Report v2.6 (Read-Only)`);
  lines.push(`_timestamp: ${ts}_`);
  lines.push("");
  lines.push("## Summary");
  const summary = {
    meta_system_version: metaStatus.exists && metaStatus.validJson && metaStatus.missingKeys.length===0 ? "ok" : "review",
    workflows_count: wf.wfFiles.length,
    workflow_sanity_issues: wf.sanityIssues.length,
    missing_script_refs: wf.missingScripts.length,
    backlog_matrices: backlog.matrices.length,
    backlog_header_drifts: backlog.drifts.length,
    docs_present: !!docs.readme,
    docs_dir: docs.hasDocsDir,
    lessons_log: lp.lessonsExists,
    proofs_log: lp.proofsExists
  };
  lines.push("```json");
  lines.push(JSON.stringify(summary, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("## Meta · system_version.json");
  lines.push("- Path: `" + checks.meta.systemVersionFile + "`");
  lines.push("- Exists: " + !!metaStatus.exists);
  lines.push("- Valid JSON: " + !!metaStatus.validJson);
  lines.push("- Missing keys: " + (metaStatus.missingKeys?.join(", ") || ""));
  if (metaStatus.data) {
    lines.push("```json");
    lines.push(JSON.stringify(metaStatus.data, null, 2));
    lines.push("```");
  }
  lines.push("");
  lines.push("## Workflows");
  lines.push(`- Count: ${wf.wfFiles.length}`);
  if (wf.sanityIssues.length) {
    lines.push("### Sanity issues (heuristic)");
    wf.sanityIssues.forEach(i => lines.push(`- ${i.workflow} → name:${i.sanity.hasName?'ok':'missing'}, jobs:${i.sanity.hasJobs?'ok':'missing'}`));
  }
  if (wf.missingScripts.length) {
    lines.push("### Missing script refs (from workflow run steps)");
    wf.missingScripts.forEach(s => lines.push(`- ${s}`));
  }
  lines.push("");
  lines.push("## Backlog Matrices");
  lines.push(`- Files: ${backlog.matrices.length}`);
  if (backlog.drifts.length) {
    lines.push("### Header drifts");
    backlog.drifts.forEach(d => lines.push(`- ${d.file} → ${d.hint}`));
  }
  lines.push("");
  lines.push("## Docs Presence");
  lines.push(`- README: ${docs.readme || "not found"}`);
  lines.push(`- docs/ dir: ${docs.hasDocsDir}`);
  lines.push("");
  lines.push("## Lessons & Proofs Logs");
  lines.push(`- lessons_log.csv: ${lp.lessonsExists}`);
  lines.push(`- proof_log.csv: ${lp.proofsExists}`);
  lines.push("");
  lines.push("## File Inventory (git ls-files)");
  lines.push("<details><summary>Show</summary>");
  lines.push("");
  lines.push(allFiles.map(f => `- ${f}`).join("\n"));
  lines.push("");
  lines.push("</details>");
  ensureDir(outDir);
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

function writeJsonStatus(payload){
  ensureDir(outDir);
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");
}

(function main(){
  const allFiles = listFilesGitSafe();

  const metaStatus = checkMetaSystemVersion();
  if (!metaStatus.exists) warn(`Missing ${checks.meta.systemVersionFile}`);
  if (metaStatus.exists && !metaStatus.validJson) warn(`Invalid JSON in ${checks.meta.systemVersionFile}`);
  if (metaStatus.missingKeys?.length) warn(`Missing keys in system_version.json: ${metaStatus.missingKeys.join(", ")}`);

  const wf = scanWorkflows(allFiles);
  if (wf.sanityIssues.length) warn(`${wf.sanityIssues.length} workflow sanity issue(s)`);
  if (wf.missingScripts.length) warn(`Missing script files referenced in workflows: ${wf.missingScripts.length}`);

  const backlog = checkBacklogMatrices(allFiles);
  if (backlog.drifts.length) warn(`${backlog.drifts.length} backlog header drift(s)`);

  const docs = checkDocsPresence();
  if (!docs.readme) warn("README not found");
  if (!docs.hasDocsDir) warn("docs/ directory missing");

  const lp = checkLessonsProofs();
  if (!lp.lessonsExists) warn("lessons_log.csv not found");
  if (!lp.proofsExists) warn("proof_log.csv not found");

  // Compose machine-readable status
  const status = {
    timestamp: new Date().toISOString(),
    meta: {
      system_version_exists: !!metaStatus.exists,
      system_version_valid: !!metaStatus.validJson,
      missing_meta_keys: metaStatus.missingKeys || []
    },
    workflows: {
      count: wf.wfFiles.length,
      sanity_issues: wf.sanityIssues,
      missing_script_files: wf.missingScripts
    },
    backlog: {
      matrices: backlog.matrices,
      header_drifts: backlog.drifts
    },
    docs: {
      readme_present: !!docs.readme,
      docs_dir_present: !!docs.hasDocsDir
    },
    logs: {
      lessons_log_present: lp.lessonsExists,
      proof_log_present: lp.proofsExists
    }
  };

  writeReport({ metaStatus, wf, backlog, docs, lp, allFiles });
  writeJsonStatus(status);

  console.log(`Diagnostic complete → ${reportPath}`);
  console.log(`Status JSON → ${jsonPath}`);
  // Always succeed (read-only)
  process.exitCode = 0;
})();
