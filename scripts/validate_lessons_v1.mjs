import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const lessonsDir = "artefacts/lessons/lesson_snippets";
const logFile = "artefacts/logs/lesson_log.csv";

const required = ["id","phase","source","category","impact","tags","related_docs","created","author"];
const errors = [];

function fileExists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

if (!fileExists(lessonsDir)) {
  console.log("No lessons directory yet; skipping validation.");
  process.exit(0);
}
if (!fileExists(logFile)) {
  console.error("lesson_log.csv missing at artefacts/logs/lesson_log.csv");
  process.exit(1);
}

const log = fs.readFileSync(logFile, "utf8");
const files = fs.readdirSync(lessonsDir).filter(f => f.endsWith(".md"));

for (const f of files) {
  const full = path.join(lessonsDir, f);
  const content = fs.readFileSync(full, "utf8");
  const m = content.match(/^---([\s\S]*?)---/);
  if (!m) { errors.push(`${f}: missing YAML header`); continue; }
  let meta;
  try { meta = yaml.load(m[1]); } catch (e) { errors.push(`${f}: invalid YAML - ${e.message}`); continue; }

  for (const k of required) if (meta[k] === undefined || meta[k] === null || meta[k] === "")
    errors.push(`${f}: missing key '${k}'`);

  // ID & filename convention
  if (!/^L-\d{3}$/.test(meta.id)) errors.push(`${f}: id must match L-###`);
  if (!/^L-\d{3}_.+\.md$/.test(f)) errors.push(`${f}: filename must be L-###_<topic>.md`);

  // log presence
  if (!log.includes(meta.id + ",")) errors.push(`${f}: id ${meta.id} not found in lesson_log.csv`);

  // related docs exist (if set)
  if (Array.isArray(meta.related_docs)) {
    for (const pth of meta.related_docs) {
      if (!fileExists(pth)) errors.push(`${f}: related_docs path missing -> ${pth}`);
    }
  }
}

if (errors.length) {
  console.error("Lesson validation failed:\n" + errors.map(e => `- ${e}`).join("\n"));
  process.exit(1);
}
console.log(`Lessons OK (${files.length} files).`);
