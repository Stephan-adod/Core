# Ticket AT-DOC-001: Frontmatter & Linked Meta Alignment (v1.8)

<!--
phase: ready
-->

## Context
- **Ziel / Nutzen:** Alle Kernartefakte der Horizon-Linie in Version 1.8 besitzen vollständige YAML-Frontmatter-Blöcke mit `id`, `layer`, `owner`, `governance` sowie bidirektional gepflegten `linked_meta`-Einträgen (`path` + `version`).
- **Referenzen:**
  - `docs/BUSINESS_CASE_Horizon_v1.8.md`
  - `meta/Horizon_Map_v1.8.md`
  - `meta/AI_First_Handbook_v1.8.md`
  - `meta/AI_First_System_Architecture_v1.8.md`
  - `artefacts/logs/documentation_diagnostic_v1.8.md`

---

## Outcome Target (1–2 Sätze & KPI)
- **Ergebnis:** Alle vier Artefakte enthalten einen validen Frontmatter-Block mit konsistenter v1.8-Versionierung und vollständig gepflegten `linked_meta`-Feldern.
- **KPI / Messpunkte:**
  - Frontmatter-Lint (custom script) → 100 % pass
  - 0 fehlende `linked_meta`-Einträge laut `scripts/validate_linked_meta.mjs`

---

## Definition of Ready (DoR)
- [x] Betroffene Artefakte & Felder identifiziert
- [x] Erwartete Struktur (id, layer, owner, governance, linked_meta.path+version) dokumentiert
- [ ] Owner & Umsetzungsslots bestätigt

---

## Definition of Done (DoD)
- [ ] Frontmatter-Blöcke nach Styleguide ergänzt/aktualisiert
- [ ] `linked_meta` verweist auf aktuelle v1.8-Artefakte, bidirektional gegengeprüft
- [ ] Validierungs-Run (`scripts/validate_linked_meta.mjs`) grün und im PR dokumentiert
- [ ] Lessons Learned im Änderungs-PR notiert

---

## Plan (≤ 5 Schritte)
1. Diagnosebericht prüfen (`artefacts/logs/documentation_diagnostic_v1.8.md`) und Soll-Struktur ableiten.
2. Frontmatter in Business Case, Horizon Map, Handbook und Architektur aktualisieren.
3. Gegenseitige Links (`linked_meta`) für alle Artefakte synchronisieren.
4. Validierungsscript laufen lassen, Ergebnis dokumentieren.
5. Review + Merge, anschließend Ticket-Status aktualisieren.

---

## Proof of Learning & Value
- **Hypothese:** Vollständige Frontmatter-Blöcke verbessern die Governance-Sichtbarkeit und erleichtern CI-Prüfungen.
- **Evidenz (Dateien / Logs):** _wird im PR ergänzt_
- **Ergebnis:** _Pending_
- **Impact (kurz):** Erwartet: geringeres Risiko von Version-Drift & schnellerer Ledger-Sync.

---

## Policy References
- POL:Governance
- POL:Quality

---

## Risks
- Konflikte durch historische Draft-Verlinkungen
- Manuelle Pflege der `linked_meta` kann Fehler erzeugen → Scriptgestützte Kontrolle einplanen

---

## Transitions
- 2025-XX-XX: Ticket erstellt – Status `ready`
