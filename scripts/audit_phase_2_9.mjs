#!/usr/bin/env node
import fs from "fs";
import path from "path";

const OUT = "artefacts/logs/audit_phase_2.9_report.md";
const json = {};

function check(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

json.timestamp = new Date().toISOString();
json.phase = "v2.9";
json.meta = check("meta/system_version.json");
json.docs = {
  hygiene_report: check("artefacts/logs/doc_hygiene_report_v2_9.json"),
  diagnostic_report: check("artefacts/logs/diagnostic_report_v2_9.md"),
  transition: check("artefacts/logs/transition_v2.9_predictive_confidence.md"),
};
json.lessons = {
  baseline: check("artefacts/logs/lessons/L-016_adaptive_baseline.md"),
  micro_csv_fix: check(
    "artefacts/logs/lessons/snippets/L-017-CSV-Hygiene-Parser-Fix.md",
  ),
};
json.policy_source = check("meta/AI_First_Handbook.md");

const allGood =
  Object.values(json.docs).every(Boolean) &&
  Object.values(json.lessons).every(Boolean);

const md = `
# 🧩 Phase v2.9 Audit Report
_Date:_ ${json.timestamp}

## Summary
- Phase: v2.9 Predictive Confidence  
- Audit result: ${allGood ? "✅ PASS" : "⚠️ PARTIAL"}

## Checklist Overview
| Section | Status |
|----------|---------|
| Meta Freeze | ${json.meta ? "✅" : "❌"} |
| Hygiene Report | ${json.docs.hygiene_report ? "✅" : "❌"} |
| Diagnostic Snapshot | ${json.docs.diagnostic_report ? "✅" : "❌"} |
| Transition Log | ${json.docs.transition ? "✅" : "❌"} |
| Baseline Lesson | ${json.lessons.baseline ? "✅" : "❌"} |
| Micro-Lesson CSV Fix | ${json.lessons.micro_csv_fix ? "✅" : "❌"} |
| Policy Source | ${json.policy_source ? "✅" : "❌"} |

## Result
${
  allGood
    ? "✅ Phase v2.9 fully verified. Ready for tagging (phase/2.9-done)."
    : "⚠️ Incomplete. Review missing artefacts before tagging."
}

---
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log(`✅ Audit report written to ${OUT}`);
