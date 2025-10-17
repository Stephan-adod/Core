// scripts/validate_freeze_v1.mjs
// Minimal freeze validator for System Harmony Ledger v1.8
import { readFileSync, existsSync } from "fs";
import path from "path";

const LEDGER_PATH = process.argv.includes("--ledger")
  ? process.argv[process.argv.indexOf("--ledger") + 1]
  : "artefacts/sync/System_Harmony_Ledger.md";

function resolve(file) {
  return path.resolve(process.cwd(), file);
}

function readLedger(file) {
  const full = resolve(file);
  if (!existsSync(full)) {
    throw new Error(`Ledger file missing: ${file}`);
  }
  return readFileSync(full, "utf8");
}

function parseRow(md, label) {
  const lines = md.split(/\r?\n/);
  const targetLabel = `**${label}**`;
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    if (!line.includes(targetLabel)) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 6) continue;
    const target = cells[3] ?? "";
    const value = cells[4] ?? "";
    return { target, value };
  }
  return null;
}

function toNumber(raw) {
  if (raw == null) return NaN;
  const cleaned = String(raw).replace(/[^0-9.+-]/g, "");
  if (!cleaned) return NaN;
  return Number(cleaned);
}

function comparatorFromTarget(target) {
  const t = target || "";
  if (/≤|<=/.test(t)) return "lte";
  if (/≥|>=/.test(t)) return "gte";
  return "gte"; // default to >=
}

function evaluate(label, row, fallbackTarget) {
  if (!row) {
    return { label, pass: false, message: "Row missing" };
  }
  const comparator = comparatorFromTarget(row.target);
  const targetValue = !isNaN(toNumber(row.target))
    ? toNumber(row.target)
    : fallbackTarget;
  const actualValue = toNumber(row.value);
  if (isNaN(actualValue) || isNaN(targetValue)) {
    return {
      label,
      pass: false,
      message: `Unable to parse values (target='${row.target}', value='${row.value}')`,
    };
  }
  let pass;
  if (comparator === "lte") {
    pass = actualValue <= targetValue;
  } else {
    pass = actualValue >= targetValue;
  }
  return {
    label,
    pass,
    message: `${label}: ${actualValue} (${comparator} ${targetValue})`,
  };
}

function main() {
  let ledger;
  try {
    ledger = readLedger(LEDGER_PATH);
  } catch (err) {
    console.error("ERROR", err.message);
    process.exitCode = 1;
    return;
  }

  const checks = [
    {
      label: "System Harmony Score",
      row: parseRow(ledger, "System Harmony Score"),
      fallback: 80,
    },
    {
      label: "Drift %",
      row: parseRow(ledger, "Drift %"),
      fallback: 5,
    },
    {
      label: "Policy Valid %",
      row: parseRow(ledger, "Policy Valid %"),
      fallback: 95,
    },
  ].map(({ label, row, fallback }) => evaluate(label, row, fallback));

  const pass = checks.every((c) => c.pass);

  console.log("=== Freeze Validator v1.8 ===");
  console.log(`Ledger: ${resolve(LEDGER_PATH)}`);
  checks.forEach((c) => {
    const status = c.pass ? "PASS" : "FAIL";
    console.log(`- ${status}: ${c.message}`);
  });

  if (pass) {
    console.log("PASS: Freeze gate metrics satisfied.");
  } else {
    console.log("FAIL: Freeze gate metrics not satisfied.");
    process.exitCode = 2;
  }
}

main();
