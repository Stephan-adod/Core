---
id: transition-validator-scope-v2_4
layer: meta
status: done
owner: stephan-adod
version: v2.4.3
date: 2025-10-21
---

# Transition · Validator Scope (Lessons)

- **Change:** `scripts/validate_lessons_v1.mjs` excludes `artefacts/lessons/` (legacy).
- **Rationale:** Aktive Lessons sind unter `docs/lessons/` zentralisiert (v2.3+).  
  Legacy-Bestand in `artefacts/lessons/` ist read-only & historisch → keine Version-Validation mehr.
- **Effect:** `npm run validate:lessons` prüft nur aktive Quelle der Wahrheit.
