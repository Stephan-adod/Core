---
id: LESSONS-Phase2.6-Unified-Enforcement
layer: meta
version: v2.6.0
date: 2025-10-21
status: logged
owner: stephan-adod
related:
  - ".github/workflows/handbook-enforce.yml"
  - "scripts/synthesize_pr_body.mjs"
  - "scripts/validate_handbook.mjs"
---

## Key Lessons
- **Single-Runner Pipelines** sparen >60 % CI-Minuten ggü. Mehrjob-Designs.
- **API-Reload vor Validate** eliminiert Event-Cache-Race Conditions.
- **Self-Certification**: Synthesizer setzt `[x]`; Validator bestätigt nur.
- **Concurrency pro PR** verhindert Doppel-Läufe bei Force-Push.

## Observations
- Guard `!.github/**` verhindert Self-PR-Deadlocks (CI/Template).
- Timeout 5 min schützt vor „hängenden“ Runs (Kostenschutz).

## Follow-ups
- Optional: „Required status check“ aktivieren.
- Optional: Label `skip-handbook` als Escape-Hatch für Hotfixes.
- Optional: Context-Pack aktivieren (Phase 3), dann Drift-Sentry integrieren.

(End of Lessons)
