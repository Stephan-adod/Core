#!/usr/bin/env node
/**
 * Enable-Primer v2.6 (non-destructive)
 * - Füllt fehlende Meta-Keys (version, freeze, updated_at) in meta/system_version.json
 * - Legt Logs (lessons_log.csv, proofs/proof_log.csv) an, falls fehlen (mit Headern)
 * - Erstellt eine kanonische Backlog-Matrix v2.6, falls keine aktive Matrix vorhanden
 * - Niemals mit Exit-Code != 0 beenden
 */
import fs from "fs";
import path from "path";

const metaFile = "meta/system_version.json";
const logsDir = "artefacts/logs";
const proofsDir = path.join(logsDir, "proofs");
const lessonsCsv = path.join(logsDir, "lessons_log.csv");
const proofsCsv  = path.join(proofsDir, "proof_log.csv");
const backlogFile = path.join(logsDir, "backlog_matrix_v2.6.md");

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }
function exists(p){ try { fs.statSync(p); return true; } catch { return false; } }
function readJson(p){ try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } }
function writeJson(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2)+"\n"); }
function appendIfMissing(filePath, header){
  if (!exists(filePath)) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, header + "\n");
    console.log(`created ${filePath}`);
  } else {
    const txt = fs.readFileSync(filePath, "utf8");
    if (!txt.trim().startsWith(header.split("\n")[0])) {
      // prepend header if missing
      fs.writeFileSync(filePath, header + (txt.startsWith("\n")?"": "\n") + txt);
      console.log(`normalized header in ${filePath}`);
    }
  }
}

(function main(){
  // 1) META: system_version.json keys ergänzen
  const nowIso = new Date().toISOString();
  let meta = readJson(metaFile) || {};
  // Bewahre bestehende Felder; nur fehlende hinzufügen.
  if (!meta.version) {
    // Heuristik: falls "active" existiert, nimm diese; sonst "v2.6.0"
    meta.version = meta.active || "v2.6.0";
  }
  if (!meta.freeze) {
    // „none“ als konservativer Default (wir re-enablen gleich lean)
    meta.freeze = "none";
  }
  if (!meta.updated_at) {
    meta.updated_at = nowIso;
  }
  writeJson(metaFile, meta);
  console.log(`patched ${metaFile}`);

  // 2) Logs: lessons + proofs anlegen/normalisieren (Header)
  const lessonsHeader = "timestamp,id,scope,phase,lesson,source,owner";
  appendIfMissing(lessonsCsv, lessonsHeader);

  const proofsHeader = "id,type,path,owner,status,coverage_note,timestamp";
  ensureDir(proofsDir);
  appendIfMissing(proofsCsv, proofsHeader);

  // 3) Backlog-Matrix v2.6 (kanonischer Header), falls keine aktive Matrix existiert
  const canonicalHeader = [
    "| ID | Title | Type | Status | Owner | Freeze |",
    "|---:|-------|------|--------|-------|--------|"
  ].join("\n");

  // Prüfe, ob irgendeine aktive Matrix unter artefacts/logs/backlog_matrix_v*.md existiert
  const hasActiveMatrix = (() => {
    try {
      const files = fs.readdirSync(logsDir).filter(f => /^backlog_matrix_v[\d.]+\.md$/.test(f));
      return files.length > 0;
    } catch { return false; }
  })();

  if (!hasActiveMatrix) {
    const bootstrap = [
      canonicalHeader,
      `| AT-000 | Enable-Primer Bootstrap | Meta | active | stephan-adod | none |`
    ].join("\n") + "\n";
    fs.writeFileSync(backlogFile, bootstrap);
    console.log(`created ${backlogFile}`);
  } else {
    console.log("active backlog matrix present → no bootstrap needed");
  }

  console.log("Enable-Primer v2.6 complete (non-destructive).");
  process.exitCode = 0;
})();
