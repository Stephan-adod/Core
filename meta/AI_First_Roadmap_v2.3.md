---
id: AI-FIRST-ROADMAP-v2_3
layer: meta
phase: v2.3
status: active
owner: stephan-adod
version: v2.3.1
goal: "Roadmap für die DaaS Factory Planning Phase (Blueprint → Loops → Alignment → Synthesis)"
updated: 2025-10-20
links:
  blueprint: meta/AI_First_System_Architecture.md
  loops_spec: docs/prompts/P-011_loops_v2.3.mjs
  decision_matrix: docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md
  diagram: docs/diagrams/DaaS_L3_Context_Map_v2.3.mmd
  lessons_L011: docs/lessons/L-011_synthesis_v2.3.md
  lessons_L012: docs/lessons/L-012_collaboration_optimization_v2.3.md
  sanity_stub: docs/ops/sanity_v2_3_stub.md
  transition_log: docs/logs/transition_META_v2.2.5_to_v2.3.1.md
  weekly_brief: docs/reports/weekly_business_loop_v2.3.md
  reflection_summary: docs/reports/reflection_summary_v2.3.md
north_star: "TTIC ≤ 7 Tage @ Policy Valid ≥ 95 %"
kpis:
  - Policy Valid % ≥ 95
  - Sanity % ≥ 90
  - System Harmony Score > 0.9
  - Decision Latency ≤ 48h
  - Context Adoption Rate ≥ 0.9
---

# AI-First Roadmap · v2.3 (DaaS Factory Planning)

## 1) Scope & Intent
- **Ziel:** Governance, Data Value Streams und Business Loops zu einem lebenden DaaS-System verbinden.
- **Fokus-Streams:** Pricing, Attribution, **Context Enrichment (Weather + Events)**.

## 2) Phasen & Deliverables

### Phase 1 · Orientierung & Decision Lock ✅
- **Deliverables:** Decision Reflection Note, Intent (im Blueprint integriert)
- **Output:** *Intent-Lock erreicht* (Design-before-Automate)

### Phase 2 · Blueprint Design ✅
- **Deliverables:** Blueprint v2.3.1 (Master), Mermaid-Map, Decision Matrix
- **Output:** *Architektur-Commit*, Context-Stream definiert

### Phase 3 · Loop Integration ✅
- **Deliverables:** Loop Spec `P-011_loops_v2.3.mjs` (refined), Loop Runbook
- **Output:** *Funktionsfähiges Loop-Modell (declarative spec)*

### Phase 4 · Meta & Governance Alignment 🟡 (laufend)
- **Deliverables:** **diese Roadmap v2.3**, Playbook-Hinweise (aus Lessons ableiten)
- **Output (Ziel):** *Meta Loop geschlossen* (Architecture ↔ Governance Sync)

### Phase 5 · Synthesis & Transition ⏳
- **Deliverables:** L-011 Update, Reflection Summary, Freeze-Candidate Check
- **Output (Ziel):** *CI-Green Candidate* + „Week 1“ echter Feedback-Cycle

## 3) Meilensteine (Targets)
| # | Meilenstein | Artefakt | Zieltermin | Status |
|---|-------------|----------|-----------:|:------:|
| M1 | Blueprint promoted to Master | `meta/AI_First_System_Architecture.md` | 2025-10-20 | ✅ |
| M2 | Loops refined & linked | `docs/prompts/P-011_loops_v2.3.mjs` | 2025-10-20 | ✅ |
| M3 | Roadmap v2.3 veröffentlicht | `meta/AI_First_Roadmap_v2.3.md` | 2025-10-20 | ✅ |
| M4 | **Loop Week 0** (Dry-Run) | `docs/reports/weekly_business_loop_v2.3.md` | +3d | ✅ |
| M5 | Reflection Summary erzeugt | `docs/reports/reflection_summary_v2.3.md` | +5d | ✅ |
| M6 | L-011 Lessons Update | `docs/lessons/L-011_synthesis_v2.3.md` | +6d | ⬜ |
| M7 | Freeze Candidate Check | transition log + sanity | +7d | ⬜ |

## 4) Operating Cadence
- **Governance:** kontinuierlich (min 24h) — Probes: Policy Valid, Sanity, Model Card, Context-Age.
- **Business:** wöchentlich Mo 09:00 — KPIs: mROI, Pricing Uplift, **Context Adoption**.
- **Reflexion:** zweiwöchentlich Fr 15:00 — Outputs: L-011 Update, **Reflection Summary**.

## 5) Risiken & Gegenmaßnahmen
- **Sanity Script fehlt noch:** Stub aktiv; echtes Script nach Freeze implementieren.
- **Externe Validierung (Attribution):** Partner-Feedback im Business-Loop einplanen.
- **Daten-Drift (Context):** Trust Probe „context_version age < 7d“ enforced.

## 6) Change Log (v2.3)
- 2025-10-20: Roadmap v2.3 erstellt; Links auf Blueprint, Loops, Matrix, Lessons, Reports.
- 2025-10-20: KPI-Set geklärt (Context Adoption aufgenommen).
- 2025-10-20: Lessons zentralisiert → aktive Lessons unter `docs/lessons/`, Legacy unter `artefacts/lessons/` (read-only).
- 2025-10-20: Week 0 Dry-Run dokumentiert (Business & Reflection Reports); Freeze-Check Datei erstellt.

> ℹ️ **Governance Note:** Strukturelle Änderungen nur via **Mini-Prompt + PR**; dokumentiert im Transition-Log.
