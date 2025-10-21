// === Authoritative Lessons Validator v2.4.6 ===
import fs from "fs";
import path from "path";
import sysver from "../../meta/system_version.json" assert { type: "json" };

const TARGET = process.env.LESSONS_TARGET_VERSION || sysver.active || "v2.4.6";
const ROOTS = ["docs/lessons"];
const DENY = ["artefacts/", "docs/archive/", "meta/", "scripts/", "docs/reports/"];

const listMd = (dir) => {
  const out = [];
  const walk = (d) => {
    for (const n of fs.readdirSync(d)) {
      const p = path.join(d, n);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else if (p.endsWith(".md")) out.push(p.replace(/\\/g, "/"));
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
};

const front = (txt) => {
  const m = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const o = {};
  m[1].split("\n").forEach((l) => {
    const i = l.indexOf(":");
    if (i < 0) return;
    o[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  });
  return o;
};

let files = [];
for (const r of ROOTS) files.push(...listMd(r));
files = files.filter((f) => !DENY.some((bad) => f.includes(bad)));

console.log(`\n[lessons-validator] target=${TARGET} roots=${ROOTS.join(",")} files=${files.length}\n`);

const errs = [];
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const fm = front(raw);
  const v = (fm.version || "").trim();
  const s = (fm.status || "").trim();

  if (!v) errs.push(`${f}: missing version in YAML front matter (target ${TARGET})`);
  else if (v !== TARGET) errs.push(`${f}: has version ${v} but target is ${TARGET}`);
  if (s !== "active") errs.push(`${f}: status=${s || "missing"} (expected active)`);
}

if (errs.length) {
  console.error(`Lessons validation failed (${errs.length} issues):\n` + errs.join("\n"));
  process.exit(1);
}

console.log(`✅ lessons ok (${files.length}) @ target ${TARGET}`);
