# Ticket AT-DOC-004: Harmony Ledger Hygiene (v1.8)

<!--
phase: ready
-->

## Context
- **Ziel / Nutzen:** `artefacts/sync/System_Harmony_Ledger.md` referenziert ausschließlich aktive v1.8-Artefakte, dokumentiert Freeze-/CI-Status und entfernt veraltete Architekturversionen.
- **Referenzen:**
  - `artefacts/sync/System_Harmony_Ledger.md`
  - `meta/AI_First_System_Architecture_v1.8.md`
  - `meta/Horizon_Map_v1.8.md`
  - `docs/BUSINESS_CASE_Horizon_v1.8.md`
  - `artefacts/logs/documentation_diagnostic_v1.8.md`

---

## Outcome Target (1–2 Sätze & KPI)
- **Ergebnis:** Ledger-Einträge spiegeln ausschließlich v1.8-Sources wider, enthalten aktuelle Freeze-/CI-Notizen und sind bidirektional mit den Artefakten verknüpft.
- **KPI / Messpunkte:**
  - Ledger-Lint (`scripts/ledger_hygiene.mjs`) → 100 % pass
  - 0 Referenzen auf archivierte Versionen (≤ v1.7)

---

## Definition of Ready (DoR)
- [x] Aktueller Ledger analysiert
- [x] Zielstruktur & Pflichtfelder bestätigt
- [ ] Stakeholder für Freigabe benannt

---

## Definition of Done (DoD)
- [ ] Veraltete Links entfernt oder als „archived“ markiert
- [ ] Aktive v1.8-Artefakte inkl. Versionspfad dokumentiert
- [ ] Freeze-/CI-Status pro Eintrag aktualisiert
- [ ] Ledger-Hygiene-Script grün, Ergebnis im PR dokumentiert
- [ ] Lessons & Changelog im Ledger ergänzt

---

## Plan (≤ 5 Schritte)
1. Diagnosebericht auswerten und Delta-Liste erstellen.
2. Ledger-Einträge aktualisieren (Links, Status, Versionen).
3. Cross-Check mit Artefakten (Frontmatter `linked_meta`).
4. Hygiene-Script ausführen und Resultate archivieren.
5. Review + Merge, Ticket schließen.

---

## Proof of Learning & Value
- **Hypothese:** Aufgeräumter Ledger schafft Transparenz und reduziert Fehlalarme in Freeze-Gates.
- **Evidenz (Dateien / Logs):** _wird nach Umsetzung ergänzt_
- **Ergebnis:** _Pending_
- **Impact (kurz):** Erwartet: weniger manuelle Ledger-Korrekturen, stabilere CI-Gates.

---

## Policy References
- POL:Ledger
- POL:Automation
- POL:Governance

---

## Risks
- Historische Artefakte könnten noch regulatorisch relevant sein → Abstimmung notwendig
- Script-Verfügbarkeit (`scripts/ledger_hygiene.mjs`) muss ggf. zuerst erstellt werden

---

## Transitions
- 2025-XX-XX: Ticket erstellt – Status `ready`
