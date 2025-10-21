---
date: 2025-10-22
author: CI Team
type: transition
target: lessons-validator
version: v2.4.6
---

# Transition Log — Lessons Validator v2.4.6

- Promoted the lessons validator to authoritative scope (`docs/lessons/**`).
- Pinned CI workflow to `scripts/validators/lessons_v2_4_6.mjs` with explicit target `v2.4.6`.
- Disabled legacy validator script via hard exception to prevent accidental reuse.
- Added debug banner to CI logs to surface active validator script + target.
- Documented version activation in `meta/system_version.json` and ensured drift checks remain in place.
