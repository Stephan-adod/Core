import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const ROOT_DIR = process.cwd();
const ROOTS = ["meta", "docs"];
const EXCLUDES = new Set(["archive", "artefacts", "scripts", ".github"]);
const TARGET_VERSION = { major: 2, minor: 4, patch: 0 };

const results = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath);

    if (shouldExclude(relativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile()) {
      handleFile(fullPath, relativePath);
    }
  }
}

function shouldExclude(relativePath) {
  const segments = relativePath.split(path.sep);
  return segments.some(segment => EXCLUDES.has(segment));
}

function inScope(relativePath) {
  if (!relativePath) return false;
  if (![".md", ".json"].includes(path.extname(relativePath))) return false;

  if (relativePath.startsWith("meta" + path.sep)) {
    return true;
  }

  if (relativePath.startsWith(path.join("docs", "AI_First_"))) {
    return path.extname(relativePath) === ".md";
  }

  if (relativePath.startsWith(path.join("docs", "frameworks") + path.sep)) {
    return path.extname(relativePath) === ".md";
  }

  return false;
}

function extractMetadata(content, ext) {
  if (ext === ".md") {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      try {
        const data = yaml.load(match[1]);
        if (typeof data === "object" && data) {
          return data;
        }
      } catch (error) {
        console.warn("⚠️  Failed to parse front matter:", error.message);
      }
    }
    return {};
  }

  if (ext === ".json") {
    try {
      const parsed = JSON.parse(content);
      if (typeof parsed === "object" && parsed) {
        return parsed;
      }
    } catch (error) {
      console.warn("⚠️  Failed to parse JSON metadata:", error.message);
    }
  }

  return {};
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
}

function dedupe(values) {
  return Array.from(new Set(values));
}

function parseVersion(version) {
  if (typeof version !== "string") return null;
  const normalized = version.trim();
  const match = normalized.match(/^[vV]?(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!match) return null;
  const [, major, minor = "0", patch = "0"] = match;
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
  };
}

function compareVersions(a, b) {
  if (!a || !b) return 0;
  if (a.major !== b.major) {
    return a.major - b.major;
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }
  return a.patch - b.patch;
}

function evaluateGovernanceHealth(meta) {
  const statusRaw = typeof meta.status === "string" ? meta.status : "";
  const status = statusRaw.toLowerCase();
  const versionInfo = parseVersion(meta.version);

  if (status === "draft") {
    return "🟡";
  }

  if (versionInfo) {
    const comparison = compareVersions(versionInfo, TARGET_VERSION);
    if (comparison < 0) {
      return "🔴";
    }
    if (comparison >= 0 && status === "active") {
      return "🟢";
    }
    return "🔴";
  }

  return "⚪";
}

function handleFile(fullPath, relativePath) {
  if (!inScope(relativePath)) return;

  const content = fs.readFileSync(fullPath, "utf-8");
  const ext = path.extname(fullPath);
  const meta = extractMetadata(content, ext) || {};

  if (
    relativePath.startsWith(path.join("docs", "frameworks")) &&
    meta.layer && typeof meta.layer === "string" &&
    !meta.layer.toLowerCase().includes("meta") &&
    !meta.layer.toLowerCase().includes("governance")
  ) {
    return;
  }

  const linkedDocs = dedupe(
    [
      ...toArray(meta.related_docs),
      ...toArray(meta.linked_docs),
      ...toArray(meta.see),
    ]
  );

  const layer = typeof meta.layer === "string" ? meta.layer : relativePath.split(path.sep)[0];

  const record = {
    path: relativePath,
    version: typeof meta.version === "string" ? meta.version : null,
    status: typeof meta.status === "string" ? meta.status : "unknown",
    updated: typeof meta.updated === "string" ? meta.updated : null,
    linked_docs: linkedDocs,
    layer,
    owner: typeof meta.owner === "string" ? meta.owner : null,
  };

  record.governance_health = evaluateGovernanceHealth(record);

  results.push(record);
}

for (const root of ROOTS) {
  const absoluteRoot = path.join(ROOT_DIR, root);
  if (fs.existsSync(absoluteRoot)) {
    walk(absoluteRoot);
  }
}

results.sort((a, b) => a.path.localeCompare(b.path));

fs.mkdirSync(path.join("docs", "reports"), { recursive: true });
fs.writeFileSync(
  path.join("docs", "reports", "meta_inventory_v2.4.json"),
  JSON.stringify(results, null, 2)
);

const tableLines = [
  "| Path | Version | Status | Updated | Health |",
  "|------|---------|--------|---------|--------|",
  ...results.map(record =>
    `| ${record.path} | ${record.version ?? "-"} | ${record.status} | ${record.updated ?? "-"} | ${record.governance_health} |`
  ),
];

fs.writeFileSync(
  path.join("docs", "reports", "meta_inventory_v2.4.md"),
  `# Meta Inventory Report (v2.4 Audit)\n\n${tableLines.join("\n")}\n\nTotal: ${results.length} files`
);

console.log(`✅ Inventory complete: ${results.length} entries`);
