#!/usr/bin/env node
import fs from "fs";
import path from "path";
import sysver from "../meta/system_version.json" with { type: "json" };

const ROOT = path.resolve(process.cwd());
const TARGET_VERSION = sysver.active || "v2.4.6";
const ACTIVE_DIRS = ["docs/lessons"];

function listLessonFiles() {
  const files = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const s = fs.statSync(p);
      if (s.isDirectory()) {
        walk(p);
      } else if (p.endsWith(".md")) {
        files.push(path.relative(ROOT, p).replace(/\\/g, "/"));
      }
    }
  };

  for (const d of ACTIVE_DIRS) {
    const abs = path.join(ROOT, d);
    if (fs.existsSync(abs)) walk(abs);
  }

  return files.sort();
}

function readFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  match[1].split("\n").forEach((line) => {
    if (!line.includes(":")) return;
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    const cleanKey = key.trim();
    if (cleanKey) {
      data[cleanKey] = value;
    }
  });
  return data;
}

const lessons = listLessonFiles();
const errors = [];

for (const fp of lessons) {
  const raw = fs.readFileSync(path.join(ROOT, fp), "utf8");
  const frontmatter = readFrontmatter(raw);
  const version = frontmatter.version || "";
  const status = (frontmatter.status || "").trim();

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
