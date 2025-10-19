---
id: architecture-v1.9
layer: meta
owner: Governance Maintainer
status: draft
version: v1.9
governance: draft v1.9
linked_meta:
  - path: archive/v1.9/meta/Horizon_Map_v1.8.md
    version: v1.8
  - path: archive/v1.9/docs/BUSINESS_CASE_Horizon_v1.8.md
    version: v1.8
  - path: archive/v1.9/artefacts/sync/System_Harmony_Ledger.md
    version: v1.8
archived: true
archive_base: archive/v1.9/
---

# AI-First System Architecture v1.9

## 1. Overview & Context
Die Architektur v1.8 verbindet Horizon-Strategie und Business-Case, indem sie Automations- und Governance-Bausteine als gemeinsame Referenz implementiert. Sie stellt sicher, dass jede Kernschicht (Strategie, Business, Operative Systeme) auf demselben Policy-Set basiert, wodurch der Ledger automatisiert Harmonie- und Driftwerte messen kann.

## 2. Core Principles (AI-First Architecture Values)
- **Energy** – Architektur schützt fokussierte Deep-Work-Zeit und koppelt Energie-KPIs in allen Loops.
- **Quality** – Jede Artefaktlinie besitzt DoR/DoD-Definitionen und wird vor Freeze auditiert.
- **Automation** – Wiederholende Aufgaben werden durch Skripte oder Agenten ersetzt; manuelle Schritte dienen nur als Gate.
- **Harmony** – Version Sync erfolgt kontinuierlich zwischen Horizon, Business Case und Architektur über den Ledger.
- **Learning** – Feedback-Loops aggregieren Proofs und speisen Verbesserungen in Policies sowie Playbooks zurück.

## Policies
- **Energy**: Energy Index ist offizieller KPI. Wöchentlicher SBI/eROI-Sync mit Operator-Review. Kennzahlen fließen als Pflichtfelder in den Ledger ein.
- **Quality**: Definitions of Done verlangen Dual-Proof (Learning & Value) je Artefakt; beide Nachweise sind vor Abschluss im Ledger zu verlinken.
- **Automation**: Max-Automationsquote 70 %. Human-Override-Gate aktiv. Vierteljährlicher Scope-Review mit Checkliste.
- **Market Validation**: Stages = Discovery, Signal, Confirmed. Pro Quartal mindestens ein bestätigter Proof. Zählung und Report per Script.
- **Profit per Hour**: Regel bindet `revenue_report.csv` und `cost_time.csv` als Datenquellen. Monatliche CI-Validierung.
- **Harmony Check**: `validate_ledger --version-sync` ist verpflichtendes CI-Gate. Bei Versions-Mismatch oder Drift < 5 wird automatisch ein Ticket erzeugt.
- **Ledger Freeze Gate**: Freeze nur bei SHS ≥ 80, Drift ≤ 5 und grünen KPIs. Pre-Merge-Report ist Pflicht.

## Proof
**Ziel:** Evidenz ist eindeutig typisiert und auditierbar.
- Feld `proof_type`: `learning` oder `value` (Pflicht).
- Reports verlinken beide Proof-Arten. 
- Validatoren prüfen auf Vorhandensein beider Nachweise und korrekter Verlinkung in den Ledger.

## 5. 90-Day Action Plan
| Phase | Fokus | Kern-KPIs | Deliverables |
| --- | --- | --- | --- |
| Discovery (Tage 1–30) | Architekturanforderungen finalisieren | Learning Velocity ≥ 2 | Abgeleitete Rebrief-Notizen + Policy-Mapping |
| Validation (Tage 31–60) | Automationsprototypen live testen | Automation Coverage ≥ 60 % | Ledger-Sync-Skripte + Proof Logs |
| Stabilization (Tage 61–90) | Governance und CI festigen | System Harmony Score ≥ 80 | Freeze-Kandidaten + Audit-Report |

## 6. System Harmony Section
Der Ledger verbindet Horizon v1.8, Business Case v1.8 und die Architektur v1.8 durch gemeinsame Versionseinträge und Policy-IDs. Harmony-Signale werden via `System_Harmony_Ledger.md` synchronisiert; sobald Version Sync, Policy Valid % und System Harmony Score grün melden, gilt das System als freeze-ready.

## 7. Metrics & Validation Table
| Metric | Target | Source | Status |
| --- | --- | --- | --- |
| System Harmony Score | ≥ 80 | Ledger | ⚪ |
| Policy Valid % | ≥ 95 | Ledger | ⚪ |
| Profit per Hour (€) | ≥ 10 | Business Case | ⚪ |
| Proofs Validated / Quarter | ≥ 1 | Proof Log | ⚪ |
| Drift % | ≤ 5 | CI Diagnostics | ⚪ |

## 8. Role & Responsibility Alignment
| Layer | Role | Tool | Scope | Output |
| --- | --- | --- | --- | --- |
| Systemic | ChatGPT (GPT-5) | Rebrief, Refinement, Risk Map | Prompts |  |
| Operator | Codex App | Execution, Artefact Creation | Diffs, Reports |  |
| Human | Governance Maintainer | Review, Approval | Lessons, Merges |  |
| Compliance | CI Validator | Validation, Exit Codes | Reports |  |
| Meta-Sync | ChatGPT + Scripts | Freeze, Drift Management | Trust Probes |  |

## DoR / DoD
**Ready:** Ziele, Datenquellen und Proof-Schema klar; CI-Gates referenziert.
**Done:** Dual-Proof verlinkt; Energy-Audit eingetragen; Harmony-Check und Freeze-Report grün.

## Changelog
| Version | Date | Change | Author |
|---|---|---|---|
| v1.9 | 2025-10-17 | Draft created from v1.8; policies refined (Energy, Quality, Automation, Harmony, Freeze, Market Validation, Profit/h) | Stephan |

## Lessons & Appendix
### Lessons Learned (v1.8 Cycle)
1. Policy-Sync: Automatisierte Drift-Checks erhöhen Qualität, erfordern aber manuelle Rebrief-Phasen zur Kontextprüfung.
2. Proof-Mechanik: Ledger-Einträge sollten konsistent „Proof of Learning“ und „Proof of Value“ enthalten.
3. Automation Scope: Nicht alle Aufgaben eignen sich für Codex-Automatisierung – Human-in-the-Loop bleibt zentral.
4. Harmony Loop: Versionsgleichheit ist entscheidend für Vertrauen; Ledger-Score als Freeze-Gate bewährt.
5. Energy KPI: Fokussierte Deep-Work-Zeit muss als Audit-Metrik stärker berücksichtigt werden.
### Appendix
- Linked Proof Logs: artefacts/logs/proof_cycle_v1.8.md
- CI Reports: artefacts/logs/freeze_validator_v1.8.md
- Ledger KPIs: SHS ≥ 80 · Drift ≤ 5 · Policy Valid ≥ 95 %
**Evolution v1.9:** Lessons aus v1.8 übertragen und für laufende Iteration markiert. Review-Zyklus aktiv.
# Governance Integration (v1.9.1)
- Linked Meta: [System Harmony Ledger v1.9.1](../artefacts/sync/System_Harmony_Ledger_v1.9.1.md)
- Linked Handbook: [AI_First_Handbook_v1.9.1](AI_First_Handbook_v1.9.1.md)
- CI Validators: `validate_energy.mjs`, `run_trust_probe_v1_9_1.mjs`
