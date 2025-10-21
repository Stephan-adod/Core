---
id: transition-version-sync-v2_4_7
layer: meta
status: done
owner: stephan-adod
version: v2.4.7
date: 2025-10-24
---

# Transition · Canonical Version Sync (v2.4.7)

**Aligned**
- `meta/system_version.json` → target_version + active v2.4.7 (updated 2025-10-24)
- `docs/AI_First_Business_Case.md` → v2.4.7 (updated 2025-10-24)
- `meta/AI_First_Handbook.md` → v2.4.7 (updated 2025-10-24)
- `meta/Prompt_Inventory.md` → v2.4.7 (updated 2025-10-24)

**Tightened Drift Scope**
- `scripts/check_version_drift.mjs` schließt `artefacts/**`, `docs/archive/**`, `meta/snapshots/**` explizit aus.

**Outcome**
- Canonical Ziel- & aktive Version entsprechen Validator-Baseline v2.4.7.
- Drift-Watch konzentriert sich auf aktive Flächen; Archive & Snapshots sind ausgenommen.
