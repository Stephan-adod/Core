---
title: AI-First Handbook
version: v2.0
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
  - meta/AI_First_System_Architecture_v2.0.md
  - meta/Human_in_the_Loop_Playbook_v2.0.md
  - meta/AI_First_Roadmap_v2.0.md
  - docs/AI_First_Business_Case_v2.0.md
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
