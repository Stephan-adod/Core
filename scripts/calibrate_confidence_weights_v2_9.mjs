#!/usr/bin/env node
/**
 * v2.9 · Mini-Calibration (Refined)
 * - liest trend CSV (level-Verteilung)
 * - vergleicht mit Targets
 * - skaliert Gewichte sanft (±10%), gekappt auf ±15% insgesamt pro Lauf
 * - nur Vorschlag: schreibt artefacts/policies/confidence_rules_v2_9.calibrated.json
 * - bricht ab, wenn zu wenige Runs vorliegen (min_runs)
 */
import fs from "fs";

const rulesPath   = "artefacts/policies/confidence_rules_v2_9.json";
const targetsPath = "artefacts/policies/confidence_targets_v2_9.json";
const trendPath   = "artefacts/logs/confidence_trend_v2_9.csv";
const outPath     = "artefacts/policies/confidence_rules_v2_9.calibrated.json";

function clamp(x, a, b){ return Math.max(a, Math.min(b, x)); }

function readCsvLevels(p){
  if (!fs.existsSync(p)) return {high:0, medium:0, low:0, total:0};
  const rows = fs.readFileSync(p, "utf8").trim().split("\n").slice(1).filter(Boolean);
  const acc = {high:0, medium:0, low:0, total:0};
  for (const r of rows) {
    const parts = r.split(",");
    const level = (parts[3] || "").replace(/"/g,"").trim(); // timestamp,branch,score,level
    if (["high","medium","low"].includes(level)) {
      acc[level] += 1; acc.total += 1;
    }
  }
  return acc;
}

if (!fs.existsSync(rulesPath))   { console.error("❌ missing rules"); process.exit(1); }
if (!fs.existsSync(targetsPath)) { console.error("❌ missing targets"); process.exit(1); }

const rules   = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
const targets = JSON.parse(fs.readFileSync(targetsPath, "utf8"));
const dist    = readCsvLevels(trendPath);

const minRuns = targets.limits?.min_runs ?? 20;
if (dist.total < minRuns) {
  console.warn(`⚠️ Not enough data for calibration (have ${dist.total}, need ≥ ${minRuns}).`);
  process.exit(0);
}

const obs = {
  high:  dist.high / dist.total,
  medium:dist.medium / dist.total,
  low:   dist.low / dist.total
};

const t = targets.targets;
const lim = targets.limits || { scale_min:0.9, scale_max:1.1, step_strength:0.5, max_delta_per_run:0.15 };

// gaps
const gapHigh = (t.high ?? 0.6) - obs.high; // + → zu wenig High
const gapLow  = obs.low - (t.low ?? 0.1);   // + → zu viel Low

// scale factors: pos für positive Gewichte, neg für negative
const posScaleRaw = 1 + gapHigh * lim.step_strength;
const negScaleRaw = 1 - gapLow  * lim.step_strength;
const posScale = clamp(posScaleRaw, lim.scale_min, lim.scale_max);
const negScale = clamp(negScaleRaw, lim.scale_min, lim.scale_max);

function capDelta(oldVal, newVal){
  // begrenze Änderung auf ±max_delta_per_run relativ zur 1.0-Skala (ca. ±15%)
  // für Gewichte bedeutet das: max 15% relative Änderung je Lauf
  const ratio = newVal / (oldVal === 0 ? 1e-6 : oldVal);
  const capped = clamp(ratio, 1 - lim.max_delta_per_run, 1 + lim.max_delta_per_run);
  return oldVal * capped;
}

const newWeights = {};
for (const [k, v] of Object.entries(rules.weights || {})) {
  const scaled = v >= 0 ? v * posScale : v * negScale;
  newWeights[k] = Number(capDelta(v, scaled).toFixed(4));
}

const calibrated = {
  ...rules,
  weights: newWeights,
  meta: {
    ...(rules.meta||{}),
    calibrated_at: new Date().toISOString(),
    observed: obs,
    targets: t,
    scales: { posScale, negScale },
    runs_considered: dist.total
  }
};

fs.writeFileSync(outPath, JSON.stringify(calibrated, null, 2));
console.log("✅ Calibrated proposal written →", outPath);
console.log(`obs: high=${obs.high.toFixed(2)} med=${obs.medium.toFixed(2)} low=${obs.low.toFixed(2)} | posScale=${posScale.toFixed(3)} negScale=${negScale.toFixed(3)} (runs=${dist.total})`);
