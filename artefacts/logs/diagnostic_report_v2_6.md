# Diagnostic Report v2.6 (Read-Only)
_timestamp: 2025-10-22T07:08:34.591Z_

## Summary
```json
{
  "meta_system_version": "review",
  "workflows_count": 6,
  "workflow_sanity_issues": 0,
  "missing_script_refs": 0,
  "backlog_matrices": 0,
  "backlog_header_drifts": 0,
  "docs_present": true,
  "docs_dir": true,
  "lessons_log": false,
  "proofs_log": false
}
```

## Meta · system_version.json
- Path: `meta/system_version.json`
- Exists: true
- Valid JSON: true
- Missing keys: version, freeze, updated_at
```json
{
  "target_version": "v2.4.7",
  "active": "v2.4.7",
  "phase": "DaaS Factory Planning",
  "updated": "2025-10-24",
  "pointers": {
    "core_docs": [
      "docs/AI_First_Business_Case.md",
      "meta/AI_First_Handbook.md",
      "meta/AI_First_System_Architecture.md",
      "meta/Human_in_the_Loop_Playbook.md",
      "meta/AI_First_Roadmap.md",
      "meta/CORE_INDEX.md"
    ]
  },
  "policy_source": "meta/AI_First_Handbook.md",
  "features": {
    "context_pack": false,
    "pr_synthesizer": false,
    "drift_sentry": false
  }
}
```

## Workflows
- Count: 6

## Backlog Matrices
- Files: 0

## Docs Presence
- README: README.md
- docs/ dir: true

## Lessons & Proofs Logs
- lessons_log.csv: false
- proof_log.csv: false

## File Inventory (git ls-files)
<details><summary>Show</summary>

- .github/pull_request_template.md
- .github/workflows/diag_p_core.yml
- .github/workflows/handbook-enforce.yml
- .github/workflows/handbook-validate.yml
- .github/workflows/lessons-validate.yml
- .github/workflows/sanity.yml
- .github/workflows/sanity_v2.4.7.yml
- README.md
- archive/v1.9/CHANGELOG_v1.9.md
- archive/v1.9/README.md
- archive/v1.9/artefacts/dashboards/backlog_dashboard_v1.1.md
- archive/v1.9/artefacts/data/sbi/sbi_energy.csv
- archive/v1.9/artefacts/data/ticket_time_rollup.json
- archive/v1.9/artefacts/data/time_sessions.json
- archive/v1.9/artefacts/logs/.keep
- archive/v1.9/artefacts/logs/architecture_delta_v1_1_to_v1_8.md
- archive/v1.9/artefacts/logs/backlog_matrix_v1.0.md
- archive/v1.9/artefacts/logs/backlog_matrix_v1.0.md.bak
- archive/v1.9/artefacts/logs/backlog_matrix_v1.1.md
- archive/v1.9/artefacts/logs/backlog_matrix_v1.1.md.bak
- archive/v1.9/artefacts/logs/backlog_matrix_v1.8.md
- archive/v1.9/artefacts/logs/cost_time.csv
- archive/v1.9/artefacts/logs/deep_diagnose_findings.json
- archive/v1.9/artefacts/logs/deep_diagnose_report.md
- archive/v1.9/artefacts/logs/deep_diagnose_v1_1.json
- archive/v1.9/artefacts/logs/deep_diagnose_v1_1.md
- archive/v1.9/artefacts/logs/diagnose_core_v1.json
- archive/v1.9/artefacts/logs/diagnose_core_v1.md
- archive/v1.9/artefacts/logs/diagnose_core_v3.json
- archive/v1.9/artefacts/logs/diagnose_core_v3.md
- archive/v1.9/artefacts/logs/diagnose_repo_integrity_v2.json
- archive/v1.9/artefacts/logs/diagnose_repo_integrity_v2.md
- archive/v1.9/artefacts/logs/diagnostics/backlog_schema_diff_2025-10-17.md
- archive/v1.9/artefacts/logs/documentation_diagnostic_v1.8.md
- archive/v1.9/artefacts/logs/energy_validation_report_v1.9.md
- archive/v1.9/artefacts/logs/governance_overview_v1.8_v1.9.md
- archive/v1.9/artefacts/logs/governance_review_v1.9.1.md
- archive/v1.9/artefacts/logs/lessons_AT-015_v1.md
- archive/v1.9/artefacts/logs/lessons_AT-020_v1.md
- archive/v1.9/artefacts/logs/lessons_META_v1.8.md
- archive/v1.9/artefacts/logs/loop_governance_report.json
- archive/v1.9/artefacts/logs/loop_governance_report.md
- archive/v1.9/artefacts/logs/loop_summary.csv
- archive/v1.9/artefacts/logs/meta/BACKLOG_POLICY.md
- archive/v1.9/artefacts/logs/meta/backlog_dashboard_snapshot_v1.1.json
- archive/v1.9/artefacts/logs/meta/diagnose_backlog_v1.0.json
- archive/v1.9/artefacts/logs/meta/diagnose_backlog_v1.0.md
- archive/v1.9/artefacts/logs/meta/diagnose_meta_v1.8.json
- archive/v1.9/artefacts/logs/meta/diagnose_meta_v1.8.md
- archive/v1.9/artefacts/logs/meta/diagnose_meta_v1.8_prompt.md
- archive/v1.9/artefacts/logs/policy_audit.csv
- archive/v1.9/artefacts/logs/policy_challenge_v1.9.md
- archive/v1.9/artefacts/logs/policy_sync_report.json
- archive/v1.9/artefacts/logs/policy_sync_report.md
- archive/v1.9/artefacts/logs/prioritization_rules_v1.0.md
- archive/v1.9/artefacts/logs/proof_coverage_report_v1.9.md
- archive/v1.9/artefacts/logs/proof_log.csv
- archive/v1.9/artefacts/logs/proofs/proof_log.csv
- archive/v1.9/artefacts/logs/readiness_AT-020_v1.md
- archive/v1.9/artefacts/logs/rebrief_AT-015_v1.md
- archive/v1.9/artefacts/logs/rebrief_AT-020_v1.md
- archive/v1.9/artefacts/logs/rebrief_TRUST_PROBE_v1.8.md
- archive/v1.9/artefacts/logs/rebrief_v1.9.md
- archive/v1.9/artefacts/logs/refinement_AT-020_v1.md
- archive/v1.9/artefacts/logs/repo_diagnose_v1.1.json
- archive/v1.9/artefacts/logs/repo_diagnose_v1.1.md
- archive/v1.9/artefacts/logs/revenue_report.csv
- archive/v1.9/artefacts/logs/roadmap_v1.0.md
- archive/v1.9/artefacts/logs/sbi_log.csv
- archive/v1.9/artefacts/logs/snapshots/v1.1_filtered_2025-10-16T19-41-22.json
- archive/v1.9/artefacts/logs/sync_stamp.json
- archive/v1.9/artefacts/logs/system_harmony_report_v1.8.md
- archive/v1.9/artefacts/logs/system_health_report.md
- archive/v1.9/artefacts/logs/ticket_quality_report.md
- archive/v1.9/artefacts/logs/ticket_registry_v1.1.md
- archive/v1.9/artefacts/logs/ticket_sync_check_v1.1.json
- archive/v1.9/artefacts/logs/ticket_sync_check_v1.1.md
- archive/v1.9/artefacts/logs/ticket_time_rollup_2025-10-17.md
- archive/v1.9/artefacts/logs/time_sessions_2025-10-17.md
- archive/v1.9/artefacts/logs/transition_AT-015_v1.md
- archive/v1.9/artefacts/logs/transition_AT-020_v1.md
- archive/v1.9/artefacts/logs/transition_v1.9_to_v1.9.1.md
- archive/v1.9/artefacts/logs/trust_probe_report_v1.9.1.md
- archive/v1.9/artefacts/logs/trust_probe_report_v1.9.md
- archive/v1.9/artefacts/logs/trust_probe_v1.8.json
- archive/v1.9/artefacts/logs/trust_probe_v1.8.md
- archive/v1.9/artefacts/rebriefs/Pfad_A_Rebrief_v2.0.md
- archive/v1.9/artefacts/roadmaps/Pfad_A_Operational_Deepening_v2.0.md
- archive/v1.9/artefacts/rollouts/GOV-009_PfadA_Rollout_v2.0.md
- archive/v1.9/artefacts/staging/backlog_matrix_v1.8.proposed.md
- archive/v1.9/artefacts/sync/System_Harmony_Ledger.md
- archive/v1.9/artefacts/sync/System_Harmony_Ledger_v1.9.1.md
- archive/v1.9/artefacts/sync/System_Harmony_Ledger_v1.9.md
- archive/v1.9/docs/BUSINESS_CASE_Horizon_v1.8.md
- archive/v1.9/manifest/archive_manifest_v1.9.json
- archive/v1.9/manifest/core_docs_index_v1.9.md
- archive/v1.9/manifest/linked_meta_fix_report.json
- archive/v1.9/meta/AI_First_Handbook_v1.9.1.md
- archive/v1.9/meta/AI_First_System_Architecture_v1.9.md
- archive/v1.9/meta/Horizon_Map_v1.8.md
- archive/v1.9/meta/Human_in_the_Loop_Playbook_v1.0.md
- archive/v1.9/tickets/AT-000.md
- archive/v1.9/tickets/AT-001.md
- archive/v1.9/tickets/AT-002.md
- archive/v1.9/tickets/AT-003.md
- archive/v1.9/tickets/AT-004.md
- archive/v1.9/tickets/AT-005.md
- archive/v1.9/tickets/AT-006.md
- archive/v1.9/tickets/AT-007.md
- archive/v1.9/tickets/AT-008.md
- archive/v1.9/tickets/AT-009.md
- archive/v1.9/tickets/AT-DOC-001.md
- archive/v1.9/tickets/AT-DOC-002.md
- archive/v1.9/tickets/AT-DOC-003.md
- archive/v1.9/tickets/AT-DOC-004.md
- archive/v1.9/tickets/AT-DOC-005.md
- archive/v1.9/tickets/AT-DOC-006.md
- archive/v1.9/tickets/AT-DOC-007.md
- archive/v1.9/tickets/AT-DOC-010.md
- archive/v1.9/tickets/GOV-004.md
- archive/v1.9/tickets/GOV-005.md
- archive/v1.9/tickets/GOV-006.md
- archive/v1.9/tickets/OPS-LEDGER-AUTO-001.md
- archive/v2.0_bootstrap/AI_First_System_Bootstrap_v2.0.md
- artefacts/lessons/lesson_snippets/L-001_reflexive-activation-bootstrap.md
- artefacts/lessons/lesson_snippets/L-002_inline-versioning-guardrails.md
- artefacts/lessons/lesson_snippets/L-003_ci-guardrails-quality.md
- artefacts/lessons/lesson_snippets/L-004_weekly-reflection-stability.md
- artefacts/lessons/lesson_snippets/L-005_adaptive-governance-stabilization.md
- artefacts/lessons/lesson_snippets/L-006_daas-factory-orientation.md
- artefacts/lessons/lesson_template_v2.2.md
- artefacts/logs/lesson_log.csv
- artefacts/logs/lessons/phase1_handbook_activation.md
- artefacts/logs/lessons/phase2_5b_checkbox_free.md
- artefacts/logs/lessons/phase2_5c_alignment.md
- artefacts/logs/lessons/phase2_6_unified_enforcement.md
- artefacts/logs/lessons/phase2_handbook_enforcement.md
- artefacts/logs/transition_2025-10-19_v1.9_to_v2.0.md
- artefacts/logs/transition_P-006_done_v2.0.md
- artefacts/logs/transition_P-008_5_playbook_update.md
- artefacts/logs/transition_P-008_intent_confirm_v2.1.md
- artefacts/logs/transition_v2.4.8.md
- artefacts/logs/transition_v2.5.0.md
- artefacts/logs/transition_v2.5b_checkbox_free.md
- artefacts/logs/transition_v2.5c_alignment.md
- artefacts/logs/transition_v2.6.0.md
- artefacts/prompts/OP-001_Weekly_Reflection_v2.1.md
- artefacts/prompts/OP-002_Monthly_Synthesis_v2.1.md
- artefacts/prompts/P-009_Lesson_Collector_Prompt_v2.1.md
- artefacts/prompts/P-010_Governance_KPI_Collector_v2.2.md
- artefacts/prompts/RS-001_Review_Synthesis_v2.2.md
- artefacts/reports/governance_kpis.json
- artefacts/reports/governance_kpis.md
- artefacts/syntheses/S-001_reflexive-governance.md
- artefacts/syntheses/S-002_adaptive-governance-meta-synthesis.md
- config/context_pack.yaml
- docs/AI_First_Business_Case.md
- docs/README_Prompts.md
- docs/_fixtures/ok.md
- docs/archive/weekly_v2.3/INDEX.md
- docs/archive/weekly_v2.3/reflection_summary_v2.3.md
- docs/archive/weekly_v2.3/weekly_business_loop_v2.3.md
- docs/data/DaaS_UseCase_Decision_Matrix_v2.3.csv
- docs/data/context_adoption_history.csv
- docs/data/context_adoption_history.json
- docs/data/forecast_mape_history.csv
- docs/data/forecast_mape_history.json
- docs/diagrams/DaaS_L3_Context_Map_v2.3.mmd
- docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md
- docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.4.md
- docs/lessons/INDEX.md
- docs/lessons/L-011_synthesis_v2.3.md
- docs/lessons/L-012_collaboration_optimization_v2.3.md
- docs/lessons/L-013_loop_stabilization_v2.4.md
- docs/lessons/L-014_session_lessons_v2.4.md
- docs/lessons/L-015_meta_governance_alignment_v2.4.md
- docs/lessons/README.md
- docs/logs/sanity_v2.4.7.md
- docs/logs/transition_META_v2.2.5_to_v2.3.1.md
- docs/logs/transition_archive_v2.3_to_v2.4.md
- docs/logs/transition_index_badge_v2.4.5.md
- docs/logs/transition_lessons_bump_v2.4.6.md
- docs/logs/transition_lessons_bump_v2.4.7.md
- docs/logs/transition_lessons_status_strict_v2.4.6.md
- docs/logs/transition_lessons_validator_authoritative_v2.4.6.md
- docs/logs/transition_lessons_validator_authoritative_v2_4_6.md
- docs/logs/transition_lessons_validator_sync_v2.4.6.md
- docs/logs/transition_lessons_validator_target_v2.4.7.md
- docs/logs/transition_meta_canonical_upgrade_v2.4.6.md
- docs/logs/transition_meta_cleanup_v2.4.md
- docs/logs/transition_meta_core_v2.4.6_and_drift_guard.md
- docs/logs/transition_meta_inventory_v2.4_audit.md
- docs/logs/transition_meta_v2.4.7.md
- docs/logs/transition_refinement_v2.4.4.md
- docs/logs/transition_validator_scope_and_active_v2.4.6.md
- docs/logs/transition_validator_scope_v2.4.6.md
- docs/logs/transition_version_sync_v2.4.7.md
- docs/logs/transition_version_target_v2.4.7.md
- docs/notes/P-011_decision_reflection_v2.3.md
- docs/ops/automation_runbook_v2.4.md
- docs/ops/cycle_start_checklist_v2.4.md
- docs/ops/freeze_candidate_check_v2.3.md
- docs/ops/freeze_candidate_check_v2.4.md
- docs/ops/lessons_policy_v2.3.md
- docs/ops/loop_runbook_v2.3.md
- docs/ops/loop_runbook_v2.4.md
- docs/ops/sanity_v2_3_stub.md
- docs/prompts/P-011_loops_v2.3.mjs
- docs/prompts/P-012_forecast_drift_v2.4.mjs
- docs/reports/business_loop_cycles_v2.4.md
- docs/reports/forecast_drift_findings_v2.4.md
- docs/reports/meta_inventory_v2.4.json
- docs/reports/meta_inventory_v2.4.md
- docs/reports/reflection_cycles_v2.4.md
- meta/AI_Compliance_Register_v2.4.json
- meta/AI_First_Handbook.md
- meta/AI_First_Loop_Automation_v2.4_plan.md
- meta/AI_First_Roadmap.md
- meta/AI_First_Roadmap_v2.3.md
- meta/AI_First_System_Architecture.md
- meta/AI_First_System_Architecture_v2.3.md
- meta/CORE_INDEX.md
- meta/Human_in_the_Loop_Playbook.md
- meta/Prompt_Inventory.md
- meta/_fixtures/ok.md
- meta/_fixtures/version_overrides.json
- meta/snapshots/AI_First_System_Architecture_v2.2.5.md
- meta/snapshots/system_state_v2.2.5.json
- meta/snapshots/system_state_v2.4.4.json
- meta/system_version.json
- meta/validation_registry.json
- package.json
- scripts/check_version_drift.mjs
- scripts/collect_kpis_v1.mjs
- scripts/diag_p_core.mjs
- scripts/diag_p_core_usage.mjs
- scripts/generate_pr_body.mjs
- scripts/meta_inventory_v2.4_audit.mjs
- scripts/meta_inventory_v2_4_audit.mjs
- scripts/sanity_v22_check.mjs
- scripts/synthesize_pr_body.mjs
- scripts/test_guardrails_v1.mjs
- scripts/validate_handbook.mjs
- scripts/validate_lessons_v1.mjs
- scripts/validators/lessons_v2.4.7.mjs

</details>