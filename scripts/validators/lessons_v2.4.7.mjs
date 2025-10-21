import fs from "fs";
import path from "path";

const TARGET_VERSION = "v2.4.7"; // authoritative
const ROOTS = ["docs/lessons"];

function walk(d) {
  const out = [];
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out.filter(x => x.endsWith(".md"));
}

function readFrontMatterVersion(md) {
  const m = md.match(/---([\s\S]*?)---/);
  if (!m) return null;
  const v = m[1].match(/version:\s*([^\s]+)/);
  return v ? v[1].trim() : null;
}

let errors = [];
for (const root of ROOTS) {
  const files = walk(root);
  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const v = readFrontMatterVersion(raw);
    if (!v) errors.push(`${f}: missing version in YAML front matter (target ${TARGET_VERSION})`);
    else if (v !== TARGET_VERSION) errors.push(`${f}: has version ${v} but target is ${TARGET_VERSION}`);
  }
}

if (errors.length) {
  console.error("\nLessons validation failed (" + errors.length + " issues):");
  console.error(errors.join("\n"));
  process.exit(1);
} else {
  console.log(`[lessons-validator] OK target=${TARGET_VERSION}`);
}
