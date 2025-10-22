#!/usr/bin/env node
/**
 * Appends calibration note to L-016 after a calibration run.
 * Usage: node scripts/append_calibration_reflection.mjs
 */
import fs from "fs";

const res = "artefacts/policies/confidence_rules_v2_9.calibrated.json";
const file = "artefacts/logs/lessons/L-016_adaptive_baseline.md";

if (!fs.existsSync(res) || !fs.existsSync(file)) {
  console.warn("ℹ️ Nothing to append (missing calibrated JSON or lesson file).");
  process.exit(0);
}
const j = JSON.parse(fs.readFileSync(res,"utf8"));
const { observed, targets, scales, runs_considered } = j.meta || {};
const now = new Date().toISOString().split("T")[0];

const block = `
---

## Phase v2.9 – Calibration Snapshot
📅 Date: ${now}

**Observed vs Targets**
- observed: high=${(observed?.high??0).toFixed(2)} | med=${(observed?.medium??0).toFixed(2)} | low=${(observed?.low??0).toFixed(2)}
- targets:  high=${(targets?.high??0).toFixed(2)} | med=${(targets?.medium??0).toFixed(2)} | low=${(targets?.low??0).toFixed(2)}
- runs considered: ${runs_considered ?? "-"}

**Scales**
- positive weights × ${scales?.posScale?.toFixed?.(3) ?? "-"}
- negative weights × ${scales?.negScale?.toFixed?.(3) ?? "-"}

**Reflection**
> Calibration proposal generated; review & apply via separate PR if accepted.
`;

fs.appendFileSync(file, block);
console.log("📝 Calibration reflection appended to L-016.");
