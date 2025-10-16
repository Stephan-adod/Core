#!/usr/bin/env node
import fs from "fs";
import path from "path";

const NOW = new Date();
const TODAY = NOW.toISOString().slice(0, 10);

const MATRIX = "artefacts/logs/backlog_matrix_v1.0.md";
const RULES = "artefacts/logs/prioritization_rules_v1.0.md";
const LEDGER = "artefacts/sync/System_Harmony_Ledger.md";

const OUT_DIR = "artefacts/logs/meta";
const OUT_MD = path.join(OUT_DIR, "diagnose_backlog_v1.0.md");
const OUT_JSON = path.join(OUT_DIR, "diagnose_backlog_v1.0.json");

function read(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

const matrix = read(MATRIX);
const rules = read(RULES);
const ledger = read(LEDGER);

function getWeight(key, def) {
  const pattern = new RegExp(`${key}\\s*:\\s*([-0-9.]+)`);
  const match = rules.match(pattern);
  return match ? Number(match[1]) : def;
}

const W = {
  impact: getWeight("impact", 0.3),
  trust: getWeight("trust", 0.25),
  harmony: getWeight("harmony", 0.2),
  effort: getWeight("effort", -0.15),
  learning: getWeight("learning", 0.1),
};

function getThreshold(name, def) {
  const pattern = new RegExp(`${name}\\s*:\\s*([0-9.]+)`);
  const match = rules.match(pattern);
  return match ? Number(match[1]) : def;
}

const TH = {
  green: getThreshold("green", 8.5),
  yellow: getThreshold("yellow", 7.0),
  red: getThreshold("red", 5.0),
};

const tableLines = matrix
  .split(/\r?\n/)
  .filter((line) => line.trim().startsWith("|"));
const dataLines = tableLines.filter((_, idx) => idx >= 2);

const items = dataLines
  .map((line) => {
    if (line.includes("---")) return null;
    const cols = line
      .split("|")
      .map((cell) => cell.trim());
    const ticket = cols[1];
    if (!ticket) return null;
    return {
      ticket,
      layer: cols[2] || "",
      category: cols[3] || "",
      impact: Number(cols[4] || 0),
      trust: Number(cols[5] || 0),
      effort: Number(cols[6] || 0),
      harmony: Number(cols[7] || 0),
      learning: Number(cols[8] || 0),
      status: cols[10] || "backlog",
      owner: cols[11] || "-",
    };
  })
  .filter((entry) => entry && /[A-Z]+-\d+/.test(entry.ticket));

function score(item) {
  const value =
    item.impact * W.impact +
    item.trust * W.trust +
    item.harmony * W.harmony +
    item.learning * W.learning +
    item.effort * W.effort;
  return Math.round(value * 10) / 10;
}

items.forEach((item) => {
  item.priority = score(item);
});

const avg =
  items.length > 0
    ? Math.round(
        (items.reduce((acc, item) => acc + item.priority, 0) / items.length) * 100
      ) / 100
    : 0;

const badge =
  avg >= TH.green ? "green" : avg >= TH.yellow ? "yellow" : "red";

const findings = [];
if (!exists(MATRIX)) {
  findings.push({
    area: "matrix",
    severity: "high",
    message: "Backlog matrix missing",
    path: MATRIX,
  });
}
if (!exists(RULES)) {
  findings.push({
    area: "rules",
    severity: "high",
    message: "Prioritization rules missing",
    path: RULES,
  });
}
if (avg < TH.yellow) {
  findings.push({
    area: "health",
    severity: "high",
    message: `Backlog health below threshold (avg=${avg})`,
  });
} else if (avg < TH.green) {
  findings.push({
    area: "health",
    severity: "medium",
    message: `Backlog health warning (avg=${avg})`,
  });
}

let exit = 0;
if (findings.some((f) => f.severity === "high")) {
  exit = 1;
} else if (findings.length > 0) {
  exit = 2;
}

ensureDir(OUT_DIR);

const findingsLines =
  findings.length > 0
    ? findings.map(
        (finding) =>
          `- [${finding.area}] (${finding.severity}) ${finding.message}${
            finding.path ? ` · ${finding.path}` : ""
          }`
      )
    : ["- none"];

const mdLines = [
  "# Backlog Diagnosis · v1.0",
  `Date: ${TODAY}`,
  "",
  `**Backlog Health:** ${avg.toFixed(2)} (${badge}) ${
    exit === 0 ? "🟢" : exit === 2 ? "🟡" : "🔴"
  }`,
  "",
  "## Items (scored)",
  "",
  "| Ticket | Layer | Category | Priority | Status | Owner |",
  "|---|---|---|---:|---|---|",
  ...items.map(
    (item) =>
      `| ${item.ticket} | ${item.layer} | ${item.category} | ${item.priority.toFixed(
        1
      )} | ${item.status} | ${item.owner} |`
  ),
  "",
  "## Findings",
  ...findingsLines,
  "",
  "## Exit",
  `exit_code=${exit}`,
];

fs.writeFileSync(OUT_MD, `${mdLines.join("\n")}\n`);

fs.writeFileSync(
  OUT_JSON,
  `${JSON.stringify(
    {
      timestamp: TODAY,
      avg_priority: avg,
      badge,
      exit_code: exit,
      thresholds: TH,
      weights: W,
      items,
      findings,
    },
    null,
    2
  )}\n`
);

let ledgerContent = ledger || "";
if (!/## Backlog Health Records/.test(ledgerContent)) {
  ledgerContent +=
    "\n\n## Backlog Health Records\n\n| Metric | Value | Target | Source | Last Update |\n|---|---|---|---|---|\n";
}
ledgerContent += `| Last Backlog Health | ${avg.toFixed(2)} | ≥ ${TH.green} | ${OUT_MD} | ${TODAY} |\n`;
fs.writeFileSync(LEDGER, ledgerContent);

console.log("status: running | backlog_health_v1_0");
console.log(`items=${items.length} | avg=${avg} | badge=${badge}`);
console.log("reports=written (diagnose_backlog_v1.0.md,json)");
console.log(`ledger=appended (${LEDGER})`);
console.log(`exit_code=${exit}`);

process.exit(exit);
