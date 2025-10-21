# Meta Inventory Screening · v2.4

## Scope
- Directories scanned: `meta/`, `docs/`
- Focus artefacts: `meta/CORE_INDEX.md`, `meta/AI_First_Roadmap.md`, `meta/AI_First_System_Architecture.md`, `meta/Human_in_the_Loop_Playbook.md`
- Validation targets: front matter completeness (title, version, status, updated, layer, owner) & canonical link stability (no `v2.3` references)

## Inventory Summary

| path | version | status | updated | health |
| --- | --- | --- | --- | --- |
| `meta/CORE_INDEX.md` | v2.4.6 | active | 2025-10-21 | 🔴 mismatch (missing `layer`/`owner`, contains `v2.3` link) |
| `meta/AI_First_Roadmap.md` | v2.4.6 | active | 2025-10-21 | 🔴 mismatch (missing `layer`, contains `v2.3` link) |
| `meta/AI_First_System_Architecture.md` | v2.4.6 | active | 2025-10-24 | 🔴 mismatch (`v2.3` diagram reference) |
| `meta/Human_in_the_Loop_Playbook.md` | v2.4.6 | active | 2025-10-21 | 🔴 mismatch (missing `layer`/`owner`, contains `v2.3` link) |

## Findings

### `meta/CORE_INDEX.md`
- Front matter lacks the required `layer` and `owner` fields.
- Canonical section points to `docs/archive/weekly_v2.3/`, violating the `v2.4.6` stability requirement.

### `meta/AI_First_Roadmap.md`
- Front matter is missing a `layer` field to place the roadmap in the architecture stack.
- Canonical links still reference `docs/archive/weekly_v2.3/`.

### `meta/AI_First_System_Architecture.md`
- Front matter is complete, but the canonical blueprint references `docs/diagrams/DaaS_L3_Context_Map_v2.3.mmd` (legacy version).

### `meta/Human_in_the_Loop_Playbook.md`
- Front matter is missing both `layer` and `owner` fields.
- Canonical references still rely on `docs/archive/weekly_v2.3/`.

## Top Fixes
- `meta/CORE_INDEX.md` — Set layer → meta
- `meta/CORE_INDEX.md` — Set owner → Stephan (System Owner & Mentor)
- `meta/CORE_INDEX.md` — Replace unstable link → docs/archive/weekly_v2.4/
- `meta/AI_First_Roadmap.md` — Set layer → strategy
- `meta/AI_First_Roadmap.md` — Replace unstable link → docs/archive/weekly_v2.4/
- `meta/AI_First_System_Architecture.md` — Replace unstable link → docs/diagrams/DaaS_L3_Context_Map_v2.4.mmd
- `meta/Human_in_the_Loop_Playbook.md` — Set layer → operations
- `meta/Human_in_the_Loop_Playbook.md` — Set owner → assign accountable operator
- `meta/Human_in_the_Loop_Playbook.md` — Replace unstable link → docs/archive/weekly_v2.4/
