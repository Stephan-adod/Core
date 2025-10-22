#!/usr/bin/env node
/**
 * v2.9 · Intent-Confidence (refined)
 * - normalisierte Score-Logik (0..1)
 * - reasons[] + triggers[]
 * - Trend-Logging (CSV)
 */
import fs from "fs";
import path from "path";

const ctxPath   = "artefacts/logs/context_features_v2_8.json";
const rulesPath = "artefacts/policies/confidence_rules_v2_9.json";
const outJson   = "artefacts/logs/confidence_result_v2_9.json";
const trendCsv  = "artefacts/logs/confidence_trend_v2_9.csv";

function readJSON(p){ return JSON.parse(fs.readFileSync(p, "utf8")); }
function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function ensureDir(p){ fs.mkdirSync(path.dirname(p), { recursive:true }); }

if (!fs.existsSync(ctxPath))   { console.error("❌ Missing context_features_v2_8.json"); process.exit(1); }
if (!fs.existsSync(rulesPath)) { console.error("❌ Missing confidence_rules_v2_9.json"); process.exit(1); }

const ctx   = readJSON(ctxPath);
const rules = readJSON(rulesPath);

let score   = 1.0;
const triggers = [];
const reasons  = [];

// helpers
const L = (ctx.labels || []);
const additions = Number(ctx.additions || 0);
const deletions = Number(ctx.deletions || 0);
const changed   = Number(ctx.changed_files || 0);

// signals
if (L.includes("experimental")) {
  score += rules.weights["label.experimental"]; triggers.push("label.experimental");
  reasons.push("Experimental label reduces confidence");
}
if (changed > rules.signals["files.large.threshold"]) {
  score += rules.weights["files.large"]; triggers.push("files.large");
  reasons.push(`Large file-change count (${changed})`);
}
if (additions > rules.signals["diff.heavy.additions"] || deletions > rules.signals["diff.heavy.deletions"]) {
  score += rules.weights["diff.heavy"]; triggers.push("diff.heavy");
  reasons.push(`Heavy diff (add:${additions}/del:${deletions})`);
}
if (String(ctx.branch || "").startsWith("hotfix/")) {
  score += rules.weights["branch.hotfix"]; triggers.push("branch.hotfix");
  reasons.push("Hotfix boost");
}
// optional signals (no-op unless you feed them into ctx)
if (ctx.review_approved === true) {
  score += (rules.weights["review.approved"] || 0); triggers.push("review.approved");
  reasons.push("Code review approved");
}
if (ctx.tests_modified === true) {
  score += (rules.weights["tests.modified"] || 0); triggers.push("tests.modified");
  reasons.push("Tests modified alongside code");
}

score = clamp01(score);
let level = "high";
if (score < rules.thresholds.low)      level = "low";
else if (score < rules.thresholds.medium) level = "medium";

const result = {
  timestamp: new Date().toISOString(),
  confidence_score: Number(score.toFixed(2)),
  confidence_level: level,
  triggers, reasons,
  context: { branch: ctx.branch, changed_files: changed, additions, deletions, labels: L }
};

ensureDir(outJson);
fs.writeFileSync(outJson, JSON.stringify(result, null, 2));

// Trend CSV header
ensureDir(trendCsv);
if (!fs.existsSync(trendCsv)) {
  fs.writeFileSync(trendCsv, "timestamp,branch,score,level,changed_files,additions,deletions,labels\n");
}
// append row
const row = [
  result.timestamp,
  JSON.stringify(ctx.branch||""),
  result.confidence_score,
  result.confidence_level,
  changed, additions, deletions,
  JSON.stringify(L.join("|"))
].join(",") + "\n";
fs.appendFileSync(trendCsv, row);

console.log(`🔍 Confidence: ${result.confidence_score} (${result.confidence_level})`);
if (level === "low") {
  console.warn("::warning::Low confidence → Soft-Fail (warn-only).");
  process.exitCode = 0; // warn-only
}
