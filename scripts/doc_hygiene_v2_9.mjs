#!/usr/bin/env node
/**
 * v2.9 Doc Hygiene Check
 * - Lessons & Snippets: Header/Frontmatter, Pflichtfelder
 * - lessons_log.csv ↔ Dateienkonsistenz
 * - Policy-Versionen prüfen (v2.4.7)
 * - Logging-References quick-validate
 * - Ergebnis: artefacts/logs/doc_hygiene_report_v2_9.json + .md
 */
import fs from "fs"; import path from "path";

const ROOTS = [
  "artefacts/logs/lessons",
  "artefacts/logs/lessons/snippets",
  "artefacts/logs"
];
const LOGCSV = "artefacts/logs/lessons_log.csv";
const OUTJSON = "artefacts/logs/doc_hygiene_report_v2_9.json";
const OUTMD   = "artefacts/logs/doc_hygiene_report_v2_9.md";

const reqFront = ["id","phase","date","owner","version"]; // minimal
const policyVersion = "v2.4.7";

function ls(p){ try { return fs.readdirSync(p).map(f=>path.join(p,f)); } catch { return []; } }
function read(p){ return fs.readFileSync(p,"utf8"); }
function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

function parseFrontmatter(t){
  if (!t.startsWith("---")) return {};
  const end = t.indexOf("\n---",3); if (end<0) return {};
  const yml = t.slice(3, end).trim();
  const obj = {};
  for (const line of yml.split("\n")){
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) obj[m[1]] = m[2].replace(/^"|"$/g,"");
  }
  return obj;
}

function collectMd(files){
  return files.filter(f=>f.endsWith(".md")).map(f=>{
    const txt = read(f);
    const fm = parseFrontmatter(txt);
    const hasPolicy = txt.includes(`version: ${policyVersion}`) || fm.version === policyVersion;
    const hasPhase = /phase:\s*v2\.9/.test(txt) || /Phase v2\.9/i.test(txt);
    const missing = reqFront.filter(k=>!(k in fm));
    return { file:f, okFront: missing.length===0, missing, hasPolicy, hasPhase };
  });
}

function readCsv(p){
  if (!exists(p)) return { header:[], rows:[] };
  const lines = read(p).trim().split("\n");
  const header = (lines.shift()||"").split(",");
  const rows = lines.map(l=>l.split(","));
  return { header, rows };
}

(function main(){
  const lessons = collectMd(ls("artefacts/logs/lessons"));
  const snippets = collectMd(ls("artefacts/logs/lessons/snippets"));
  const csv = readCsv(LOGCSV);
  const missingRoots = ROOTS.filter(dir => !exists(dir));

  // cross-check CSV paths
  const csvPaths = new Set(csv.rows.map(r => (r[5]||"").replace(/^"|"$/g,"")));
  const allPaths = new Set([...lessons, ...snippets].map(x=>x.file));
  const csvMissingFiles = [...csvPaths].filter(p=>p && !exists(p));
  const filesNotInCsv = [...allPaths].filter(p => p.includes("/snippets/") && !csvPaths.has(p));

  const problems = {
    lessons_missing_front: lessons.filter(x=>!x.okFront),
    snippets_missing_front: snippets.filter(x=>!x.okFront),
    lessons_wrong_policy: lessons.filter(x=>!x.hasPolicy),
    snippets_wrong_policy: snippets.filter(x=>!x.hasPolicy),
    lessons_wrong_phase: lessons.filter(x=>!x.hasPhase),
    snippets_wrong_phase: snippets.filter(x=>!x.hasPhase),
    csv_missing_files: csvMissingFiles,
    snippets_not_in_csv: filesNotInCsv,
    missing_roots: missingRoots
  };

  const summary = {
    timestamp: new Date().toISOString(),
    counts: {
      lessons: lessons.length,
      snippets: snippets.length,
      csv_rows: csv.rows.length
    },
    problems,
    roots: { checked: ROOTS, missing: missingRoots }
  };

  fs.writeFileSync(OUTJSON, JSON.stringify(summary,null,2));
  fs.writeFileSync(OUTMD, `# Doc Hygiene Report v2.9\n\n```json\n${JSON.stringify(summary,null,2)}\n```\n`);
  console.log("✅ Doc hygiene report written →", OUTJSON);
})();
