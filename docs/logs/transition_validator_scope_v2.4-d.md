---
id: transition-validator-scope-v2_4_d
layer: meta
status: done
owner: stephan-adod
version: v2.4.4
date: {{today}}
---

# Transition · Validator Scope (v2.4-d)

**Changed**
- `scripts/check_version_drift.mjs`: prüft nur aktive Layer (`meta/`, `docs/`), schließt `artefacts/**` und `docs/archive/**` aus.
- `scripts/validate_lessons_v1.mjs`: Legacy-Lessons ausgeschlossen.

**Rationale**
- Lessons/Reports wurden in v2.3/v2.4 zentralisiert; Legacy-/Archiv-Bestand ist read-only und soll nicht mehr versionvalidiert werden.

**Effect**
- `validate:drift` und `validate:lessons` laufen wieder grün gegen die aktive Quelle der Wahrheit.
