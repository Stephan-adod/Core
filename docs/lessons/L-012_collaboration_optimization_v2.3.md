---
id: L-012
layer: meta
status: active
owner: stephan-adod
version: v2.4.7
updated: 2025-10-24
goal: "Optimierung der Human ↔ AI ↔ System Zusammenarbeit vor Loop-Integration (Phase 3)"
links:
  blueprint: meta/AI_First_System_Architecture.md
  decision_matrix: docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md
  context_map: docs/diagrams/DaaS_L3_Context_Map_v2.3.mmd
  transition_log: docs/logs/transition_META_v2.2.5_to_v2.3.1.md
  sanity_stub: docs/ops/sanity_v2_3_stub.md
  reflection: docs/notes/P-011_decision_reflection_v2.3.md
---

# L-012 · Collaboration Optimization (v2.3)

## 1) Kontext & Ziel
- Stand: Blueprint v2.3.1 ist Master; Phase 3 (Loops) steht an.
- Ziel: Zusammenarbeit so kalibrieren, dass **Reflexions-, Governance- und Business-Loops** ab T+0 effektiv laufen (TTIC ≤ 7 Tage).

## 2) Key Insights (aus Phasen 1–2)
1. *Design before Automate* hat Drift reduziert; kurze Review-Stopps sind wertvoll.
2. Whitelist-Disziplin (`meta/`, `docs/`) hält CI stabil; Diagramme textbasiert (Mermaid) sind ideal.
3. Decision Matrix vor Loop-Design verbessert Fokussierung (Context API als Quick Win).
4. „Governance as Code“ statt reiner Doku (Transition-Logs, CSV-Quoting, Version-Alignment).
5. Kleine, gezielte Codex-Patches verbessern Vertrauen und Tempo (Review-Bots nutzen).

## 3) Working Agreements (operationale Regeln)
- **WA-1 Cadence:** Zwei feste Takte/Woche: *Design Review* (max 30′) & *Ops Review* (max 20′).
- **WA-2 PR-Disziplin:** Jede strukturelle Änderung via **Mini-Prompt + PR**; Transition-Log referenzieren.
- **WA-3 Prompting:**  
  - *Blueprint/Docs:* deterministische Codex-Prompts, single-scope.  
  - *Entscheidungen:* kurze Review-Fragen + Stephan-Style SWOT/2nd/3rd Order.  
- **WA-4 Evidence:** CSV/MD Artefakte bevorzugen; Diagramme als *.mmd*; PNG nur nachgelagert.
- **WA-5 Compliance:** DSGVO/AI-Act als Purpose-Dimension immer explizit bewerten.

## 4) Metriken (Collab KPIs)
- **Decision Latency (DL):** Zeit von Frage → PR-Merge (Ziel: ≤ 48h).
- **Prompt Rework Rate:** Re-Prompt/PR-Änderungen pro Task (Ziel: < 1.5).
- **Review Hit Rate:** % der Reviews ohne Folgefehler (Ziel: ≥ 85%).
- **Loop Readiness Score:** Checklist-Erfüllung vor Phase 3 (Ziel: 100%).

## 5) Experimente (AI-native)
- **EXP-01 Prompt Library:** wiederverwendbare Prompt-Snippets (CSV quoting, version align, matrix update).
- **EXP-02 Auto-Checks:** leichter Parser für CSV-Kommas & Version-Drift (Docs-Report).
- **EXP-03 Feedback-Tags:** kurzer Tag im PR-Body (🟢/🟡/🔴) für Blocker-Transparenz.

## 6) Risiken & Gegenmaßnahmen
- **Over-Process:** Mini-Regeln auf 1-Pager begrenzen → diese Seite.
- **Tool Drift:** Nur Codex + GitHub PRs als „source of truth“.
- **External Validity:** Frühe Partner-Signals in Phase-3-Loops einplanen.

## 7) Next Steps (verbindlich)
1. Start **Phase 3**: `artefacts/prompts/P-011_loops_v2.3.mjs` erstellen.  
2. EXP-01 starten (Prompt Library seed).  
3. Review der Collab KPIs nach 2 Wochen (Mini-Retrospektive, 20′).

> 📝 Dieses Dokument ist ein *lebender 1-Pager*. Änderungen nur über Mini-Prompt + PR und Verweis im Transition-Log.
