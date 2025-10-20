/**
 * P-011 · Loop Integration v2.3.1-refined
 * Purpose: Declarative loop specification for Governance, Business, and Reflection loops.
 * Refinements: +Context Adoption KPI, +AI Act model-card validation, +Reflection output file.
 * Location: docs/prompts/P-011_loops_v2.3.mjs
 */

export const loops_v23 = {
  meta: {
    id: "P-011-loops-v2.3.1-refined",
    owner: "stephan-adod",
    version: "v2.3.1",
    blueprint: "meta/AI_First_System_Architecture.md",
    decision_matrix: "docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md",
    diagram: "docs/diagrams/DaaS_L3_Context_Map_v2.3.mmd",
    intent:
      "Maintain 7-day feedback cycles that convert data into validated value under governance.",
    north_star: "TTIC ≤ 7 Tage @ Policy Valid ≥ 95%",
  },

  // ────────────────────────────────────────────────────────────────────────────
  governance_loop: {
    cadence: { type: "continuous", minIntervalHours: 24 },
    triggers: [
      "new_release:blueprint",
      "change:guardrail_registry",
      "context_api.version_age>7d",
      "csv_schema_change:docs/data/*.csv",
    ],
    inputs: {
      policies: "validation_registry.json",
      transition_log: "docs/logs/transition_META_v2.2.5_to_v2.3.1.md",
      matrix: "docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md",
    },
    checks: [
      { id: "policy-valid", rule: "Policy Valid % ≥ 95" },
      { id: "sanity", rule: "Sanity % ≥ 90 (stub until real script exists)" },
      { id: "context-age", rule: "Context API version age < 7 days" },
      { id: "consent", rule: "Consent-aware ingestion ONLY for Attribution" },
      { id: "ai_act", rule: "Risk class ≤ medium; model cards present" },
      { id: "model_card_validated", rule: "AI model card exists & approved" },
    ],
    actions: [
      "emit:governance_report.md",
      "open:policy_design_review if Gov Risk ≥ 4 in decision matrix",
      "notify:owners on failed probes (context_version missing, stale context)",
    ],
    kpis: {
      policy_valid_pct: "≥0.95",
      sanity_pct: "≥0.90",
      probe_pass_rate: "≥0.95",
    },
    visible_kpis: ["policy_valid_pct", "sanity_pct", "probe_pass_rate"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  business_loop: {
    cadence: { type: "weekly", weekday: "Mon", hour: 9 },
    scope: ["L3.1 Pricing", "L3.2 Attribution", "L3.3 Context Enrichment"],
    inputs: {
      pricing_api: "/daas/pricing/v1/*",
      attribution_api: "/daas/attr/v1/*",
      context_api: "/daas/context/v1/*",
      context_version_required: true,
    },
    measures: [
      { id: "pricing_uplift_pct", target: "↑", note: "vs. control" },
      { id: "forecast_mape_delta", target: "↓", note: "with Context API" },
      { id: "mroi", target: "↑", note: "channel/campaign weekly" },
      { id: "decision_latency_h", target: "≤48h" },
      { id: "context_adoption_rate", target: "≥0.9", note: "usage of Context API in downstream models" },
    ],
    actions: [
      "recommend:budget_shift if mROI spread > threshold",
      "recommend:promo_adjust if elasticity drift detected",
      "recommend:context_rollout where MAPE improves",
    ],
    outputs: {
      weekly_brief: "docs/reports/weekly_business_loop_v2.3.md",
      change_log: "docs/reports/business_actions_log.md",
    },
    visible_kpis: ["mroi", "pricing_uplift_pct", "context_adoption_rate"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  reflection_loop: {
    cadence: { type: "biweekly", weekday: "Fri", hour: 15 },
    inputs: {
      lessons_L011: "docs/lessons/L-011_synthesis_v2.3.md",
      collab_L012: "docs/lessons/L-012_collaboration_optimization_v2.3.md",
      governance_report: "generated:governance_report.md",
      business_brief: "docs/reports/weekly_business_loop_v2.3.md",
    },
    prompts: [
      "What changed in the system since last review?",
      "Which decision created measurable value? Which did not?",
      "Where did governance slow us down useful vs. harmfully?",
      "What should become a policy or a script next?",
    ],
    actions: [
      "append:docs/lessons/L-011_synthesis_v2.3.md",
      "open:mini_prompt for any change requiring structural modification",
      "emit:docs/reports/reflection_summary_v2.3.md",
    ],
    kpis: {
      harmony_score: ">0.9",
      loop_speed_days: "≤7",
      rework_rate: "<1.5",
    },
    visible_kpis: ["harmony_score", "loop_speed_days", "rework_rate"],
  },
};

// optional dryRun for validation
export function dryRun() {
  console.log("[P-011] Loops v2.3.1 refined — spec OK, self-documented.");
}
