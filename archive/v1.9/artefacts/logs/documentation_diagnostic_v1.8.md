# Documentation Diagnostic v1.8

## Missing sections
- **meta/AI_First_System_Architecture_v1.8.md**: Pflichtabschnitt „Lessons / Appendix“ fehlt, obwohl alle anderen Kernrubriken vorhanden sind.【F:meta/AI_First_System_Architecture_v1.8.md†L19-L101】
- **meta/Horizon_Map_v1.8.md**: Geforderte Struktur (Overview, Policies, Proof, DoR/DoD, Changelog) nicht umgesetzt; Dokument nutzt nur strategische Themenblöcke ohne Governance-Abschnitte.【F:meta/Horizon_Map_v1.8.md†L25-L126】
- **docs/BUSINESS_CASE_Horizon_v1.8.md**: DoR/DoD, Proof-/Lessons-Sektion sowie Changelog fehlen; außerdem enthält das Frontmatter keine vollständigen `linked_meta`-Einträge (ohne `path`/`version`-Paare).【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L1-L69】
- **meta/AI_First_Handbook_v1.8.md**: YAML-Frontmatter komplett fehlend; kein expliziter Proof-/DoR/DoD-/Changelog-Bereich, obwohl Appendix vorhanden ist.【F:meta/AI_First_Handbook_v1.8.md†L1-L112】

## Drift (Version, Policy)
- **Bidirektionale Verlinkung**: Business Case verlinkt veraltete Architektur-Versionen (`AI_First_System_Architecture_v1_1.md`, `..._draft.md`) und liefert keine Versionsangaben, wodurch der Sync zur aktuellen Architektur v1.8 bricht.【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L8-L12】
- **Policy-/Version-Drift**: Horizon Map referenziert in den Integration Notes weiterhin „Architecture v1.1“, obwohl Frontmatter auf v1.8 zeigt – Indikator für fehlende Aktualisierung der Narrative gegenüber dem Freeze-Stand.【F:meta/Horizon_Map_v1.8.md†L119-L125】
- **Ledger Sync**: System Harmony Ledger führt neben v1.8 auch die archivierte Architektur v1.1 als aktiven Link, wodurch CI-/Governance-Bezug unklar bleibt und die Freeze-Aussage verwässert.【F:artefacts/sync/System_Harmony_Ledger.md†L1-L31】
- **CI-/Automation-Bezug**: Horizon Map und Business Case enthalten keine klaren Hinweise auf aktuelle Automations- oder CI-Gates; lediglich historische Verweise (z. B. „Reporting initial manuell → CI nach Ledger v1“) ohne Statusangabe.【F:meta/Horizon_Map_v1.8.md†L96-L107】【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L52-L69】

## Recommendations (actionable)
1. **Frontmatter & Link-Fix**: Ergänze in Business Case und Horizon Map vollständige `linked_meta`-Strukturen (inkl. `path`+`version`) und entferne Verweise auf veraltete Architektur-Drafts; füge dem Handbook ein konsistentes Frontmatter mit v1.8 hinzu, damit der Ledger bidirektional syncen kann.【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L1-L12】【F:meta/Horizon_Map_v1.8.md†L1-L17】【F:meta/AI_First_Handbook_v1.8.md†L1-L112】
2. **Strukturangleichung**: Aktualisiere Horizon Map, Business Case und Handbook um die fehlenden Governance-Abschnitte (Overview, Policies, Proof, DoR/DoD, Lessons/Appendix, Changelog) und dokumentiere explizite Automations-/CI-Gates pro Dokument, abgestimmt mit den Policy-Anforderungen der Architektur.【F:meta/Horizon_Map_v1.8.md†L25-L126】【F:docs/BUSINESS_CASE_Horizon_v1.8.md†L14-L69】【F:meta/AI_First_Handbook_v1.8.md†L1-L112】【F:meta/AI_First_System_Architecture_v1.8.md†L19-L101】
3. **Ledger-Hygiene**: Bereinige `System_Harmony_Ledger.md`, sodass nur aktive v1.8-Quellen verlinkt werden, und dokumentiere darin den aktuellen CI-Status (z. B. aktiviertes `validate_ledger`-Script) zur Sicherstellung der Freeze-Konformität.【F:artefacts/sync/System_Harmony_Ledger.md†L1-L118】
