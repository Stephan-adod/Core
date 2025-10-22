#!/usr/bin/env node
import fs from "fs"; import path from "path";

const now = new Date().toISOString();
const logsDir = "artefacts/logs";
const lessonsCsv = path.join(logsDir, "lessons_log.csv");
const proofsCsv = path.join(logsDir, "proofs/proof_log.csv");

function ensure(p){ fs.mkdirSync(p, { recursive: true }); }
function exists(p){ try{ fs.statSync(p); return true; }catch{ return false; } }
function prependHeader(f, h){
  if (!exists(f)) {
    return fs.writeFileSync(f, h + "\n");
  }
  const t = fs.readFileSync(f, "utf8");
  if (!t.startsWith(h)) {
    fs.writeFileSync(f, h + "\n" + t);
  }
}

(function () {
  ensure(path.dirname(lessonsCsv));
  ensure(path.dirname(proofsCsv));
  const lh = "timestamp,id,scope,phase,lesson,source,owner";
  const ph = "id,type,path,owner,status,coverage_note,timestamp";
  prependHeader(lessonsCsv, lh);
  prependHeader(proofsCsv, ph);

  const lesson = [
    now,
    "L-2.7-STRICT",
    "governance",
    "v2.7",
    "Strict Mode aktiviert – Lean in Ausnahme, PR-Policy Fail-on-Error",
    "artefacts/logs/transition_v2.7_strict_activation.md",
    "stephan-adod",
  ].join(",");
  const proof = [
    "PR-ENF-2.7",
    "enforcement",
    "artefacts/logs/enforce_report_v2_7.md",
    "stephan-adod",
    "verified",
    "All validators passed in strict mode",
    now,
  ].join(",");

  fs.appendFileSync(lessonsCsv, lesson + "\n");
  fs.appendFileSync(proofsCsv, proof + "\n");
  console.log("Appended Strict Activation lesson & proof.");
})();
