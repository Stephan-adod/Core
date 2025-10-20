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

async function main() {
  const errors = [];

  for (const pth of coreDocs) {
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

  const lessonFiles = await glob("artefacts/lessons/**/*.md", { nodir: true });
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
