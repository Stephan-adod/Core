id: P-011
name: Unified Enforcement — Diagnostic Init
version: 2.6
layer: meta
owner: stephan-adod
status: active
goal: read-only repository diagnostic for re-enable
outputs:
  - artefacts/logs/diagnostic_report_v2_6.md
  - artefacts/logs/meta_sync_status_v2_6.json
  - .github/workflows/diag_v2_6.yml
  - scripts/diagnose_repo_state_v2_6.mjs
notes:
  - non-destructive; never exit with code != 0
  - write warnings via ::warning for CI visibility
---

**Scope:** Meta/Docs/Scripts/Workflows Konsistenzcheck, Drift-Erkennung, Lean-CI-Eignung.  
**Nicht-Ziele:** Kein Refactoring, kein Enable von Jobs, kein Gate-Fail.
