---
version: v2.2
phase: adaptive_governance
owner: Stephan
updated: 2025-10-19
linked_lessons: [L-001, L-002, L-003, L-004]
---

# AI-First Prompt Inventory · v2.1 Refined

Dieses Inventory listet nur aktive, minimal notwendige Prompts für den Reflexions-Loop.

## A. Governance & Reflection
| ID | Name | Zweck | Status | Notes |
|----|------|-------|--------|-------|
| RS-001 | Review Synthesis (v2.2) | Aggregiert Lessons (L-001 – L-004) zu Meta-Learnings und erstellt S-001 | 🟢 active | |
| P-009 | Lesson Collector (refined) | Erzeugt Lesson-Snippets + Logeintrag, verlinkt Core-Docs | 🟢 active | L-004 integrated (Playbook · Learning Rhythm Governance) |
| P-010 | Governance KPI Collector (v2.2) | Erstellt Governance KPI Reports aus lessons_log & Synthesen (JSON/MD) | 🟢 active | |

## B. Operator Prompts
| ID | Name | Zweck | Triggert | Status | Status Note |
|----|------|-------|---------|--------|-------------|
| OP-001 | Weekly Reflection | Wöchentlicher Input → ruft P-009 zur Lesson-Erzeugung | P-009 | 🟢 active | Status: 🟢 active — completed run: 2025-W42 |
| OP-002 | Monthly Synthesis (Stub) | Aggregiert Lessons des Monats zu 3–5 Insights + TODOs | — | 🟡 ready | |

## C. Hinweise
- Inline-Versionierung: Versionen stehen im YAML der Core-Docs (version: v2.1).
- Lessons-Referenzen: stabile Pfade (keine *_v2.x.md).
- CI: bestehende Validierungen (lessons + drift) bleiben unverändert.
