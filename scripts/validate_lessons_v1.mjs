#!/usr/bin/env node
import fs from "fs";
import path from "path";
import sysver from "../meta/system_version.json" assert { type: "json" };

// ==== Scope & target config (BEGIN) ====

// Zielversion: wir validieren Lessons gegen die aktive Release-Version
const TARGET_VERSION = sysver.active || "v2.4.6";

// Nur aktive Lessons im Repo prüfen
const ACTIVE_DIRS = ["docs/lessons"];

function listLessonFiles() {
  const files = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const s = fs.statSync(p);
      if (s.isDirectory()) walk(p);
      else if (p.endsWith(".md")) files.push(p);
    }
  };
  for (const base of ACTIVE_DIRS) if (fs.existsSync(base)) walk(base);
  return files;
}

function readFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const obj = {};
  m[1].split("\n").forEach(line => {
    const i = line.indexOf(":");
    if (i < 0) return;
    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();
    if (k) obj[k] = v;
  });
  return obj;
}
// ==== Scope & target config (END) ====

// ==== Validation driver (REPLACE previous driver if necessary) ====
const lessons = listLessonFiles();
let errors = [];

for (const fp of lessons) {
  const raw = fs.readFileSync(fp, "utf8");
  const fm = readFrontmatter(raw);
  const version = fm.version || "";
  const status = (fm.status || "").trim();

  if (!version) {
    errors.push(`${fp}: missing version in YAML front matter (target ${TARGET_VERSION})`);
  } else if (version !== TARGET_VERSION) {
    errors.push(`${fp}: has version ${version} but target is ${TARGET_VERSION}`);
  }

  if (status !== "active") {
    errors.push(`${fp}: status=${status || "missing"} (expected active)`);
  }
}

if (errors.length) {
  console.error(`Lessons validation failed (${errors.length} issues):\n` + errors.join("\n"));
  process.exit(1);
}

console.log(`✅ lessons ok (${lessons.length}) @ target ${TARGET_VERSION}`);
