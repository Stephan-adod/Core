---
id: backlog-dashboard-v1.1
layer: operational
owner: Governance Maintainer
status: active
version: v1.1
governance: freeze v1.8
linked_meta:
  - artefacts/logs/backlog_matrix_v1.0.md
  - artefacts/logs/backlog_matrix_v1.1.md
  - artefacts/logs/roadmap_v1.0.md
  - artefacts/logs/meta/diagnose_backlog_v1.0.json
  - artefacts/sync/System_Harmony_Ledger.md
---

# 📊 Backlog Dashboard · v1.1 (AI-First Operational View)

## 1️⃣ System Overview

| Kategorie | Wert | Quelle |
|---|---|---|
| **Backlog Health (avg)** | 8.88 / 10 🟢 | diagnose_backlog_v1.0.json |
| **Impact-Score (avg)** | 8.6 | backlog_matrix_v1.0.md |
| **Trust-Score (avg)** | 8.6 | backlog_matrix_v1.0.md |
| **Effort-Load (avg)** | 5.4 | backlog_matrix_v1.0.md |
| **Governance Loop Stabilisierung** | AT-028 · backlog · 🔴 hoch | backlog_matrix_v1.1.md |

## 2️⃣ Prioritäten-Matrix (Top 5 + Governance Fokus)
| Ticket | Layer | Category | Priority | Status |
|---|---|---|---:|---|
| AT-016 | Meta | Proof Mechanism | 9.3 | running |
| DOC-001 | Meta | Docs & Badges | 9.0 | backlog |
| AT-017 | Product | Action Plan Automation | 8.9 | running |
| GOV-003 | Meta | Archive Policy | 8.6 | planned |
| OPS-001 | Foundation | Probe Parameterization | 8.6 | backlog |
| AT-028 | Meta | Governance Loop Stabilisierung & CI Konsolidierung | — | backlog |

## 3️⃣ Cycle Overview (Roadmap)
| Cycle | Zeitraum | Fokus | Ziele | Tickets | Status |
|---|---|---|---|---|---|
| C1 | Okt–Nov 2025 | Proof & Action Plan | Proof-Mechanik messbar, KPIs im CI | AT-016, AT-017 | running |
| C2 | Dez 2025–Jan 2026 | Governance & Archive Konsolidierung | Archiv-Policy, Lessons-Automation, CI-Layer-Reduktion | GOV-003, OPS-001, AT-028 | planned |
| C3 | Feb–Mär 2026 | Docs & Meta Upgrade | Badges, Roadmap 2.0, v1.9 Prep | DOC-001 | backlog |

## 🔄 Sync Status
- AT-028 eingespielt; Dashboard via backlog_matrix_v1.1.md automatisch synchronisiert.
- Deep Diagnose (#30) als legacy markiert, Governance Freeze v1.9 vorbereitet.

## 4️⃣ Visual Snapshot
```mermaid
pie title Backlog Distribution
  "running" : 2
  "planned" : 1
  "backlog" : 2
```

*Auto-rendered: 2025-10-16T09:45:47.568Z*
