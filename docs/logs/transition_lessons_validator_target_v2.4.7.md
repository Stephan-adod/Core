---
id: transition-lessons-validator-target-v2_4_7
layer: meta
status: done
owner: stephan-adod
version: v2.4.7
date: 2025-10-22
---

# Transition · Lessons Validator Target (v2.4.7)

**What**
- LESSONS_TARGET_VERSION von v2.4.6 → **v2.4.7** angehoben (CI-Workflow `lessons-validate`).
- `meta/system_version.json` auf Target **v2.4.7** (inkl. `active`) synchronisiert.

**Why**
- Validator-Release v2.4.7 ist authoritative; CI muss auf die neue Zielversion zeigen.

**Outcome**
- Lessons-Validator läuft in CI jetzt mit Target v2.4.7.
