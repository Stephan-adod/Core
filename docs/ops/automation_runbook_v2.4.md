---
id: ops-automation-v2_4
layer: meta
status: active
owner: stephan-adod
version: v2.4.0
goal: "Betrieb von Forecast Drift Detection & Context Trend Checks"
---

# Automation Runbook (v2.4)

## Inputs
- `docs/data/context_adoption_history.csv`
- `docs/data/forecast_mape_history.csv`
- Spec: `docs/prompts/P-012_forecast_drift_v2.4.mjs`

## Cadence
- **Signal-based**: neuer *Cycle* wird ausgelöst, wenn Drift/Adoption-Trigger feuern (kein fixer Kalender).

## Procedure (manual now, automatable later)
1. Neue *Cycle*-Messpunkte anhängen (Context Adoption, ΔMAPE).
2. Spezifikation prüfen (`dryRun()`).
3. Befunde in `docs/reports/forecast_drift_findings_v2.4.md` dokumentieren.
4. Falls *ALERT* → Mini-Prompt öffnen; falls *WARN* → beobachten.
5. Lessons in `docs/lessons/L-013_loop_stabilization_v2.4.md` ergänzen.

## Success
- Keine ALERTS, WARN-Trends ≤ 2 Cycles.
- Adoption ≥ 0.90 stabil.

## Pre-Flight Check (v2.4-a)
- **Data Freshness:** letzte Einträge in `docs/data/*history.*` < 7 Tage.
- **Spec Health:** `drift_v24.dryRun()` ohne Fehler.
- **Drift Score:** mit letzten N Cycles via `computeDriftScore()` berechnen und im Findings-Report eintragen.
- **Auto-Tune Hinweis:** falls Varianz der letzten 3 Cycles < 0.003 → setze `mape_delta_warn` auf 0.008 (Policy-Change via Mini-Prompt).
