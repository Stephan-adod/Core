#!/usr/bin/env node
/**
 * v2.8 · Adaptive Validator (refined)
 * Bewertet PR-Kontext → Confidence Score → Soft/Hard Decision.
 */
import fs from "fs";

const ctxFile = "artefacts/logs/context_features_v2_8.json";
if (!fs.existsSync(ctxFile)) {
  console.error("❌ Context features missing.");
  process.exit(1);
}
const ctx = JSON.parse(fs.readFileSync(ctxFile, "utf8"));

// einfache heuristische Regelmatrix
let score = 100;
const rules = [];

if ((ctx.labels || []).includes("experimental")) {
  score -= 20;
  rules.push("label:experimental");
}
if (ctx.changed_files > 25) {
  score -= 20;
  rules.push("large-change");
}
if (ctx.additions > 500 || ctx.deletions > 500) {
  score -= 10;
  rules.push("massive-edit");
}
if (ctx.branch?.startsWith("hotfix/")) {
  score += 10;
  rules.push("hotfix-boost");
}

score = Math.max(0, Math.min(100, score));
const decision = score < 60 ? "soft-fail" : "pass";

const result = {
  timestamp: new Date().toISOString(),
  score,
  decision,
  triggered_rules: rules,
  context: ctx
};

fs.writeFileSync(
  "artefacts/logs/adaptive_result_v2_8.json",
  `${JSON.stringify(result, null, 2)}\n`
);
if (decision === "soft-fail") {
  console.warn(`::warning::Adaptive soft-fail (score ${score}) → context-sensitive warning`);
  process.exitCode = 0;
} else {
  console.log(`✅ Adaptive check passed (score ${score})`);
}
