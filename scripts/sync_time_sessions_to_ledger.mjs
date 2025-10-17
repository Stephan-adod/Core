#!/usr/bin/env node
/**
 * Read latest artefacts/data/time_sessions.json and mirror summary
 * into artefacts/sync/System_Harmony_Ledger.md between markers:
 * <!-- TIME_SESSIONS:BEGIN --> ... <!-- TIME_SESSIONS:END -->
 * Non-blocking: only writes telemetry, never touches policies/freeze.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const JSON_PATH = "artefacts/data/time_sessions.json";
const LEDGER = "artefacts/sync/System_Harmony_Ledger.md";
const BEGIN = "<!-- TIME_SESSIONS:BEGIN -->";
const END = "<!-- TIME_SESSIONS:END -->";
const SCRIPT_NAME = new URL(import.meta.url).pathname.split("/").pop();

function findLatestReport() {
  try {
    const list = execSync('ls -1t artefacts/logs/time_sessions_*.md', {
      encoding: "utf8",
    })
      .trim()
      .split("\n");
    return list[0] || null;
  } catch {
    return null;
  }
}

if (!existsSync(JSON_PATH)) {
  console.error(`No ${JSON_PATH} found. Run analyze_sessions first.`);
  process.exit(0);
}

const data = JSON.parse(readFileSync(JSON_PATH, "utf8"));
const s = data.sessions ?? [];
const totals = data.totals ?? {};
const latestReport = findLatestReport();

function fmtMin(min = 0) {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  return `${h}h ${mm}m`;
}

const startISO = s.length ? s[0].start : null;
const endISO = s.length ? s[s.length - 1].end : null;

let block = "";
block += `${BEGIN}\n`;
block += `### ⏱️ Time Sessions Telemetry (non-blocking)\n\n`;
block += `**Source:** \`${JSON_PATH}\`${
  latestReport ? ` · Latest report: \`${latestReport}\`` : ""
}\n\n`;
block += `| Metric | Value |\n`;
block += `|:--|:--|\n`;
block += `| Sessions | ${totals.sessions ?? 0} |\n`;
block += `| Active time | ${fmtMin(totals.minutes)} |\n`;
block += `| Avg session | ${fmtMin(totals.avgSessionMin)} |\n`;
block += `| Cycle start | ${startISO ?? "–"} |\n`;
block += `| Cycle end | ${endISO ?? "–"} |\n`;
block += `\n> Telemetry only. No policy/freeze changes. Updated by \`${SCRIPT_NAME}\`.\n`;
block += `${END}\n`;

let ledger = "";
if (existsSync(LEDGER)) {
  ledger = readFileSync(LEDGER, "utf8");
  if (ledger.includes(BEGIN) && ledger.includes(END)) {
    // replace existing block
    const pattern = new RegExp(`${BEGIN}[\\s\\S]*?${END}`);
    ledger = ledger.replace(pattern, block);
  } else {
    // append block at end
    ledger = ledger.replace(/\s*$/, "");
    ledger += `\n\n${block}`;
  }
} else {
  ledger = `# System Harmony Ledger\n\n${block}`;
}

writeFileSync(LEDGER, ledger, "utf8");
console.log(`Ledger telemetry updated: ${LEDGER}`);
