#!/usr/bin/env node
import fs from "fs";
import path from "path";

const logsDir = "artefacts/logs";
const lessonsCsv = path.join(logsDir, "lessons_log.csv");
const header = "timestamp,id,scope,phase,lesson,source,owner";

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function exists(p) {
  try {
    fs.statSync(p);
    return true;
  } catch {
    return false;
  }
}

function ensureHeader(file, hdr) {
  ensureDir(path.dirname(file));
  if (!exists(file)) {
    fs.writeFileSync(file, hdr + "\n");
    return;
  }
  const txt = fs.readFileSync(file, "utf8");
  if (!txt.startsWith(hdr)) {
    fs.writeFileSync(file, hdr + "\n" + txt);
  }
}

(function main() {
  const now = new Date().toISOString();
  ensureHeader(lessonsCsv, header);

  const id = "L-015";
  const scope = "governance";
  const phase = "v2.7";
  const lesson = "Strict Mode aktiviert: Policy as Code (Fail-on-Error), Lean als kontrollierte Ausnahme, Auto-Comment & Audit etabliert";
  const source = "docs/lessons/L-015_strict_activation_v2.7.md";
  const owner = "stephan-adod";

  const row = [now, id, scope, phase, JSON.stringify(lesson), source, owner].join(",");
  const current = fs.readFileSync(lessonsCsv, "utf8");
  if (!current.includes(`${id},${scope},${phase}`)) {
    fs.appendFileSync(lessonsCsv, row + "\n");
    console.log("Lesson L-015 appended.");
  } else {
    console.log("Lesson L-015 already present – no changes.");
  }
})();
