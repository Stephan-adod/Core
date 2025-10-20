# Core · AI-First Governance Repository

## 🧭 Current Phase
- **Version:** v2.2.5 — DaaS Factory Transition  
- **Target:** v2.3 — DaaS Factory Planning (P-011)  
- **Governance Health:** 🟢 Stable  
- **Last Sanity:** see `scripts/sanity_v22_check.mjs` (run locally)  
- **Snapshot:** `meta/snapshots/system_state_v2.2.5.json`

## 🧱 Core Docs
| Area        | File                                   | Purpose                           |
|-------------|----------------------------------------|-----------------------------------|
| Business    | `docs/AI_First_Business_Case.md`       | Strategic Direction               |
| Architecture| `meta/AI_First_System_Architecture.md` | System & Data Blueprint           |
| Playbook    | `meta/Human_in_the_Loop_Playbook.md`   | Operational Guidance              |
| Governance  | `meta/Prompt_Inventory.md`             | Active Prompts & Cycles           |
| Roadmap     | `meta/AI_First_Roadmap.md`             | Phasen, Milestones                |

## 🧩 Learnings & Syntheses
- **Lessons:** L-001 … L-006 (siehe `artefacts/lessons/lesson_snippets/`)  
- **Syntheses:** S-001 (RS-001), S-002 (Adaptive Governance Meta-Synthesis)

## 📊 Governance KPIs
- Report: `artefacts/reports/governance_kpis.md`  
- Kernmetriken: Total Lessons, Integration Rate, Velocity, Coverage, Reflection Depth

## 🛠 Operator & Validation
- **Sanity (Quick Rebase v2.2):** `node scripts/sanity_v22_check.mjs`  
- **Lessons Validation:** `npm run validate:lessons`  
- **Version Drift:** `npm run validate:drift`

## 🚀 Next Step
- **P-011 — DaaS Factory Planning:** Definiere Data Product Types, Data Value Flow, Data KPIs.  
- Optional: OP-010-a (weekly governance pulse automation).
