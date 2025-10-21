#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { glob } from "glob";

const sysCfg = JSON.parse(fs.readFileSync("meta/system_version.json", "utf8"));
const TARGET_VERSION = sysCfg.active || sysCfg.target_version || "v2.4.6";
const coreDocs = sysCfg.core_docs || [];
const cachedMeta = new Map();

const ROOTS = ["meta", "docs"];
const EXCLUDES = ["artefacts/", "docs/archive/"];

const normalizePath = (pth) => {
  const normalized = path.posix
    .normalize((pth || "").replace(/\\/g, "/"))
    .replace(/^(\.\/)+/, "")
    .replace(/^(\.\.\/)+/, "");
  return normalized;
};

let overrides = {};
try {
  const raw = fs.readFileSync("meta/_fixtures/version_overrides.json", "utf8");
  const parsed = JSON.parse(raw);
  overrides = Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [normalizePath(key), value]),
  );
} catch {
  overrides = {};
}

const expectedVersion = (pth, target) => {
  const normalized = normalizePath(pth);
  return overrides[normalized]?.version || target;
};

const normalizedCoreDocs = new Set(coreDocs.map((doc) => normalizePath(doc)));

function isExcluded(pth) {
  const normalized = normalizePath(pth);
  return EXCLUDES.some((prefix) => normalized.startsWith(prefix));
}

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

function flagUnstableLinks(file, body, errors, expectedVersion) {
  const unstable = body.match(/(?:meta|docs)\/[\w\-\/]+_v2\.\d+\.md/g);
  if (unstable) {
    for (const ref of unstable) {
      const normalizedRef = normalizePath(ref);
      if (!ROOTS.some((root) => normalizedRef.startsWith(`${root}/`))) {
        continue;
      }
      if (isExcluded(normalizedRef)) {
        continue;
      }
      const allowedVersion = expectedVersion || TARGET_VERSION;
      const allowedPrefixMatch = allowedVersion.match(/^v(\d+\.\d+)/);
      const refVersionMatch = normalizedRef.match(/_v(\d+\.\d+)/);
      if (allowedPrefixMatch && refVersionMatch) {
        const allowedPrefix = `v${allowedPrefixMatch[1]}`;
        const refPrefix = `v${refVersionMatch[1]}`;
        if (allowedPrefix.startsWith(refPrefix)) {
          continue;
        }
      }
      errors.push(`${file}: contains unstable reference ${ref}`);
    }
  }
}

async function main() {
  const errors = [];

  for (const pth of coreDocs) {
    const docPath = normalizePath(pth);
    if (isExcluded(docPath)) {
      continue;
    }
    if (!fs.existsSync(docPath)) {
      errors.push(`Core doc missing: ${pth}`);
      continue;
    }
    try {
      const { meta, body } = readDocMeta(docPath);
      const targetVersion = expectedVersion(docPath, TARGET_VERSION);
      if ((meta?.version || "") !== targetVersion) {
        errors.push(
          `${pth}: version ${meta?.version || "n/a"} does not match target ${targetVersion}`,
        );
      }
      flagUnstableLinks(pth, body, errors, targetVersion);
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
      const normalizedPath = normalizePath(pth);
      if (!ROOTS.some((root) => normalizedPath.startsWith(`${root}/`))) {
        continue;
      }
      if (isExcluded(normalizedPath)) {
        continue;
      }
      const isStableSnapshot = normalizedPath.startsWith("meta/snapshots/");
      if (!isStableSnapshot && normalizedPath.includes("_v2.")) {
        errors.push(`${f}: related_docs must use stable paths -> ${pth}`);
        continue;
      }
      if (!fs.existsSync(normalizedPath)) {
        errors.push(`${f}: related_docs path missing -> ${pth}`);
        continue;
      }
      if (normalizedCoreDocs.has(normalizedPath)) {
        try {
          const { meta: docMeta } = readDocMeta(normalizedPath);
          const targetVersion = expectedVersion(normalizedPath, TARGET_VERSION);
          if ((docMeta?.version || "") !== targetVersion) {
            errors.push(
              `${f}: ${pth} has version ${docMeta?.version || "n/a"} but target is ${targetVersion}`,
            );
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

  console.log(`✅ Version drift check passed for ${TARGET_VERSION}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
