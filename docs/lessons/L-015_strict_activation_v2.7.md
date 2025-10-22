# Lesson L-015 · Strict Activation (v2.7)

**Datum:** 2025-10-22T12:39:22Z  
**Owner:** stephan-adod  
**Quelle:** artefacts/logs/transition_v2.7_strict_activation.md

## Summary
- Wechsel von **Lean (Warn-Only)** zu **Strict (Fail-on-Error)**.
- **Policy as Code**: PR-Body Anchors, Meta, Lessons & Proofs werden strikt validiert.
- **Lean** bleibt als bewusste Ausnahme (Label `lean-ok`) mit **Auto-Comment** & **Audit-Append**.
- Systemphase aktualisiert (`meta/system_version.json`: *Strict Activation*).

## Lessons (Stephan-Style)

### Governance – *From Tolerance to Trust*
- Single-Intent PRs, auditierbare Entscheidungen.
- Exceptions dokumentiert statt toleriert.

### System – *Policy as Code = Predictable Quality*
- Self-Diagnose & harte Fehlerbedingungen.
- Quickref in Workflow-Logs verlinkt.

### Operator – *DX meets PX*
- Auto-Comments erklären Lean-Runs; Audit macht Abweichungen sichtbar.
- Keine manuelle Entscheiderlast, aber volle Transparenz.

### AI-Culture – *Codex als Governance-Partner*
- KI generiert/prüft PR-Bodies; Dialog statt Kontrolle.
- Strukturierte Artefakte ermöglichen Lernen über Phasen hinweg.

## Next
- **v2.8 Adaptive Governance**: kontext-abhängige Checks, Soft-Fail-Toleranzen, Intent-Confidence.
