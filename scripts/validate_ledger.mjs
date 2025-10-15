// scripts/validate_ledger.mjs
import { readFileSync, existsSync, writeFileSync as fsWriteFileSync } from "fs";
import path from "path";

const fallbackWrite = (payload) => {
  try {
    fsWriteFileSync("artefacts/logs/validator_exit.json", JSON.stringify(payload));
    return;
  } catch {}
  try {
    require("fs").writeFileSync("artefacts/logs/validator_exit.json", JSON.stringify(payload));
  } catch {}
};

// ---------- argv parsing (robust: --max-drift=5 -> max_drift=5)
const argv = process.argv.slice(2).reduce((acc, cur) => {
  const s = cur.startsWith("--") ? cur.slice(2) : cur;
  const [k, v] = s.split("=");
  acc[k.replace(/-/g, "_")] = v === undefined ? true : v;
  return acc;
}, {});
const MAX_DRIFT   = Number(argv.max_drift  ?? 5);
const MIN_HEALTH  = Number(argv.min_health ?? 80);
const LEDGER_PATH = argv.ledger ?? "artefacts/sync/System_Harmony_Ledger.md";

// ---------- io helpers
const read = (file) => readFileSync(path.resolve(file), "utf8");
const maybeNum = (x) => {
  if (x == null) return null;
  const n = Number(String(x).replace(/[^\d.\-]/g, ""));
  return isNaN(n) ? null : n;
};

// ---------- section helpers (flexible)
function sectionByContains(md, contains) {
  // finds a "## " header whose text CONTAINS the provided phrase (case-insensitive)
  const re = /^##\s+([^\n]+)\n/gm;
  let m, start = null, end = md.length;
  const headers = [];
  while ((m = re.exec(md)) !== null) {
    headers.push({ idx: m.index, title: m[1] });
  }
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if ((h.title || "").toLowerCase().includes(contains.toLowerCase())) {
      start = h.idx + md.slice(h.idx).indexOf("\n") + 1;
      end = i + 1 < headers.length ? headers[i + 1].idx : md.length;
      break;
    }
  }
  return start == null ? "" : md.slice(start, end).trim();
}

// ---------- parse thresholds yaml from first code block that CONTAINS 'thresholds:'
function parseThresholds(block) {
  const codeBlocks = [...block.matchAll(/```yaml([\s\S]*?)```/gm)].map(m => m[1]);
  let yaml = codeBlocks.find(c => /(^|\n)\s*thresholds\s*:/i.test(c));
  if (!yaml) return {};
  const lines = yaml.split("\n").map(l => l.trim()).filter(Boolean);
  const thresholds = {};
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*\{\s*green:\s*([^,}]+),\s*yellow:\s*([^,}]+),\s*red:\s*([^}]+)\s*\}/);
    if (kv) thresholds[kv[1]] = {
      green: Number(kv[2]), yellow: Number(kv[3]), red: Number(kv[4])
    };
  }
  return thresholds;
}

// ---------- parse KPI table values
function parseKpiTable(block) {
  const rows = block.split("\n").filter(l => l.startsWith("|"));
  const data = {};
  for (const r of rows) {
    const cells = r.split("|").map(c => c.trim());
    if (cells.length < 6 || cells[1] === "KPI") continue;
    const kpi = cells[1];
    const target = maybeNum(cells[3]);
    const value  = maybeNum(cells[4]); // may be null ("–")
    if (kpi) data[kpi] = { target, value };
  }
  return data;
}

// ---------- minimal CSV reader (first data row)
function readCSVRow(file) {
  const p = path.resolve(file);
  if (!existsSync(p)) return null;
  const txt = readFileSync(p, "utf8").trim();
  if (!txt) return null;
  const [headerLine, dataLine] = txt.split(/\r?\n/);
  if (!dataLine) return null;
  const headers = headerLine.split(",").map(s => s.trim());
  const values  = dataLine.split(",").map(s => s.trim());
  const row = {};
  headers.forEach((h, i) => row[h] = values[i]);
  return row;
}

// ---------- compute CSV fallbacks
function computeFromLogs() {
  const out = {};
  const loop = readCSVRow("artefacts/logs/loop_summary.csv");
  if (loop) out["Learning Velocity"] = Number(loop.closed_loops) / Number(loop.weeks);

  const proof = readCSVRow("artefacts/logs/proof_log.csv");
  if (proof) out["Market Validation Rate (MVR)"] = Number(proof.valid_proofs) / Number(proof.total_proofs);

  const ct = readCSVRow("artefacts/logs/cost_time.csv");
  if (ct) out["Proof-to-Investment Ratio (PIR)"] =
    Number(ct.proofs) / (Number(ct.hours) + Number(ct.cost) / 100);

  const sbi = readCSVRow("artefacts/logs/sbi_log.csv");
  if (sbi) out["Energy ROI (eROI)"] = Number(sbi.sbi_delta) / Number(sbi.hours);

  const rev = readCSVRow("artefacts/logs/revenue_report.csv");
  if (rev) out["Profit per Hour (PPH)"] = Number(rev.total_profit) / Number(rev.total_hours);

  const pa = readCSVRow("artefacts/logs/policy_audit.csv");
  if (pa) out["Policy Drift %"] = (Number(pa.drifted_policies) / Number(pa.total_policies)) * 100;

  return out;
}

// ---------- defaults (falls thresholds fehlen)
const DEFAULT_THRESHOLDS = {
  learning_velocity: { green: 2.0, yellow: 1.5, red: 1.0 },
  mvr:               { green: 0.25, yellow: 0.15, red: 0.10 },
  pir:               { green: 0.10, yellow: 0.07, red: 0.05 },
  eROI:              { green: 1.0,  yellow: 0.8,  red: 0.6  },
  pph:               { green: 10,   yellow: 8,   red: 5    },
  policy_drift:      { green: 5,    yellow: 8,   red: 10   },
};

// ---------- main
function main() {
  const md = read(LEDGER_PATH);

  const kpiBlock  = sectionByContains(md, "Core KPIs");
  const respBlock = sectionByContains(md, "Refinement v1 Responses");

  let thresholds = parseThresholds(respBlock);
  const usedDefault = Object.keys(thresholds).length === 0;
  if (usedDefault) thresholds = DEFAULT_THRESHOLDS;

  const tableVals = parseKpiTable(kpiBlock);
  const fallback  = computeFromLogs();

  const keyMap = {
    "Learning Velocity": "learning_velocity",
    "Market Validation Rate (MVR)": "mvr",
    "Proof-to-Investment Ratio (PIR)": "pir",
    "Energy ROI (eROI)": "eROI",
    "Profit per Hour (PPH)": "pph",
    "Policy Drift %": "policy_drift",
  };

  let green = 0, yellow = 0, red = 0, total = 0;
  const lines = [];

  Object.entries(keyMap).forEach(([kpiName, key]) => {
    const th = thresholds[key];
    if (!th) return;
    total++;

    const valFromTable = tableVals[kpiName]?.value ?? null;
    const val = (valFromTable == null) ? fallback[kpiName] : valFromTable;

    let status = "🔴";
    if (val != null) {
      if (key === "policy_drift") {
        status = (val <= th.green) ? "🟢" : (val <= th.yellow ? "🟡" : "🔴");
      } else {
        status = (val >= th.green) ? "🟢" : (val >= th.yellow ? "🟡" : "🔴");
      }
    }
    if (status === "🟢") green++; else if (status === "🟡") yellow++; else red++;
    lines.push(`${status} ${kpiName}: value=${val == null ? "n/a" : Number(val).toFixed(2)}`);
  });

  const max = total * 2;
  const score = green * 2 + yellow;
  const health = max ? Math.round((score / max) * 100) : 0;

  const drift = fallback["Policy Drift %"] ?? tableVals["Policy Drift %"]?.value ?? 999;

  console.log("status: running | scope=system_harmony_ledger");
  console.log(`Debug: kpiBlock=${kpiBlock ? "ok" : "missing"}, respBlock=${respBlock ? "ok" : "missing"}, thresholds=${Object.keys(thresholds).length}${usedDefault ? " (defaults)" : ""}`);
  lines.forEach(l => console.log(l));
  console.log(`Health Score: ${health}%  |  Drift: ${isNaN(drift) ? "n/a" : Number(drift).toFixed(2)}%`);
  console.log(`Thresholds: min health ${MIN_HEALTH}%, max drift ${MAX_DRIFT}%`);

  const failed = (health < MIN_HEALTH) || (!isNaN(drift) && Number(drift) > MAX_DRIFT);
  // Neue Warning-Heuristik:
  // - Keine Blocker, aber mindestens eine KPI-Warnung (z.B. Harmony gelb, optionale Schwellen knapp verfehlt)
  const warnings = [];
  if (!failed) {
    if (typeof health === "number" && health < (process.env.MIN_HEALTH_WARN || 90)) {
      warnings.push("health_below_warn_threshold");
    }
    if (!isNaN(drift) && Number(drift) > (process.env.MAX_DRIFT_WARN || 5)) {
      warnings.push("drift_above_warn_threshold");
    }
    // Beispiel: Harmony bleibt gelb (Arch v1.1 vs v1.8)
    if (process.env.HARMONY_EXPECTED_GREEN !== "true") {
      warnings.push("harmony_warning");
    }
  }

  if (failed) {
    console.error("status: failed | reason=thresholds_not_met");
    fallbackWrite({ exit: 1 });
    process.exit(1);
  }
  if (warnings.length) {
    console.warn("status: warning | details=%j", warnings);
    fallbackWrite({ exit: 2, warnings });
    process.exit(2);
  }
  console.log(
    "status: passed | health=%d | drift=%s",
    health,
    isNaN(drift) ? "n/a" : Number(drift).toFixed(2)
  );
  fallbackWrite({ exit: 0 });
}

main();
