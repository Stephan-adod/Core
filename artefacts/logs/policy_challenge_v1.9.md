# Policy Challenge Matrix · v1.9

## Evaluation Highlights (v1.8 ➜ v1.9)
- **Energy** — *relevance:* high alignment with Horizon energy goals; *clarity:* lacks explicit SBI/eROI sampling cadence; *measurability:* current eROI red in Ledger; *automation_guardrails:* needs automated SBI import with human review; *governance_rhythm:* weekly review missing; *harmony_impact:* affects Ledger freeze readiness.
- **Quality** — *relevance:* lessons emphasise Proof-of-Learning + Proof-of-Value pairing; *clarity:* rule "Each artefact meets DoD" ambiguous about proof linkage; *measurability:* Ledger lacks fields to confirm dual-proof attachments; *automation_guardrails:* risk of agents closing loops without proof audit; *governance_rhythm:* should sync with monthly freeze review; *harmony_impact:* incomplete proofs create Ledger drift.
- **Automation** — *relevance:* Handbook states "Human-in-the-Loop"; *clarity:* "No manual repetition > 2×" ignores exceptions; *measurability:* no metric in Ledger; *automation_guardrails:* lessons warn not all tasks fit automation; *governance_rhythm:* refine quarterly to reassess automation scope; *harmony_impact:* over-automation threatens harmony score if drift triggers.
- **Market Validation** — *relevance:* Horizon requires ≥1 Proof/Q; *clarity:* rule lacks pipeline stage definitions; *measurability:* Ledger tracks MVR but manual; *automation_guardrails:* risk of counting unreviewed proofs; *governance_rhythm:* needs quarterly sync; *harmony_impact:* misaligned proofs degrade strategy sync.
- **Profit per Hour** — *relevance:* Business Case ROI anchor; *clarity:* rule ok but lacks source of truth; *measurability:* Ledger auto input planned; *automation_guardrails:* ensure revenue scripts flagged; *governance_rhythm:* monthly financial review; *harmony_impact:* key freeze gate.
- **Harmony Check** — *relevance:* critical to keep meta layers aligned; *clarity:* YAML rule ok but Ledger status "planned" indicates gap; *measurability:* boolean but needs CI job; *automation_guardrails:* ensure manual override path; *governance_rhythm:* run on every PR; *harmony_impact:* direct.
- **Ledger Freeze Gate** — *relevance:* gating freeze decisions; *clarity:* composite rule lacks visibility into sub-metrics; *measurability:* Ledger manual updates; *automation_guardrails:* requires CI validation before gating; *governance_rhythm:* should trigger before Acceptance; *harmony_impact:* ensures stable releases.

## Challenge Matrix
| Policy | Issue (from Lessons/Docs) | Proposed Change (v1.9) | Impact | Owner | Priority |
| --- | --- | --- | --- | --- | --- |
| Energy | Ledger reports eROI = 0.15 (🔴) and Lessons request stronger Energy KPI audits.【F:artefacts/sync/System_Harmony_Ledger.md†L30-L79】【F:meta/AI_First_System_Architecture_v1.8.md†L84-L94】 | Expand rule to "SBT ≥ 1.0 **and** weekly SBI/eROI sync ≥ 1.0" with automated SBI import + manual exception log. | Restores energy-health gating; enables measurable automation path. | Governance Maintainer | High |
| Quality | Lessons demand Ledger entries include Proof-of-Learning & Proof-of-Value; current rule silent.【F:meta/AI_First_System_Architecture_v1.8.md†L97-L108】 | Amend DoD to require dual-proof attachment and Ledger linkage before marking artefacts complete. | Improves clarity, reduces proof drift, supports audit trail. | Governance Maintainer | High |
| Automation | Handbook warns not all tasks suit automation; rule "No manual repetition > 2×" conflicts.【F:meta/AI_First_Handbook_v1.8.md†L17-L74】 | Add exemption clause: "Automation after 2× repetition **unless** human-in-loop risk review flags" + quarterly automation review checklist. | Preserves guardrails, balances automation with human oversight. | Operator (Stephan) | Medium |
| Market Validation | Horizon & Business docs set ≥1 proof/Q but Ledger pipeline manual.【F:meta/Horizon_Map_v1.8.md†L34-L124】【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L31-L74】【F:artefacts/sync/System_Harmony_Ledger.md†L54-L94】 | Define validation stages (Discovery, Signal, Confirmed) and require quarterly Ledger automation script to tally validated proofs. | Aligns strategy/business cadence; improves measurability. | Operator (Stephan) | High |
| Profit per Hour | Business Case anchors profit≥10 €/h but Ledger source unspecified.【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L31-L74】【F:artefacts/sync/System_Harmony_Ledger.md†L54-L94】 | Link rule to revenue/time datasets (`revenue_report.csv`, `cost_time.csv`) and enforce monthly CI validation. | Strengthens financial governance and transparency. | Governance Maintainer | Medium |
| Harmony Check | Architecture policy active but Ledger marks status "planned", indicating enforcement gap.【F:meta/AI_First_System_Architecture_v1.8.md†L57-L75】【F:artefacts/sync/System_Harmony_Ledger.md†L80-L94】 | Promote policy to mandatory CI check (`validate_ledger --version-sync`) and document override protocol. | Eliminates version drift, sustains harmony score. | Governance Maintainer | Critical |
| Ledger Freeze Gate | Composite gate relies on manual Ledger updates; CI script still draft.【F:meta/AI_First_System_Architecture_v1.8.md†L57-L75】【F:artefacts/sync/System_Harmony_Ledger.md†L118-L189】 | Finalise CI validator with thresholds (SHS ≥ 80, Drift ≤ 5, KPI greens) and require pre-merge report attachment. | Automates freeze decisions, reduces manual error. | Governance Maintainer | Critical |

## Systemic Insights
1. Manual Ledger maintenance undermines multiple policies (Energy, Market Validation, Ledger Freeze Gate) and should be upgraded to semi-automated sync with clear human review checkpoints.
2. Proof governance gaps (dual-proof requirement, validation stages) connect directly to Harmony drift; policies must spell out proof data structures and validation cadence.
3. Automation incentives conflict with human-in-the-loop safeguards; policy language must embed decision gates rather than blanket automation targets.

## Recommended Policy Set for v1.9
- Adopt revised policy rules outlined above, including explicit data sources, cadences, and override procedures.
- Implement CI-based `validate_ledger` checks for Harmony Check and Ledger Freeze Gate, integrating SBI/eROI and proof validation scripts.
- Update Definitions of Done across Architecture/Handbook to require dual-proof logging and energy audit evidence prior to freeze.

## Next Steps (handover to AT-DOC-008)
1. Draft policy text updates in `meta/AI_First_System_Architecture_v1.9.md`, ensuring YAML block mirrors proposed changes.
2. Extend Ledger automation script backlog ticket with requirements for SBI import, proof-stage counters, and CI thresholds.
3. Schedule governance review workshop (Operator + Governance Maintainer) to ratify v1.9 policies and align Handbook guidance.
