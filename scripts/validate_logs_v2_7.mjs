#!/usr/bin/env node
import fs from "fs";

const files = {
  lessons: "artefacts/logs/lessons_log.csv",
  proofs:  "artefacts/logs/proofs/proof_log.csv",
  backlog: "artefacts/logs/backlog_matrix_v2.6.md"
};
const headers = {
  lessons: "timestamp,id,scope,phase,lesson,source,owner",
  proofs:  "id,type,path,owner,status,coverage_note,timestamp",
  backlog1: "| ID | Title | Type | Status | Owner | Freeze |",
  backlog2: "|---:|-------|------|--------|-------|--------|"
};

function die(m){ console.error(m); process.exit(1); }
function mustExist(p){ if(!fs.existsSync(p)) die(`Missing ${p}`); }
function startsWithLine(p, expected){
  const first = (fs.readFileSync(p,"utf8").split("\n")[0]||"").trim();
  return first === expected;
}

mustExist(files.lessons);
mustExist(files.proofs);
mustExist(files.backlog);

if (!startsWithLine(files.lessons, headers.lessons)) die("lessons_log.csv header not canonical");
if (!startsWithLine(files.proofs,  headers.proofs))  die("proof_log.csv header not canonical");

const bl = fs.readFileSync(files.backlog,"utf8").split("\n");
if ((bl[0]||"").trim()!==headers.backlog1 || (bl[1]||"").trim()!==headers.backlog2)
  die("backlog_matrix header not canonical");

console.log("Logs & backlog OK (v2.7 strict).");

