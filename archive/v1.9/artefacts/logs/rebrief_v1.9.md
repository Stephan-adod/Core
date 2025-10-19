# Rebrief v1.9 · Lessons Review (AT-DOC-006)

## Lessons Analysis

### Lesson 1 – Policy-Sync braucht manuelle Rebrief-Phasen
- **Category:** Governance Automation
- **Current Coverage:** Architektur v1.8 etabliert automatisierte Drift-Checks, während das Handbook manuelle Policy-Sync-Schritte über Operator und ChatGPT beschreibt. Horizon Map und Business Case spiegeln den Harmony Check als Governance-Pflicht.
- **Gap Analysis:** Kein gemeinsamer Prozess-Artefakt dokumentiert, das Timing und Verantwortlichkeiten für manuelle Rebrief-Phasen nach automatischen Checks beschreibt. Ledger referenziert Policy-Status, aber ohne explizite Rebrief-Hand-off.
- **Recommendation:** Ergänze einen wiederkehrenden Policy-Sync-Playbook-Eintrag (Handbook Appendix) mit Triggern aus Ledger-Alerts und dokumentiere Übergabe an Operator inklusive Zeitfenster (z. B. wöchentlicher Governance-Slot).

### Lesson 2 – Proof-Mechanik muss Proof of Learning & Proof of Value parallel führen
- **Category:** Proof Governance
- **Current Coverage:** Architektur fordert konsistente Proof-Typen; Handbook beschreibt Proof-of-Value Reports und Ledger-Einträge, Business Case listet Proof-of-Value und Lessons und Ledger enthält Tabellen für Proof-Typen.
- **Gap Analysis:** Dokumente nennen beide Proof-Arten, aber es fehlt ein klarer Datenstandard, der sicherstellt, dass jeder Proof-Eintrag beide Dimensionen abbildet (z. B. gemeinsame Tabelle oder Schema).
- **Recommendation:** Definiere in Ledger oder eigenem Schema-File obligatorische Felder (`proof_type`, `learning_outcome`, `value_metric`) und erweitere Scripts, die Proof-Reports prüfen, um beide Felder zu verlangen.

### Lesson 3 – Automation Scope benötigt klaren Human-in-the-Loop Rahmen
- **Category:** Operating Model
- **Current Coverage:** Architektur betont Human-in-the-Loop; Handbook führt Prinzip „Mensch in der Schleife bleibt Entscheidungsträger“ und Recovery-Pfade an; Horizon Map referenziert Policy-as-Code und Manual Review-Rhythmus.
- **Gap Analysis:** Es fehlt eine explizite Matrix, welche Aufgaben automatisiert laufen dürfen und wann Human-Gates greifen (z. B. nach Risikolevel). Business Case adressiert Risiko Over-Engineering, jedoch ohne konkreten Automatisierungs-Guardrail.
- **Recommendation:** Erstelle eine Automation-Scope-Matrix im Handbook (oder separatem Artefakt) mit Kategorien (low/medium/high risk), zuständige Rolle und benötigte Gate-Checks, verknüpft mit Codex/CI Skripten.

### Lesson 4 – Harmony Loop verlangt Versionsgleichheit als Freeze-Gate
- **Category:** System Harmony
- **Current Coverage:** Architektur und Horizon Map definieren Version Sync und Harmony Check Policy; Business Case bestätigt Governance-Gates; Ledger zeigt Versionsgleichheit und Pflicht-KPIs.
- **Gap Analysis:** Obwohl Version Sync dokumentiert ist, fehlt ein automatischer Alarm bei Verletzung – Ledger listet Status manuell. Kein automatisierter Drift-Alert oder CI-Check-Report referenziert in Logs.
- **Recommendation:** Aktivere oder ergänze ein CI-Skript (z. B. `validate_ledger.mjs`) mit Benachrichtigung, das bei Version-Mismatch automatisch ein Ticket (AT-auto) erzeugt und im Ledger als Ereignis protokolliert.

### Lesson 5 – Energy KPI als Audit-Metrik stärken
- **Category:** Energy Management
- **Current Coverage:** Architektur fordert stärkere Berücksichtigung; Horizon Map definiert Energy & Balance Theme; Business Case enthält Energie-Invest und eROI; Ledger weist eROI KPI, aktuell kritisch.
- **Gap Analysis:** Kein konsistentes Reporting-Format für Energy KPI, eROI-Wert unklar („–“ bzw. kritisch), keine verbindlichen Audit-Termine. Handbook fokussiert mehr auf Governance als Energie-Tracking.
- **Recommendation:** Implementiere Energy Audit Playbook mit standardisiertem Reporting (SBI-Log, Stunden, Recovery) und verknüpfe es mit Ledger-Update-Rhythmus (z. B. monatlich) plus Verantwortlichkeit für Datenpflege.

## Harmonised Lessons Table

| Lesson | Category | Current Coverage | Gap | Recommended Action | Owner | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Policy-Sync braucht Rebrief | Governance Automation | Architektur, Handbook, Horizon, Business Case nennen Drift- und Policy-Sync | Kein dokumentierter manueller Rebrief-Prozess | Playbook für Policy-Sync mit Ledger-Trigger & Zeitfenster erstellen | Governance Maintainer | High |
| Proof-Mechanik doppelt führen | Proof Governance | Architektur + Handbook + Business Case + Ledger referenzieren Proof-Typen | Kein Datenstandard für beide Proof-Dimensionen | Schema für Proof-Einträge definieren und Validator erweitern | ChatGPT + Operator | Medium |
| Automation Scope mit Human-Gates | Operating Model | Architektur + Handbook + Horizon betonen Human-in-the-Loop | Keine Risiko-Matrix für Automatisierung | Automation-Scope-Matrix erstellen & CI-Verknüpfung | Operator | Medium |
| Harmony Loop Version Sync | System Harmony | Architektur + Horizon + Business Case + Ledger dokumentieren Version Sync | Fehlende automatische Alerts bei Version-Drift | CI-Alert & Auto-Ticket bei Version-Mismatch implementieren | Governance Maintainer | High |
| Energy KPI stärken | Energy Management | Horizon + Business Case + Ledger listen Energy KPIs | Kein Audit-Playbook, Daten lückenhaft | Energy Audit Playbook + monatlichen Ledger-Update-Prozess definieren | Operator + Governance Maintainer | High |

## Summary & Systemic Insights
- Policy-, Proof- und Harmony-Regeln sind dokumentiert, benötigen jedoch gemeinsame Betriebshilfen (Playbooks, Matrizen, Validatoren), um Automationen mit Human Gates zu balancieren.
- Energy-Metriken hinken Governance- und Automations-Themen hinterher; hier braucht es Datenstandardisierung und feste Review-Slots.

## Policy-Level Recommendations
- Ergänze Governance-Policies um verpflichtende Rebrief- und Energy-Audit-Zeitfenster, gekoppelt an Ledger-Trigger.
- Implementiere automatisierte Validatoren, die Proof-Datenschemata und Versionsgleichheit prüfen und bei Abweichungen Tickets erzeugen.

## Next Loops (AT-DOC-007 / AT-DOC-008)
- **AT-DOC-007:** Draft Policy-Sync Playbook inkl. Zeitplan, Rollen, Trigger und Integration in Handbook Appendix.
- **AT-DOC-008:** Definiere Proof & Energy Schema-Dateien + CI-Validator-Updates, um Ledger-Datenqualität zu erhöhen.
