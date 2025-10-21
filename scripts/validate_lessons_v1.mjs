#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sysver from "../meta/system_version.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const TARGET_VERSION = sysver.active || "v2.4.6";
const ACTIVE_DIRS = ["docs/lessons"];
const EXCLUDES = ["artefacts/lessons", "docs/archive"];

function isExcluded(p) {
  const normalized = p.replace(/\\/g, "/");
  return EXCLUDES.some((ex) => normalized === ex || normalized.startsWith(`${ex}/`));
}

function listLessonFiles() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        const rel = path.relative(ROOT, fullPath).replace(/\\/g, "/");
        if (isExcluded(rel)) {
          continue;
        }
        walk(fullPath);
      } else if (fullPath.endsWith(".md")) {
        const rel = path.relative(ROOT, fullPath).replace(/\\/g, "/");
        if (!isExcluded(rel)) {
          files.push(rel);
        }
      }
    }
  };

  for (const dir of ACTIVE_DIRS) {
    const abs = path.join(ROOT, dir);
    if (fs.existsSync(abs)) {
      walk(abs);
    }
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
  const absPath = path.join(ROOT, fp);
  const raw = fs.readFileSync(absPath, "utf8");
  const frontmatter = readFrontmatter(raw);
  const version = frontmatter.version || "";
  const status = frontmatter.status || "";
  const relativePath = fp;

  if (!version) {
    errors.push(`${relativePath}: missing version in YAML front matter (target ${TARGET_VERSION})`);
  } else if (version !== TARGET_VERSION) {
    errors.push(`${relativePath}: has version ${version} but target is ${TARGET_VERSION}`);
  }

  if (!status || status.trim() !== "active") {
    errors.push(`${relativePath}: status=${status || "missing"} (expected active)`);
  }
}

if (errors.length) {
  console.error(`Lessons validation failed (${errors.length} issues):\n` + errors.join("\n"));
  process.exit(1);
}

console.log(`✅ lessons ok (${lessons.length} files) @ target ${TARGET_VERSION}`);
