---
title: Human-in-the-Loop Playbook
version: v2.4.6
phase: cycle_mode
status: active
updated: 2025-10-21
---

## Cycle Mode (v2.4)
- **Trigger:** Signal-based (Drift Event, Adoption Change, Release)
- **Artefakte:** 
  - Cycles Report → `docs/reports/business_loop_cycles_v2.4.md`
  - Reflection → `docs/reports/reflection_cycles_v2.4.md`
  - Automation Plan → `meta/AI_First_Loop_Automation_v2.4_plan.md`
  - Checklist → `docs/ops/cycle_start_checklist_v2.4.md`

## Operator Flow
1. *Diagnostics* lesen (Actions-Summary).
2. *Cycle Start Checklist* durchgehen.
3. Messpunkte erfassen (Context, ΔMAPE) → Findings aktualisieren.
4. Governance Review & Lessons ergänzen.

## Decision Boundaries
- Menschlicher Operator bestätigt Freeze-Status & Promotions.
- Automation wird nur aktiviert, wenn Lessons & Reports synchron sind.
- Archive (`docs/archive/weekly_v2.3/`) bleibt read-only.

## Linked References
- `meta/AI_First_Roadmap.md`
- `meta/AI_First_System_Architecture.md`
- `docs/ops/freeze_candidate_check_v2.4.md`
- `docs/lessons/`

## Change Log
- 2025-10-21: Playbook auf Cycle Mode (v2.4) angehoben; Operator Flow aktualisiert.

> Drift accepted (until v2.4.8) — Grund: Weekly Archive für Cycle Mode v2.4 wird neu geschnitten; v2.3-Verweis bleibt bis zum neuen Archiv read-only bestehen.
