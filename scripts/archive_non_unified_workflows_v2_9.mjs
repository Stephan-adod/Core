#!/usr/bin/env node
/**
 * Archive non-unified workflows:
 * - moves .yml/.yaml from .github/workflows to .github/workflows/archive/
 * - rewrites 'on:' section to only 'workflow_dispatch'
 * - writes an audit report artefacts/logs/workflow_archive_report_v2_9.json
 *
 * Keep-list (remain active): enforce_unified_v2_7.yml, audit_phase_2_9.yml
 */
import fs from "fs";
import path from "path";

const WF_DIR = ".github/workflows";
const ARCHIVE_DIR = path.join(WF_DIR, "archive");
const REPORT = "artefacts/logs/workflow_archive_report_v2_9.json";

const KEEP = new Set([
  "enforce_unified_v2_7.yml",
  "audit_phase_2_9.yml", // falls vorhanden; sonst ignoriert
]);

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }

function isYaml(f){
  return f.endsWith(".yml") || f.endsWith(".yaml");
}

function rewriteToDispatchOnly(yamlText){
  // sehr simple Umschreibung: 'on:' Block ersetzen
  // robust genug für Archivzwecke; original Triggers werden entfernt
  const lines = yamlText.split(/\r?\n/);
  const out = [];
  let inOn = false;
  let onIndent = "";
  let replaced = false;

  for (let i=0; i<lines.length; i++){
    const L = lines[i];
    if (!inOn && /^\s*on\s*:/.test(L)) {
      // begin 'on:' block — wir ersetzen ihn komplett
      inOn = true;
      onIndent = (L.match(/^(\s*)/)||["",""])[1];
      out.push(`${onIndent}on:`);
      out.push(`${onIndent}  workflow_dispatch: {}`);
      replaced = true;
      continue;
    }
    if (inOn) {
      // wir skippen bis zur nächsten Top-Level Key-Zeile
      const indent = (L.match(/^(\s*)/) || ["", ""])[1];
      const nextKey = /^\s*[a-zA-Z_][\w-]*\s*:/.test(L);
      if (nextKey && indent.length <= onIndent.length) {
        // Ende des 'on:' blocks, ab hier normal weiter
        inOn = false;
        out.push(L);
      } else {
        // skip alle Zeilen innerhalb on:
        continue;
      }
    } else {
      out.push(L);
    }
  }

  if (!replaced) {
    // Falls kein 'on:' gefunden wurde, preprenden wir einen
    return `on:\n  workflow_dispatch: {}\n` + yamlText;
  }
  return out.join("\n");
}

function main(){
  ensureDir(ARCHIVE_DIR);
  ensureDir(path.dirname(REPORT));

  const entries = fs.readdirSync(WF_DIR).filter(isYaml);
  const archived = [];
  const kept = [];

  for (const f of entries){
    if (KEEP.has(f)) {
      kept.push(f);
      continue;
    }
    const src = path.join(WF_DIR, f);
    const dst = path.join(ARCHIVE_DIR, f);

    const txt = fs.readFileSync(src, "utf8");
    const rewritten = rewriteToDispatchOnly(txt);

    // prepend Archiv-Hinweis
    const banner = [
      "# NOTE: Archived workflow. Manual runs only.",
      "# Moved by scripts/archive_non_unified_workflows_v2_9.mjs",
      "# Original file name: " + f,
      ""
    ].join("\n");
    fs.writeFileSync(dst, banner + rewritten, "utf8");
    fs.unlinkSync(src);

    archived.push(f);
  }

  const report = {
    timestamp: new Date().toISOString(),
    keep_list: Array.from(KEEP),
    archived,
    kept
  };
  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  console.log(`Archived ${archived.length} workflow(s). Kept: ${kept.join(", ") || "-"}`);
}
main();
