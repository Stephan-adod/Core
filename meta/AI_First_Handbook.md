---
layer: meta
version: v2.4.6
status: active
updated: 2025-10-21
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
