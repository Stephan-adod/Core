#!/usr/bin/env node
import fs from "fs";
import path from "path";

const metaFile   = "meta/system_version.json";
const logsDir    = "artefacts/logs";
const proofsDir  = path.join(logsDir, "proofs");
const lessonsCsv = path.join(logsDir, "lessons_log.csv");
const proofsCsv  = path.join(proofsDir, "proof_log.csv");
const backlogMD  = path.join(logsDir, "backlog_matrix_v2.6.md");

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function exists(p){ try { fs.statSync(p); return true; } catch { return false; } }
function readJson(p){ try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } }
function writeJson(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n"); }
function prependHeaderIfMissing(filePath, header){
  if (!exists(filePath)) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, header + "\n");
    console.log(`created ${filePath}`);
    return;
  }
  const txt = fs.readFileSync(filePath, "utf8");
  const first = header.split("\n")[0];
  if (!txt.trim().startsWith(first)) {
    fs.writeFileSync(filePath, header + (txt.startsWith("\n") ? "" : "\n") + txt);
    console.log(`normalized header in ${filePath}`);
  }
}

(function main(){
  // 1) META normalize
  const nowIso = new Date().toISOString();
  const meta = readJson(metaFile) || {};
  if (!meta.version) meta.version = meta.active || "v2.6.0";
  if (!meta.freeze)  meta.freeze  = "none";
  meta.updated_at = nowIso;                      // audit signal
  writeJson(metaFile, meta);
  console.log(`patched ${metaFile}`);

  // 2) Logs (canonical headers)
  const lessonsHeader = "timestamp,id,scope,phase,lesson,source,owner";
  const proofsHeader  = "id,type,path,owner,status,coverage_note,timestamp";
  ensureDir(proofsDir);
  prependHeaderIfMissing(lessonsCsv, lessonsHeader);
  prependHeaderIfMissing(proofsCsv,  proofsHeader);

  // 3) Backlog matrix v2.6 (only if none exists in live logs dir)
  const hasAnyMatrix = exists(logsDir) && fs.readdirSync(logsDir)
    .some(f => /^backlog_matrix_v[\d.]+\.md$/.test(f));
  if (!hasAnyMatrix) {
    const canonicalHeader = [
      "| ID | Title | Type | Status | Owner | Freeze |",
      "|---:|-------|------|--------|-------|--------|"
    ].join("\n");
    const bootstrap = [
      canonicalHeader,
      "| AT-000 | Enable-Primer Bootstrap | Meta | active | stephan-adod | none |"
    ].join("\n") + "\n";
    fs.writeFileSync(backlogMD, bootstrap);
    console.log(`created ${backlogMD}`);
  } else {
    console.log("active backlog matrix present → no bootstrap needed");
  }

  console.log("Enable-Primer v2.6 complete (non-destructive).");
  process.exitCode = 0;
})();
