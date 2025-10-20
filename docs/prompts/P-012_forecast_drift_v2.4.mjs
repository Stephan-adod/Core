/**
 * P-012 · Forecast Drift Detection — v2.4-a (refined)
 * Adds: computeDriftScore(), threshold_auto_tune flag, findings output.
 * Location: docs/prompts/P-012_forecast_drift_v2.4.mjs
 */

export const drift_v24 = {
  meta: {
    id: "P-012-forecast-drift-v2.4-a",
    version: "v2.4.1",
    owner: "stephan-adod",
    blueprint: "meta/AI_First_System_Architecture.md",
    reports: {
      business: "docs/reports/business_loop_cycles_v2.4.md",
      reflection: "docs/reports/reflection_cycles_v2.4.md",
      findings: "docs/reports/forecast_drift_findings_v2.4.md"
    },
    data: {
      context_trend_csv: "docs/data/context_adoption_history.csv",
      mape_trend_csv: "docs/data/forecast_mape_history.csv",
      context_trend_json: "docs/data/context_adoption_history.json",
      mape_trend_json: "docs/data/forecast_mape_history.json"
    },
    compliance_register: "meta/AI_Compliance_Register_v2.4.json",
    intent: "Detect material forecast error drift early and tie actions to governance."
  },

  thresholds: {
    mape_delta_warn: 0.01,      // abs ΔMAPE ≥ 1pp
    mape_delta_alert: 0.02,     // abs ΔMAPE ≥ 2pp
    adoption_min_target: 0.90,  // Context adoption target
    threshold_auto_tune: true   // allow auto-tightening based on recent variance
  },

  probes: [
    { id: "mape-drift", rule: "abs(delta_mape) >= mape_delta_warn" },
    { id: "adoption-below-target", rule: "context_adoption_rate < adoption_min_target" },
    { id: "model-card", rule: "compliance.model_card_validated === true" }
  ],

  actions: [
    "emit:docs/reports/forecast_drift_findings_v2.4.md",
    "notify:owners if mape-drift >= alert",
    "open:mini_prompt if adoption-below-target for 2 consecutive cycles",
    "log:compliance status into transition log when model-card probe flips"
  ],

  kpis: {
    drift_incidents: "count per month",
    mean_mape_delta: "avg absolute delta",
    adoption_rate: "last value",
    drift_score: "0..1 aggregated health (higher = worse)"
  },

  // weighted drift score from the last N learning cycles (spec-level, pseudo)
  computeDriftScore(samples /* [{delta_mape, weight?}] */) {
    if (!samples || !samples.length) return 0;
    const N = Math.min(samples.length, 6); // last ~6 learning cycles
    const recent = samples.slice(-N);
    // weight recency linearly (1..N)
    const sumW = recent.reduce((a, _, i) => a + (i + 1), 0);
    const score = recent.reduce((acc, s, i) => {
      const w = (i + 1);
      const d = Math.abs(Number(s.delta_mape || 0));
      return acc + (w * d);
    }, 0) / sumW;
    // normalize to 0..1 by assuming alert threshold ~= 0.02
    const norm = Math.min(1, score / 0.02);
    return Number(norm.toFixed(3));
  },

  // pseudo-runner for future automation
  dryRun() {
    console.log("[P-012] Drift spec v2.4-a — thresholds & scoring ready.");
  }
};
