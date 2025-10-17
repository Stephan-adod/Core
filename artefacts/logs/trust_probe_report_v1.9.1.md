# Trust Probe Report · v1.9.1 (GOV-006)
Date: 2025-10-17

**Overall Status:** 🔴 FAIL

## Summary
- ❌ System Harmony Score: 84.00 (≥ 85)
- ✅ Drift %: 5.00 (≤ 5)
- ✅ Policy Valid %: 100.00 (≥ 95)
- ✅ Proof Coverage %: 100.00 (≥ 95)
- ✅ Energy Index (eROI): 1.20 (≥ 1.1)

## Findings & Thresholds
- ✅ **validate_ledger** – Ledger version matches v1.9.1
- ✅ **validate_proof** – Proof coverage meets threshold
- ✅ **validate_energy** – Energy index within target
- ✅ **validate_policy** – Policy validity meets governance expectations
- ❗ System Harmony Score is below threshold (84.00 vs ≥ 85)

## Next Governance Actions
1. Investigate failing metrics and update ledger data sources.
2. Align architecture v1.9 handbook references with ledger v1.9.1 before freeze.
3. Re-run Trust Probe v1.9.1 after metrics meet thresholds.
