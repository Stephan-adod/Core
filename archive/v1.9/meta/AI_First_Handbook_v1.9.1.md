---
id: handbook-v1.9.1
layer: meta
status: draft
version: v1.9.1
linked_meta:
  - path: meta/AI_First_System_Architecture_v1.9.md
    version: v1.9
  - path: artefacts/sync/System_Harmony_Ledger_v1.9.md
    version: v1.9
governance:
  prev_freeze: v1.9
  next_probe: GOV-006
---
# AI-First Handbook v1.9.1
## Overview
Freeze v1.9 bestätigt. v1.9.1 beschreibt Proof-, Energy- und CI-Integration im Stabilisationszyklus.

## Proof Integration
- Dual-Proof Pflicht (Learning & Value) je Artefakt.
- Log: artefacts/logs/proofs/proof_log.csv
- CI: scripts/proof_log_agg.mjs (Coverage ≥ 95 %)

## Energy Integration
- KPI: Energy Index (eROI) ≥ 1.1 Ziel (Baseline ≥ 1.0).
- Feed: artefacts/data/sbi/sbi_energy.csv
- CI: scripts/validate_energy.mjs

## CI Workflow
| Step | Script | Purpose |
|---|---|---|
| 1 | proof_log_agg.mjs | Dual-Proof Coverage berechnen |
| 2 | validate_energy.mjs | eROI prüfen + Drift warnen |
| 3 | run_trust_probe_v1_9_1.mjs | Gesamt-Gate (v1.9.1) |

## Human-in-the-Loop
- Abweichungen werden im Transition Log erfasst und reviewed.

## Changelog
| Version | Date | Change | Author |
|---|---|---|---|
| v1.9.1 | $(date -u +"%Y-%m-%d") | Handbook CI/Proof/Energy Abschnitte | Stephan |
## Governance Appendix (v1.9.1)
Governance Tools: `validate_energy.mjs`, `run_trust_probe_v1_9_1.mjs`
Freeze Gate Validation: automatic in CI → triggers on `System Harmony Ledger` update.
