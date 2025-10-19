---
version: v2.1
phase: operational_refined
owner: Stephan
updated: 2025-10-19
linked_lessons: [L-001, L-002, L-003]
---

# AI-First Prompt Inventory · v2.1 Refined

Dieses Inventory listet nur aktive, minimal notwendige Prompts für den Reflexions-Loop.

## A. Governance & Reflection
| ID | Name | Zweck | Status |
|----|------|-------|--------|
| P-009 | Lesson Collector (refined) | Erzeugt Lesson-Snippets + Logeintrag, verlinkt Core-Docs | 🟢 active |

## B. Operator Prompts
| ID | Name | Zweck | Triggert | Status |
|----|------|-------|---------|--------|
| OP-001 | Weekly Reflection | Wöchentlicher Input → ruft P-009 zur Lesson-Erzeugung | P-009 | 🟢 active |
| OP-002 | Monthly Synthesis (Stub) | Aggregiert Lessons des Monats zu 3–5 Insights + TODOs | — | 🟡 ready |

## C. Hinweise
- Inline-Versionierung: Versionen stehen im YAML der Core-Docs (version: v2.1).
- Lessons-Referenzen: stabile Pfade (keine *_v2.x.md).
- CI: bestehende Validierungen (lessons + drift) bleiben unverändert.
