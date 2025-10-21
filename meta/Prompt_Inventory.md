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

# AI-First Prompt Inventory · v2.4.6

Dieses Inventory listet nur aktive, minimal notwendige Prompts für den Reflexions- und Governance-Loop.

## A. Governance & Reflection
| ID | Name | Zweck | Status | Notes |
|----|------|-------|--------|-------|
| RS-001 | Review Synthesis (v2.2) | Aggregiert Lessons (L-001 – L-004) zu Meta-Learnings und erstellt S-001 | 🟢 active | |
| S-002 | Adaptive Governance Meta-Synthesis (v2.3 Readiness) | Konsolidiert Lessons L-001–L-005 und bereitet v2.3 Strategic Factory Planning vor | 🟢 active | |
| P-009 | Lesson Collector (refined) | Erzeugt Lesson-Snippets + Logeintrag, verlinkt Core-Docs | 🟢 active | L-004 integrated (Playbook · Learning Rhythm Governance) |
| P-010 | Governance KPI Collector (v2.2) | Erstellt Governance KPI Reports aus lessons_log & Synthesen (JSON/MD) | 🟢 active | |
| P-011 | Loop Integration (v2.3.1 refined) | Orchestriert Governance-, Business- und Reflection-Loops gemäß `docs/prompts/P-011_loops_v2.3.mjs` | 🟢 active | Synchronisiert Trigger mit `docs/ops/loop_runbook_v2.4.md` |
| P-012 | Forecast Drift Detection (v2.4-a) | Bewertet Forecast-Modelle auf Drift und erzeugt Findings/JSON-Reports | 🟢 active | Spezifikation: `docs/prompts/P-012_forecast_drift_v2.4.mjs` |
| P-013 | Canonical Meta Sync (v2.4.6) | Harmonisiert Meta-Dokumentversionen, aktualisiert Statusfelder und schreibt Transition-Logs | 🟢 active | Nutzt `docs/logs/transition_meta_canonical_upgrade_v2.4.6.md` als Referenz |

## B. Operator Prompts
| ID | Name | Zweck | Triggert | Status | Status Note |
|----|------|-------|---------|--------|-------------|
| OP-001 | Weekly Reflection | Wöchentlicher Input → ruft P-009 zur Lesson-Erzeugung | P-009 | 🟢 active | Status: 🟢 active — completed run: 2025-W42 |
| OP-002 | Monthly Synthesis (Stub) | Aggregiert Lessons des Monats zu 3–5 Insights + TODOs | — | 🟡 ready | |

## C. Hinweise
- Inline-Versionierung: Versionen stehen im YAML der Core-Docs (version: v2.4.6).
- Lessons-Referenzen: stabile Pfade (keine *_v2.x.md).
- CI: bestehende Validierungen (lessons + drift) bleiben unverändert.
