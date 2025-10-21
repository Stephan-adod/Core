---
id: transition-version-target-v2.4.7
layer: meta
status: done
author: stephan-adod
version: v2.4.7
date: 2025-10-24
---

# Transition — Version Target Update (v2.4.7)

**Action:** Raised system target version from `v2.4.6` → `v2.4.7`.

**Scope:** `meta/system_version.json` for drift validation & governance sync.

**Reason:** Align all CI checks (lessons + drift) to one canonical target to remove split-brain between validators.

**Outcome:** Drift & lessons validators now evaluate against `v2.4.7`. CI alignment restored.
