---
title: AI-First System Architecture
version: v2.1
status: active
updated: 2025-10-19
owner: Stephan (System Owner & Mentor)
rhythm: monthly review
outputs:
  - Architecture deltas (meta/arch_deltas/*.md)
  - Interfaces & layers map (meta/interfaces_v2.json)
boundaries:
  - No operational task tracking (moved to feature repos)
  - Archive is read-only context
linked_docs:
  - meta/AI_First_Roadmap_v2.1.md
  - meta/AI_First_Handbook_v2.1.md
  - meta/Human_in_the_Loop_Playbook_v2.1.md
  - docs/AI_First_Business_Case_v2.1.md
---

## Purpose
Defines layers, roles, and constraints of the v2.1 operating model (clarity-first).

## Layers
- **Meta:** Governance, principles, prompts
- **Ops:** Repeatable routines (sanity, reflection)
- **Artefacts:** Docs, logs, manifests
- **Integration:** Feature repos (SPW/RPE/etc.)

## Roles
- **Human (Stephan):** Intent, review, merge authority
- **AI:** Bounded execution via Mini-Prompts
- **System:** Traceability, manifests, sanity checks

## Interfaces
- Core docs ↔ Mini-Prompts ↔ Sanity CI
- Archive v1.9 as read-only reference

## Change Control
All structural changes go through a named Mini-Prompt + PR.
---
