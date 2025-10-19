---
title: Prompt Inventory Sheet
version: v2.0
updated: 2025-10-20
status: active
phase: bootstrap
linked_docs:
  - meta/AI_First_System_Architecture_v2.0.md
  - meta/AI_First_Roadmap_v2.0.md
  - meta/AI_First_Handbook_v2.0.md
  - meta/Human_in_the_Loop_Playbook_v2.0.md
  - docs/AI_First_Business_Case_v2.0.md
purpose: >
  Overview of all bounded Mini-Prompts that form the operational layer of the AI-First system.
  Each prompt defines a single, reversible action bridging Human intent and system execution.
  During the bootstrap phase, all prompts remain manual and reviewed by the Human-in-the-Loop.
---

# 🧩 1️⃣ Prompt Matrix Overview

| ID | Category | Prompt Name | Purpose | Trigger | Output | Status | Successor |
|----|-----------|--------------|----------|----------|---------|----------|------------|
| P-001 | Archive | **Archive v1.9 Prompt** | Freezes historical repo; preserves context. | Manual (Bootstrap v2.0) | archive/v1.9/** snapshot | ✅ done | none |
| P-002 | Archive | **Linked Meta Fix** | Rewrites `linked_meta` paths to archive/v1.9 | Manual | Clean meta links | ✅ done | optional Archive Link Sanity |
| P-003 | CI Governance | **Mode-Gate Patch** | Adds v2 detection & ignores archive/** | Manual once | Clean CI separation v1/v2 | ✅ done | none |
| P-004 | Repo Structure | **Prune to v2.0 Skeleton** | Removes legacy files, creates Core-Docs | Manual | v2.0 skeleton ready | ✅ done | Simplification PR |
| P-005 | Repo Structure | **Simplification PR** | Final cleanup (tickets, workflows, package.json) | Manual | v2.0 lightweight repo | ✅ done | none |
| P-006 | Core Docs | **Seed Content Prompt** | Populates 5 Core-Docs with base content | After Simplification | Purpose, Owner, Rhythm in each file | 🔜 planned | none |
| P-007 | Governance | **Prompt Inventory Generator** | Builds & updates this sheet | Manual / Scheduled | Updated Inventory file | ✅ this doc | none |
| P-008 | Reflection | **Lesson Collector Prompt** | Consolidates Lessons → Playbook | After any PR merge | lessons/lessons_log.md | 🔜 planned | none |
| P-009 | Diagnostics | **Archive Link Sanity Check** | Verifies that all archive links resolve | Optional | CI Report | 🔜 optional | none |
| P-010 | Energy | **eROI Monitor Prompt** | Calculates effort↔impact ratio | Manual or weekly | eROI_log.csv | 🕓 future | none |

---

# ⚙️ 2️⃣ Activation Map

| Phase | Active Prompts | Governance Gate |
|-------|----------------|-----------------|
| **Bootstrap (now)** | P-001 → P-005 | `intent_state: draft` |
| **Initialization (Seed)** | P-006 → P-008 | `intent_state: confirmed` |
| **Operational Deepening** | P-009 → P-010 | `intent_state: active` |

---

# 🔄 3️⃣ Prompt Lifecycle

```mermaid
flowchart TD
    A[Human defines intent] --> B[Mini-Prompt triggered]
    B --> C[Codex executes bounded action]
    C --> D[AI logs manifest + summary]
    D --> E[Human reviews output]
    E --> F[Lesson Collector updates Playbook]
    F --> G[Prompt Inventory updated]
    G --> A
