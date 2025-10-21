// === Lessons Validator (authoritative) ===
import fs from "fs";
import path from "path";
import sysver from "../meta/system_version.json" assert { type: "json" };

// 1) Zielversion bestimmen: ENV > sysver.active > fallback
const TARGET_VERSION =
  process.env.LESSONS_TARGET_VERSION ||
  sysver.active ||
  "v2.4.6";

// 2) Aktiver Scope: NUR docs/lessons/**
const ROOTS = ["docs/lessons"];

// Helper
function listMdUnder(dir) {
  const out = [];
  const walk = (d) => {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else if (p.endsWith(".md")) out.push(p);
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

function readFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const o = {};
  m[1].split("\n").forEach(line => {
    const i = line.indexOf(":");
    if (i < 0) return;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();
    if (k) o[k] = v;
  });
  return o;
}

// 3) Dateien entdecken (autoritativ NUR docs/lessons)
let files = [];
for (const r of ROOTS) files.push(...listMdUnder(r));

// 4) Debug-Banner: zeigt an, WAS geprüft wird
console.log(`\n[lessons-validator] target=${TARGET_VERSION} roots=${ROOTS.join(", ")} files=${files.length}\n`);

let errors = [];
for (const fp of files) {
  const raw = fs.readFileSync(fp, "utf8");
  const fm = readFrontmatter(raw);
  const v = (fm.version || "").trim();
  const status = (fm.status || "").trim();

  if (!v) {
    errors.push(`${fp}: missing version in YAML front matter (target ${TARGET_VERSION})`);
  } else if (v !== TARGET_VERSION) {
    errors.push(`${fp}: has version ${v} but target is ${TARGET_VERSION}`);
  }

  if (status !== "active") {
    errors.push(`${fp}: status=${status || "missing"} (expected active)`);
  }
}

if (errors.length) {
  console.error(`Lessons validation failed (${errors.length} issues):\n` + errors.join("\n"));
  process.exit(1);
}
console.log(`✅ lessons ok (${files.length}) @ target ${TARGET_VERSION}`);
