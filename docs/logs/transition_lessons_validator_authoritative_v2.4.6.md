---
id: transition-lessons-validator-authoritative-v2_4_6
layer: meta
status: done
owner: stephan-adod
version: v2.4.6
date: 2025-10-21
---
- Scope hardened to `docs/lessons/**` (deny everything else)
- Target version read from `meta/system_version.json.active` with env override
- Added debug banner to show effective scope/target in CI logs
- Pinned `npm run validate:lessons` to scripts/validate_lessons_v1.mjs
