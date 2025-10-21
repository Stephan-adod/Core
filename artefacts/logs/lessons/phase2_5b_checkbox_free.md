---
id: LESSONS-Phase2.5b-CheckboxFree
layer: meta
version: v2.5b
date: 2025-10-22
status: logged
owner: stephan-adod
related:
  - "scripts/synthesize_pr_body.mjs"
  - "scripts/validate_handbook.mjs"
---

## Key Lessons
- Workflow-Änderungen wirken erst nach Merge in `main`; Script-Patches greifen sofort.
- Checkboxen sind semantisch optional, Marker-basierte Erkennung stabiler.
- Validator sollte mehrere Formen (Marker, Checkbox, Bullet) unterstützen.
- Meta-konformes Logging ermöglicht Hotfix-Rückverfolgung.

## Observations
- Mit Marker-Ansatz kein manuelles Editieren mehr nötig.
- Fehlerquote bei offenen PRs → 0 %.
- Kompatibel mit Unified Pipeline (Phase 2.6).

## Next Steps
- Nach Merge → Phase 2.6 aktivieren (Unified Workflow).
- Lessons in AI-First Handbook v2.5 einpflegen.
