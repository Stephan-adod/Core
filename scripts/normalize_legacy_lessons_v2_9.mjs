#!/usr/bin/env node
/**
 * Normalize legacy lesson markdown files by adding a YAML frontmatter
 * if missing or incomplete. Non-destructive: prepends header, keeps body.
 */
import fs from "fs";
import path from "path";

const ROOT = "artefacts/logs/lessons";
const OUT_LOG = "artefacts/logs/legacy_lessons_normalize_report_v2_9.json";
const OWNER = "stephan-adod";
const POLICY_VERSION = "v2.4.7";

const PHASE_MAP = [
  { re: /phase1/i, phase: "v2.1" },
  { re: /phase2_5b/i, phase: "v2.5b" },
  { re: /phase2_5c/i, phase: "v2.5c" },
  { re: /phase2_6/i,  phase: "v2.6"  },
  { re: /phase2/i,    phase: "v2.2"  },
  { re: /L-016/i,     phase: "v2.9"  }, // adaptive baseline lives across phases; defaulting to current
];

function guessPhase(filename) {
  for (const m of PHASE_MAP) if (m.re.test(filename)) return m.phase;
  return "v2.9"; // fallback to current
}

function hasFrontmatter(txt) {
  return txt.trimStart().startsWith("---");
}

function parseFront(txt) {
  if (!hasFrontmatter(txt)) return { fm: {}, body: txt };
  const start = txt.indexOf("---");
  const end = txt.indexOf("\n---", start + 3);
  if (end < 0) return { fm: {}, body: txt };
  const yml = txt.slice(start + 3, end).trim();
  const body = txt.slice(end + 4); // skip "\n---"
  const fm = {};
  yml.split("\n").forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^"|"$/g, "");
  });
  return { fm, body };
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function makeId(file) {
  const base = path.basename(file).replace(/\.md$/i, "");
  return `LEGACY-${base.replace(/[^\w.-]/g, "_")}`;
}

function buildHeader(fm, file) {
  const now = new Date().toISOString().slice(0,10);
  const want = {
    id: fm.id || makeId(file),
    title: fm.title || path.basename(file).replace(/\.md$/i, "").replace(/_/g, " "),
    version: POLICY_VERSION,
    phase: fm.phase || guessPhase(file),
    date: fm.date || now,
    owner: fm.owner || OWNER
  };
  // merge back any existing known keys
  const keys = ["id","title","version","phase","date","owner"];
  const lines = ["---", ...keys.map(k => `${k}: ${want[k]}`), "---", ""];
  return lines.join("\n");
}

function normalizeFile(file) {
  const txt = fs.readFileSync(file, "utf8");
  const { fm, body } = parseFront(txt);

  const missing = [];
  for (const k of ["id","phase","date","owner","version"]) {
    if (!fm[k]) missing.push(k);
  }
  if (missing.length === 0) return { file, changed: false, missing: [] };

  const header = buildHeader(fm, file);
  const newTxt = header + body.trimStart();
  fs.writeFileSync(file, newTxt);
  return { file, changed: true, missing };
}

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = fs.statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p));
    else if (st.isFile() && p.endsWith(".md")) out.push(p);
  }
  return out;
}

(function main(){
  const files = walk(ROOT);
  const results = [];
  for (const f of files) {
    // wir harmonisieren NUR die vom Hygiene-Report markierten/legacy-like Dateien
    if (!/L-016|phase1|phase2_/i.test(f)) continue; 
    results.push(normalizeFile(f));
  }
  ensureDir(path.dirname(OUT_LOG));
  fs.writeFileSync(OUT_LOG, JSON.stringify({
    timestamp: new Date().toISOString(),
    normalized: results
  }, null, 2));
  console.log(`✅ normalized ${results.filter(x=>x.changed).length}/${results.length} legacy lessons`);
})();
