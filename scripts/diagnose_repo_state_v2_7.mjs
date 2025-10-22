#!/usr/bin/env node
/**
 * Mini-Audit Snapshot · v2.7 Strict
 * - Read-only (exit 0)
 * - Writes:
 *   artefacts/logs/diagnostic_report_v2_7.md
 *   artefacts/logs/meta_sync_status_v2_7.json
 */
import fs from "fs"; import path from "path"; import { execSync } from "child_process";

const OUT_DIR = "artefacts/logs";
const RPT = path.join(OUT_DIR, "diagnostic_report_v2_7.md");
const JSONP = path.join(OUT_DIR, "meta_sync_status_v2_7.json");

const exists = p => { try { fs.statSync(p); return true; } catch { return false; } };
const read = p => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const readJson = p => { try { return JSON.parse(read(p)); } catch { return null; } };
const ensureDir = d => fs.mkdirSync(d, { recursive: true });

function lsFiles(){
  try { return execSync("git ls-files", {encoding:"utf8"}).trim().split("\n"); }
  catch { return []; }
}

(function main(){
  const ts = new Date().toISOString();
  ensureDir(OUT_DIR);

  const meta = readJson("meta/system_version.json");
  const lessonsCsv = exists("artefacts/logs/lessons_log.csv");
  const proofsCsv  = exists("artefacts/logs/proofs/proof_log.csv");
  const backlog    = exists("artefacts/logs/backlog_matrix_v2.6.md") || exists("artefacts/logs/backlog_matrix_v2_6.md");
  const prTpl      = exists(".github/pull_request_template.md");

  const flags = {
    system_version_valid: !!meta,
    missing_meta_keys: meta ? ["version","freeze","updated_at"].filter(k=>!(k in meta)) : ["version","freeze","updated_at"],
    workflows: { count: lsFiles().filter(f => f.startsWith(".github/workflows/")).length },
    backlog: { present: backlog },
    docs: { readme_present: exists("README.md"), docs_dir_present: exists("docs") },
    logs: { lessons_log_present: lessonsCsv, proof_log_present: proofsCsv },
    pr_template: prTpl,
  };

  fs.writeFileSync(JSONP, JSON.stringify({
    meta: { system_version_valid: flags.system_version_valid, missing_meta_keys: flags.missing_meta_keys },
    workflows: { count: flags.workflows.count, sanity_issues: [] },
    backlog: { matrices: flags.backlog.present ? 1 : 0 },
    docs: { readme_present: flags.docs.readme_present, docs_dir_present: flags.docs.docs_dir_present },
    logs: { lessons_log_present: flags.logs.lessons_log_present, proof_log_present: flags.logs.proof_log_present },
    _generated_at: ts
  }, null, 2));

  const md = [];
  md.push("# Diagnostic Report v2.7 (Strict)");
  md.push(`_timestamp: ${ts}_\n`);
  md.push("## Summary");
  md.push("```json");
  md.push(JSON.stringify({
    meta_system_version: flags.system_version_valid,
    workflows_count: flags.workflows.count,
    backlog_present: flags.backlog.present,
    docs_present: flags.docs.readme_present && flags.docs.docs_dir_present,
    lessons_log: flags.logs.lessons_log_present,
    proof_log: flags.logs.proof_log_present,
    pr_template: flags.pr_template
  }, null, 2));
  md.push("```");
  fs.writeFileSync(RPT, md.join("\n"));

  console.log(`Diagnostic complete → ${RPT}`);
  console.log(`Status JSON → ${JSONP}`);
})();
