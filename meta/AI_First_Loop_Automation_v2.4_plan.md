---
id: AI-FIRST-LOOP-AUTOMATION-v2_4
layer: meta
status: active
owner: stephan-adod
version: v2.4.0
goal: "Automation Start: Forecast Drift Detection + Context Trend Checks (Cycle-2 rollout)"
updated: 2025-10-20
links:
  drift_spec: docs/prompts/P-012_forecast_drift_v2.4.mjs
  runbook: docs/ops/automation_runbook_v2.4.md
  compliance: meta/AI_Compliance_Register_v2.4.json
  data_context: docs/data/context_adoption_history.csv
  data_mape: docs/data/forecast_mape_history.csv
---

# Loop Automation Plan (v2.4)

## Scope
- **What**: Monitor MAPE drift & Context adoption; raise alerts & actions.
- **Why**: Stabilize value loops, keep TTIC ≤ 7 Tage, prevent silent degradation.
- **Where**: Pricing & Attribution forecasting surfaces (Context-enabled).

## Cadence
- Signal-evaluated pro neuem Cycle (Trigger: Drift, Release, Adoption Change) + ad-hoc on release.

## Decision Rules
- `|ΔMAPE| ≥ 0.02` → ALERT (open mini-prompt + mitigation plan)
- `0.01 ≤ |ΔMAPE| < 0.02` → WARN (watchlist)
- Adoption `< 0.90` zwei Zyklen → adoption sprint

## Outputs
- `docs/reports/forecast_drift_findings_v2.4.md` (rolling)
- Lessons update (L-013)
