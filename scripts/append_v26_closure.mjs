#!/usr/bin/env node
import fs from "fs"; import path from "path";

const logsDir="artefacts/logs";
const lessonsCsv=path.join(logsDir,"lessons_log.csv");
const proofsCsv =path.join(logsDir,"proofs/proof_log.csv");

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function exists(p){ try{ fs.statSync(p); return true;}catch{ return false; } }
function prependHeader(file, header){
  ensureDir(path.dirname(file));
  if(!exists(file)){ fs.writeFileSync(file, header+"\n"); return true; }
  const txt=fs.readFileSync(file,"utf8");
  if(!txt.startsWith(header)){ fs.writeFileSync(file, header+"\n"+txt); return true; }
  return false;
}

(function(){
  const now=new Date().toISOString();

  // Lessons
  const lessonsHeader="timestamp,id,scope,phase,lesson,source,owner";
  prependHeader(lessonsCsv, lessonsHeader);
  const lessonRow=[now,"L-2.6-DONE","governance","v2.6",
    "Phase 2.6 abgeschlossen: Primer+Diagnose grün, Enforcement (Lean) aktiv, Pre-Strict v2.7 durchgeführt",
    "artefacts/logs/transition_v2.6_done.md","stephan-adod"].join(",");
  fs.appendFileSync(lessonsCsv, lessonRow+"\n");

  // Proofs
  const proofsHeader="id,type,path,owner,status,coverage_note,timestamp";
  prependHeader(proofsCsv, proofsHeader);
  const proofRow=["PR-ENF-2.6","enforcement",
    "artefacts/logs/enforcement_v2_6_bundle","stephan-adod","verified",
    "Lean run succeeded; diagnostics matched; ready for v2.7 strict", now].join(",");
  fs.appendFileSync(proofsCsv, proofRow+"\n");

  console.log("Appended v2.6 closure lesson & proof.");
})();
