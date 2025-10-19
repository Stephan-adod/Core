---
title: AI-First Handbook
version: v2.1
status: active
updated: 2025-10-19
owner: Stephan
rhythm: quarterly
outputs:
  - Operating rules (handbook/*.md)
  - Prompt guidelines (handbook/prompts.md)
boundaries:
  - Keep below 150 lines per section
linked_docs:
  - meta/AI_First_System_Architecture_v2.1.md
  - meta/Human_in_the_Loop_Playbook_v2.1.md
  - meta/AI_First_Roadmap_v2.1.md
  - docs/AI_First_Business_Case_v2.1.md
---

## Operating Principles
- Clarity over coverage
- Intent before execution
- Bounded Mini-Prompts
- One PR = One intent

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
