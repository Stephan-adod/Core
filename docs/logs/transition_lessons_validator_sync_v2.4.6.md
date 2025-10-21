---
id: transition-lessons-validator-sync-v2_4_6
layer: meta
status: done
owner: stephan-adod
version: v2.4.6
date: 2025-10-21
---

# Transition · Lessons Validator Sync (v2.4.6)

**What**
- Lessons-Target von v2.3.1 → **v2.4.6** angehoben (dynamisch via `meta/system_version.json`).
- Scope gehärtet: validiert werden nur `docs/lessons/**` (kein `artefacts/lessons/**`, kein `docs/archive/**`).

**Why**
- Alle offenen PRs waren durch veraltetes Target + falschen Scope blockiert.

**Outcome**
- CI Lessons-Check wird grün, PRs `#139`, `#142`, `#144` sind nicht mehr blockiert.
