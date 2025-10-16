# Repo Diagnose · v1.1

**Exit:** 2 (warnings)

## Summary
- Matrix v1.0 present: true
- Matrix v1.1 present: true
- Tickets v1.0: 3 | v1.1: 3
- Registry present: true | Tickets detected: 14
- Renderer matrix preference: prefers v1.1

## Differences v1.0 ↔ v1.1
- Only in v1.0: —
- Only in v1.1: —
- Status diffs: —

## Priority consistency (equal vectors should share priority)
- v1.0 issues: 0 ✅
- v1.1 issues: 0 ✅

## Registry alignment
- Registry only: AT-015, AT-018, AT-019, AT-020, AT-021, AT-022, AT-023, AT-024, AT-025, AT-026, AT-027
- Matrix only: —

## Workflow inventory (metadata)
- .github/workflows/backlog_health.yml → triggers: push, pull_request, schedule
- .github/workflows/deep_diagnose.yml → triggers: push, pull_request, schedule
- .github/workflows/ledger_validate.yml → triggers: push, pull_request, schedule
- .github/workflows/meta_diagnose.yml → triggers: push, pull_request, schedule
- .github/workflows/trust_probe.yml → triggers: push, pull_request, schedule

## Findings
- [medium] registry · R-002: Registry contains tickets missing in matrix

## Suggested next steps (non-destructive)
- Pick a single source of truth for the backlog matrix (prefer v1.1 or v1.0), and align the other.
- For identical score vectors, harmonize the priority values (or move to computed priority in renderer later).
- Ensure the dashboard renderer points to the intended matrix (prefer v1.1 with v1.0 fallback).
- Align registry tickets with matrix (add missing or prune placeholders).
