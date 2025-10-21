---
id: transition-validator-target-update-v2_4_6
layer: meta
status: done
owner: stephan-adod
version: v2.4.6
date: 2025-10-21
---

# Transition · Validator Target Update (v2.4.6 Sync)

**Purpose**
- Validator prüfte noch gegen altes Ziel (v2.3.1), obwohl Meta-Baseline bereits v2.4.6.
- Alle Lessons & Snippets werden nun korrekt gegen das aktuelle Canonical Target validiert.

**Change**
- Updated `TARGET_VERSION` in `scripts/validate_lessons_v1.mjs` from `v2.3.1` → `v2.4.6`.
- Optional dynamic linkage to `meta/system_version.json`.

**Expected Outcome**
- CI-Pipeline Lessons Check = ✅
- PRs `#139`, `#142`, `#144` unblocked.
