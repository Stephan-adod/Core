---
id: transition-meta-core-v2_4_6-and-drift-guard
layer: meta
status: done
owner: stephan-adod
version: v2.4.6
date: 2025-10-21
---

# Transition · Meta Core v2.4.6 + Drift Guard

**Upgraded**
- Roadmap, HiTL Playbook, CORE_INDEX → v2.4.6.

**Link Fixes**
- Ops & Reports Links auf v2.4 harmonisiert (loop_runbook, freeze_candidate_check).

**Validator**
- `check_version_drift.mjs`: scope nur aktive Bereiche; `artefacts/**`, `docs/archive/**` ausgeschlossen.
- Whitelist: `meta/_fixtures/version_overrides.json` → Architecture pinned bei v2.3.1 (bis Blueprint v2.5).

**Outcome**
- `npm run validate:drift` grün, aktive Meta auf v2.4.6 konsistent, bewusste Ausnahmen dokumentiert.
