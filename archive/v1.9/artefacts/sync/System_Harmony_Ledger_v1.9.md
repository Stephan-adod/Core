---
id: system_harmony_ledger_v1_9
layer: artefacts
owner: Governance Maintainer
status: active
version: v1.9
linked_meta:
  - path: archive/v1.9/meta/AI_First_System_Architecture_v1.9.md
    version: v1.9
  - path: archive/v1.9/meta/Horizon_Map_v1.8.md
    version: v1.8
  - path: archive/v1.9/docs/BUSINESS_CASE_Horizon_v1.8.md
    version: v1.8
archived: true
archive_base: archive/v1.9/
governance:
  freeze_gate: true
  trust_probe: v1.9
---
# System Harmony Ledger · v1.9
## 1. Active Sources
- meta/AI_First_System_Architecture_v1.9.md
- meta/Horizon_Map_v1.8.md
- docs/BUSINESS_CASE_Horizon_v1.8.md
## 2. Schema Extensions (v1.9)
### Proof
- proof_type: learning|value
- proof_link_learning: path/url
- proof_link_value: path/url
- proof_coverage_pct: 0–100
### Energy
- energy_index_eroi: float
- sbi_sync_ts: ISO timestamp
- feed: artefacts/data/sbi/sbi_energy.csv
### Harmony / Validation
- shs, drift_pct, policy_valid_pct
## 3. Validation Targets
- SHS ≥ 80; Drift ≤ 5; Policy ≥ 95; Proof ≥ 90; eROI ≥ 1.0
## 4. CI Jobs
- validate_ledger.mjs --expect v1.9 --strict
- validate_energy.mjs --min-erio 1.0 --feed artefacts/data/sbi/sbi_energy.csv
- proof_log_agg.mjs --min-coverage 0.9 --log artefacts/logs/proofs/proof_log.csv
## 5. Changelog
| Version | Date | Change | Author |
|---|---|---|---|
| v1.9 | 2025-10-17 | Created ledger v1.9 with Proof/Energy schema and CI gates | Stephan |
