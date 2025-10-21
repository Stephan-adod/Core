---
id: AI_First_Handbook
layer: meta
version: v2.4.7
policy_level: 1
owner: stephan-adod
policy_source_anchor: meta/system_version.json
status: active
updated: 2025-10-24
owner: stephan-adod
linked_docs:
  - meta/AI_First_Roadmap.md
  - meta/Human_in_the_Loop_Playbook.md
  - meta/AI_First_System_Architecture.md
  - docs/AI_First_Business_Case.md
---

# AI-First Handbook

## Operating Principles
- Clarity over coverage
- Intent before execution
- Bounded Mini-Prompts
- One PR = One intent

> Governance Loops: Align principles with `docs/prompts/P-011_loops_v2.3.mjs`, `docs/ops/loop_runbook_v2.4.md`, and transition logs to keep loop triggers, prompts, and reviews in sync.

## Minimal CI
- Only `sanity.yml` during bootstrap
- Additional checks require explicit roadmap gate

## Prompt Quality
- Single purpose
- Reversible
- Logged (artefacts/logs/**)
---

## Archiving Policy (v2.1 seed)
- Each Core-Doc can be archived when a new major version is created.
- Archive creation is automated through Mini-Prompt `Archive Transition`.
- The Human confirms expiry condition via Roadmap Decision Gate (DG-4).
- Archived files live under `archive/<version>_bootstrap/` or `archive/<version>/`.

## Loop Integration Policy (v2.4)
Each loop binds to exactly one mechanism:
- Strategy → triggers Context Pack rebuild (manual in Safe Mode)
- Execution → ChangeSpec/PR Synthesizer (disabled in Safe Mode)
- Feedback → Drift Sentry reports (disabled in Safe Mode)
- Governance → Handbook as policy source (anchored in meta/system_version.json)

## Context Inclusion Rules
- Always include: `meta/AI_First_Handbook.md`, `meta/system_version.json`
- Include only docs/scripts/workflows with `status: active` (if present)
- Exclude archived/frozen folders (`archive/**`, `snapshots/**`)
- Context budget (Safe Mode): ≤ 200 files or ≤ 2 MB total (report if exceeded)

## Human Override Protocol
Operator actions are required when:
1) Context Pack validation fails or exceeds budget
2) Policy drift suspected (Handbook changed without version note)
3) A PR violates: One PR = One Intent, Logged, Bounded Mini-Prompt
→ Update Handbook first, then re-run validation.

## Versioning Contract
- Textual clarifications (no rule change) → Patch (vX.Y.Z)
- Rule changes affecting validators/templates → Minor (vX.(Y+1).0)
- Breaking policy (new mandatory sections) → Major ((X+1).0.0)
