# Trust Probe Report · v1.9 (GOV-005)
Date: 2025-10-17

**Overall Status:** 🔴 FAIL

## Summary
- ✅ System Harmony Score: 84.00 (≥ 80)
- ✅ Drift %: 5.00 (≤ 5)
- ✅ Policy Valid %: 100.00 (≥ 95)
- ❌ Proof Coverage %: 30.00 (≥ 90)
- ❌ Energy Index (eROI): 0.15 (≥ 1)

## Findings & Thresholds
- ❌ **validate_ledger** – Ledger version does not match expected v1.9
- ❌ **validate_proof** – Proof coverage below threshold or architecture proof requirements missing
- ❌ **validate_energy** – Energy index below target or policy linkage missing
- ✅ **validate_policy** – Policy validity meets governance expectations
- ❗ Proof Coverage % is below threshold (30.00 vs ≥ 90)
- ❗ Energy Index (eROI) is below threshold (0.15 vs ≥ 1)

## Next Governance Actions
1. Investigate failing metrics and update ledger data sources.
2. Align architecture v1.9 with ledger versioning before freeze.
3. Re-run Trust Probe after metrics meet thresholds.
