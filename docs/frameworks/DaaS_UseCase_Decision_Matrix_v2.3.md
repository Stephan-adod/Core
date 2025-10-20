---
id: F-DAAS-DECISION-MATRIX
layer: meta
version: v2.3
owner: stephan-adod
status: active
path: docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md
goal: "Transparente Priorisierung von DaaS Use Cases (AI-First, governance-konform)"
---

# DaaS Use Case Decision Matrix (v2.3)

**Zweck:** Systematische Priorisierung von DaaS-Use-Cases anhand von Business-Impact, Datenreife, Governance-Risiko, AI-Leverage und Aufwand.  
**Scoring:** 1 (niedrig) … 5 (hoch). Pfeil (↓) = niedriger ist besser. **Composite Score = Impact + Readiness + AI + (6 - Risk) + (6 - Effort)**

## Kriterien
- **Business Impact (1–5):** erwarteter ROI/CLV-Hebel.
- **Data Readiness (1–5):** Datenverfügbarkeit/Qualität/Consent-Abdeckung.
- **Governance Risk (1–5 ↓):** Datenschutz/AI-Act-Risiko (niedriger ist besser).
- **AI Leverage (1–5):** Lern- & Automatisierungspotenzial.
- **Effort (1–5 ↓):** Implementierungsaufwand (niedriger ist besser).

## Matrix (v2.3 initial)
| Use Case | Impact | Readiness | Gov Risk ↓ | AI Leverage | Effort ↓ | **Composite** | Empfehlung |
|---|---:|---:|---:|---:|---:|---:|---|
| Pricing Optimization | 5 | 4 | 3 | 4 | 4 | **(5+4+4)+(3→3)+(2)=18** | High Potential (Iterative Start) |
| Marketing Attribution / MMM | 5 | 3 | 4 | 5 | 3 | **(5+3+5)+(2)+(3)=20** | Strategic, Complex |
| **Context Enrichment (Weather + Events)** | 4 | 5 | 2 | 4 | 2 | **(4+5+4)+(4)+(4)=21** | **Quick Win (Context API)** |
| Inventory Forecasting / Demand | 4 | 4 | 3 | 4 | 4 | **(4+4+4)+(3)+(2)=17** | Mid-Term |
| Identity / Consent Graph | 4 | 2 | 5 | 5 | 5 | **(4+2+5)+(1)+(1)=13** | Long-Term (Governance Asset) |

> **Hinweis zur Rechenlogik:** Für ↓-Kriterien wird **(6 − Wert)** addiert, damit niedrige Werte positiv wirken.  
> Beispiel: Gov Risk=2 → (6−2)=4; Effort=2 → (6−2)=4.

## Operator Notes
- Wenn **Gov Risk ≥ 4**, löse automatisch „Policy Design Review Prompt“ aus.
- Bei Composite ≥ 20 → Kandidat für v2.3/2.4 Roadmap.
- Context Enrichment dient als **gemeinsamer Verstärker** für Pricing & Attribution; als eigenständiger Stream (L3.3) implementieren.

