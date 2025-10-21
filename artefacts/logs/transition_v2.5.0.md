# Transition Log — v2.5.0 (Phase 2 · Handbook Enforcement)

---
date: 2025-10-21T00:00:00Z
actor: stephan-adod
action: "Phase 2 · Handbook Enforcement aktiviert"
result: success
changes:
  - "Workflow .github/workflows/handbook-enforce.yml: Trigger auf pull_request (strict)"
  - "scripts/validate_handbook.mjs: Compliance-Prüfungen aktiv (Compliance-Block, Intent ≤1200, Logging-Referenz)"
  - "PR-Template: Compliance-, Intent-, Logging-, Policy-Version-Felder sichtbar"
validation:
  manual_run: "ok (Safe Start · Refined)"
  pr_trigger_run: "ok (strict)"
policy:
  source: "meta/AI_First_Handbook.md"
  version: "v2.4.7"
notes:
  - "Validator blockiert nicht-konforme PRs mit klaren Hinweisen"
  - "Optionaler Bypass per Label 'skip-handbook' verfügbar (für Bootstrapping/Hotfixes)"
  - "Feature-Flags unverändert: context_pack=false, pr_synthesizer=false, drift_sentry=false"
links:
  sample_pr: "ADD-PR-LINK"
  actions_run: "ADD-ACTIONS-LINK"
  workflow_file: ".github/workflows/handbook-enforce.yml"
  validator_script: "scripts/validate_handbook.mjs"
---
