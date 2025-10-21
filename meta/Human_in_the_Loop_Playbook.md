---
title: Human-in-the-Loop Playbook
version: v2.4.7
status: active
updated: 2025-10-24
layer: operations
owner: Stephan (System Owner & Mentor)
---

## Cycle Mode (v2.4.7)
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
- Archive (`docs/archive/weekly_v2.4/`) bleibt read-only.

## Linked References
- `meta/AI_First_Roadmap.md`
- `meta/AI_First_System_Architecture.md`
- `docs/ops/freeze_candidate_check_v2.4.md`
- `docs/lessons/`

## Change Log
- 2025-10-24: Front Matter v2.4.7, Ownership & Archive-Links stabilisiert.
- 2025-10-21: Playbook auf Cycle Mode (v2.4) angehoben; Operator Flow aktualisiert.

> Drift waiver closed (v2.4.7) — Weekly Archive stabilisiert unter `docs/archive/weekly_v2.4/` (read-only, canonical).
