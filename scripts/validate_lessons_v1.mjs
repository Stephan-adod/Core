#!/usr/bin/env node
import fs from "fs";
import yaml from "js-yaml";
import { glob } from "glob";

const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const regPath = "meta/validation_registry.json";
const REG = fs.existsSync(regPath)
  ? readJSON(regPath)
  : { related_docs_allowed_prefixes: ["meta/", "docs/"] };

function isAllowedRelatedDocPath(p) {
  return REG.related_docs_allowed_prefixes.some((pref) => p.startsWith(pref));
}

const sysCfg = JSON.parse(fs.readFileSync("meta/system_version.json", "utf8"));
const TARGET = sysCfg.target_version || "v2.1";
const coreDocs = new Set(sysCfg.core_docs || []);

function extractFrontMatter(body) {
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { meta: {}, content: body };
  }
  const meta = yaml.load(match[1]) || {};
  const content = body.slice(match[0].length).trim();
  return { meta, content };
}

async function main() {
  const files = await glob("artefacts/lessons/**/*.md", { nodir: true });
  const errors = [];

  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const { meta } = extractFrontMatter(raw);

    if (!meta || Object.keys(meta).length === 0) {
      errors.push(`${f}: missing YAML front matter`);
      continue;
    }

    checkRelatedDocs(meta, f, errors);

    if (Array.isArray(meta.related_docs)) {
      for (const pth of meta.related_docs) {
        if (typeof pth !== "string" || pth.trim() === "") {
          continue;
        }

        if (!fs.existsSync(pth)) {
          continue;
        }

        try {
          if (coreDocs.has(pth)) {
            const body = fs.readFileSync(pth, "utf8");
            const docMatch = body.match(/^---\n([\s\S]*?)\n---/);
            if (!docMatch) {
              errors.push(`${f}: ${pth} missing YAML header with version`);
              continue;
            }
            const docMeta = yaml.load(docMatch[1]) || {};
            if ((docMeta?.version || "") !== TARGET) {
              errors.push(`${f}: ${pth} has version ${docMeta?.version || "n/a"} but target is ${TARGET}`);
            }
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

  console.log(`✅ Lessons validated for ${TARGET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

function checkRelatedDocs(meta, file, errors) {
  if (!meta.related_docs) return;
  if (!Array.isArray(meta.related_docs)) {
    errors.push(`${file}: related_docs must be an array of paths`);
    return;
  }
  meta.related_docs.forEach((p) => {
    if (typeof p !== "string" || p.trim() === "") {
      errors.push(`${file}: related_docs contains empty or non-string item`);
      return;
    }
    if (!isAllowedRelatedDocPath(p)) {
      errors.push(
        `${file}: related_docs must use stable paths -> ${p} (allowed: ${REG.related_docs_allowed_prefixes.join(", ")})`,
      );
    }
    if (!fs.existsSync(p)) {
      errors.push(`${file}: related_docs path does not exist -> ${p}`);
    }
  });
}
