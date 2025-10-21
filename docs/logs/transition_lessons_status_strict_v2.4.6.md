---
id: transition-lessons-status-strict-v2_4_6
layer: meta
status: done
owner: stephan-adod
version: v2.4.6
date: 2025-10-21
---

# Transition · Lessons Validator (strict status)

**Change**
- Validator akzeptiert ab jetzt **nur** `status: active` für `docs/lessons/**`.
- Alle anderen Werte (fehlend, draft, archived, typos) → Fehler.

**Reason**
- Verhindert, dass versehentlich „nicht-aktive“ Lessons im aktiven Scope durchrutschen.
