#!/usr/bin/env node
import fs from "fs";
import yaml from "js-yaml";
import { glob } from "glob";

const sysCfg = JSON.parse(fs.readFileSync("meta/system_version.json", "utf8"));
const TARGET = sysCfg.target_version || "v2.1";
const coreDocs = sysCfg.core_docs || [];
const cachedMeta = new Map();

function readDocMeta(pth) {
  if (cachedMeta.has(pth)) {
    return cachedMeta.get(pth);
  }
  const body = fs.readFileSync(pth, "utf8");
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    const data = { meta: {}, body };
    cachedMeta.set(pth, data);
    return data;
  }
  const meta = yaml.load(match[1]) || {};
  const remainder = body.slice(match[0].length);
  const data = { meta, body: remainder };
  cachedMeta.set(pth, data);
  return data;
}

function flagUnstableLinks(file, body, errors) {
  const unstable = body.match(/(?:meta|docs)\/[\w\-\/]+_v2\.\d+\.md/g);
  if (unstable) {
    for (const ref of unstable) {
      errors.push(`${file}: contains unstable reference ${ref}`);
    }
  }
}

const isInActiveLayer = (p) =>
  (p.startsWith("meta/") || p.startsWith("docs/")) &&
  !p.startsWith("docs/archive/") &&
  !p.startsWith("docs/lessons/") &&
  !p.startsWith("artefacts/");

const hasAllowedExtension = (p) => p.endsWith(".md") || p.endsWith(".mjs");

async function discoverMarkdownFiles() {
  const matches = await glob("**/*", { nodir: true, dot: false });
  return matches
    .map((p) => p.replace(/\\/g, "/"))
    .filter((p) => hasAllowedExtension(p));
}

async function main() {
  const errors = [];

  let files = await discoverMarkdownFiles();

  // --- CI Barrier: nur aktive Ebenen prüfen -------------------------------
  files = files.filter(
    (p) =>
      (p.startsWith("meta/") || p.startsWith("docs/")) &&
      !p.startsWith("docs/lessons/") &&
      !p.startsWith("docs/archive/")
  );

  // nur .md / .mjs
  files = files.filter((p) => p.endsWith(".md") || p.endsWith(".mjs"));

  console.log(`[check_version_drift] active files (barrier): ${files.length}`);

  const activeCoreDocs = (sysCfg.core_docs || []).filter(
    (pth) => isInActiveLayer(pth) && hasAllowedExtension(pth)
  );

  for (const pth of activeCoreDocs) {
    if (!fs.existsSync(pth)) {
      errors.push(`Core doc missing: ${pth}`);
      continue;
    }
    try {
      const { meta, body } = readDocMeta(pth);
      if ((meta?.version || "") !== TARGET) {
        errors.push(`${pth}: version ${meta?.version || "n/a"} does not match target ${TARGET}`);
      }
      flagUnstableLinks(pth, body, errors);
    } catch (err) {
      errors.push(`Failed to inspect ${pth}: ${err.message}`);
    }
  }

  const lessonFiles = files.filter((p) => p.startsWith("docs/lessons/") && p.endsWith(".md"));
  for (const f of lessonFiles) {
    const raw = fs.readFileSync(f, "utf8");
    const fm = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) {
      errors.push(`${f}: missing YAML front matter`);
      continue;
    }
    const meta = yaml.load(fm[1]) || {};
    if (!Array.isArray(meta.related_docs)) {
      errors.push(`${f}: related_docs missing or not an array`);
      continue;
    }
    for (const pth of meta.related_docs) {
      if (typeof pth !== "string") {
        errors.push(`${f}: related_docs must use stable paths -> ${pth}`);
        continue;
      }
      const isStableSnapshot = pth.startsWith("meta/snapshots/");
      if (!isStableSnapshot && pth.includes("_v2.")) {
        errors.push(`${f}: related_docs must use stable paths -> ${pth}`);
        continue;
      }
      if (!fs.existsSync(pth)) {
        errors.push(`${f}: related_docs path missing -> ${pth}`);
        continue;
      }
      if (coreDocs.includes(pth)) {
        try {
          const { meta: docMeta } = readDocMeta(pth);
          if ((docMeta?.version || "") !== TARGET) {
            errors.push(`${f}: ${pth} has version ${docMeta?.version || "n/a"} but target is ${TARGET}`);
          }
        } catch (err) {
          errors.push(`${f}: failed to read ${pth} → ${err.message}`);
        }
      }
    }
  }

  if (errors.length) {
    for (const err of errors) {
      console.error(err);
    }
    process.exit(1);
  }

  console.log(`✅ Version drift check passed for ${TARGET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
