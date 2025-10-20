---
id: lessons-policy-v2_3
layer: meta
status: active
owner: stephan-adod
version: v2.3.1
goal: "Policy zur Ablage von Lessons (Zentralisierung, Drift-Prävention)"
---

# Lessons Policy (v2.3)

## Zweck
Verhindert Dokumenten-Drift durch zwei Lesson-Orte. Stellt sicher, dass Loops/Reports immer auf dieselbe Quelle zeigen.

## Regeln
1. **Aktiv:** Alle Lessons ab v2.3 werden in `docs/lessons/` geführt.
2. **Legacy:** `artefacts/lessons/` bleibt unverändert (Archiv). Keine neuen Dateien, keine Edits.
3. **Verlinkung:** Falls Legacy-Inhalte benötigt werden, aus `docs/lessons/INDEX.md` heraus verlinken.
4. **Loop-Referenzen:** Loops und Reports referenzieren ausschließlich Dateien aus `docs/lessons/`.

## Operative Checks (leichtgewichtig)
- PR-Review-Frage: *„Enthält der PR Änderungen unter `artefacts/lessons/`?“* → wenn ja: **ablehnen**.
- Reports/Loops prüfen Pfade: müssen `docs/lessons/` referenzieren.

> Hinweis: Diese Policy ergänzt die bestehende Guardrail-Whitelist (`meta/`, `docs/`) und macht die Absicht explizit.
