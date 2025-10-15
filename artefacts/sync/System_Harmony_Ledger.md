---
id: artefacts.sync.system_harmony_ledger_v0_1
layer: artefacts
owner: Stephan
status: draft
version: v0.1
governance: pre-freeze v1.8
linked_meta:
  - meta/Horizon_Map_v1.8.md
  - docs/BUSINESS_CASE_Horizon_v1.8.md
  - meta/AI_First_System_Architecture_v1_1.md
---

# 🧩 System Harmony Ledger · Draft v0.1  
**Purpose:** Synchronisations- und Monitoring-Dokument für das AI-First Life–Work System  
(*Strategie ↔ Ökonomie ↔ Architektur*)

---

## 1️⃣ Ledger Meta

| Feld | Wert |
|:--|:--|
| Last Updated | 2025-10-15 |
| Sync-Mode | manual (draft) |
| Operator | Stephan |
| Next Sync Target | artefacts/sync/System_Harmony_Ledger_v1.md |
| CI Mode | disabled (v0.1) |

---

## 2️⃣ Core KPIs (Snapshot)

| KPI | Beschreibung | Zielwert | Letzter Wert | Status |
|:--|:--|:--|:--|:--|
| **Learning Velocity** | geschlossene Loops / Woche | ≥ 2 | 2.0 | ⚪ |
| **Market Validation Rate (MVR)** | validierte Proofs / Total | ≥ 0.25 | 0.3 | ⚪ |
| **Proof-to-Investment Ratio (PIR)** | Proofs / (Time + Cost) | ≥ 0.10 | 0.22 | ⚪ |
| **Energy ROI (eROI)** | SBI Δ / Hours | ≥ 1.0 | 0.15 | 🔴 |
| **Return on Learning (ROL)** | monetarisierte Proofs / Learning Hours | ≥ 0.5 | – | ⚪ |
| **Profit per Hour (PPH)** | Profit / Gesamtstunden | ≥ 10 € | 12.5 | ⚪ |
| **Version Sync** | Versionsgleichheit (Arch/Horizon/Business) | = | false | 🔶 |
| **Policy Valid %** | gültige Policies | ≥ 95 % | – | ⚪ |
| **System Harmony Score** | SHS | ≥ 80 | – | ⚪ |
| **Drift %** | KPI-Abweichung | ≤ 5 % | 5 | ⚪ |
| **Time ROI Alignment %** | Workload vs Plan | ≥ 90 % | – | ⚪ |

---

## 3️⃣ Policy-Status (Architecture Mirror)

| Policy | Ziel | Status | Drift | Letztes Review |
|:--|:--|:--|:--|:--|
| Energy | SBI ≥ 1.0 + Pause-Policy | active | – | – |
| Quality | DoR/DoD erfüllt | active | – | – |
| Automation | keine manuelle Wiederholung > 2× | active | – | – |
| Market Validation | ≥ 1 Proof / Quartal | active | – | – |
| Profit per Hour | ≥ 10 €/h | active | – | – |
| Harmony Check | Version Sync = true | planned | – | – |

---

## 4️⃣ Proof-Log Overview (Summary)

| Quartal | Proof | Typ | Wert | Status |
|:--|:--|:--|:--|:--|
| Q1 / 2025 | Micro-Service #1 | Proof of Learning | – | 🟡 pending |
| Q2 / 2025 | Micro-Service #2 | Proof of Value | – | ⚪ planned |
| Q3 / 2025 | Knowledge Product #1 | Proof of Market | – | ⚪ planned |
| Q4 / 2025 | System Health Review | Proof of Trust | – | ⚪ planned |

---

## 5️⃣ Sync Status & Version Check

| Datei | Version | Letztes Sync | Abgleich | Status |
|:--|:--|:--|:--|:--|
| Horizon Map | v1.8 | – | = Architecture v1.1 + Business v1.8 | 🟢 aligned |
| Business Case | v1.8 | – | = Horizon v1.8 + Architecture v1.1 | 🟢 aligned |
| Architecture | v1.1 | – | – | 🟢 aligned |

---

## 6️⃣ Rebrief v0 Questions (Preparation for Refinement v1)

1. Welche KPI oder Policy-Werte sollen als erstes automatisch gesynct werden?  
2. Wie wird „Letzter Wert“ ermittelt (manual Input, CSV, Script)?  
3. Welche Farblogik soll CI verwenden (🟢 = ok, 🟡 = warn, 🔴 = kritisch)?  
4. Wie oft soll der Ledger aktualisiert werden (Commit, Wochenende, Proof-Review)?  
5. Wie wird Drift berechnet (%-Differenz oder bool)?  
6. Welche Metriken sind Pflicht für Freeze („must pass“)?  

> **Ziel Refinement v1:** Definition von Sync-Mechanik & Audit-Grenzwerten für v1.0 Release.

---

## 🧩 Integration Notes
- Ledger bindet Horizon v1.8, Business v1.8, Architecture v1.1.  
- Nach Refinement v1 → Version 1.0 (aktiv für CI).  
- Harmony Check Policy prüft Versionsgleichheit vor jedem Freeze.

## 🔧 Refinement v1 Responses (System Harmony Ledger · 2025-10-16)

---

### 🧭 Zone 1 – KPI Sync Logic

**Automatisch zu aktualisierende KPIs (v1.0):**
| KPI | Quelle | Format | Formel / Berechnung | Status |
|:--|:--|:--|:--|:--|
| Learning Velocity | artefacts/logs/loop_summary.csv | float | closed_loops / weeks | active |
| Market Validation Rate (MVR) | artefacts/logs/proof_log.csv | float | valid_proofs / total_proofs | active |
| Proof-to-Investment Ratio (PIR) | artefacts/logs/cost_time.csv | float | proofs / (hours + cost/100) | active |
| Energy ROI (eROI) | artefacts/logs/sbi_log.csv | float | sbi_delta / hours | active |
| Profit per Hour (PPH) | artefacts/logs/revenue_report.csv | currency | total_profit / total_hours | active |
| Policy Drift % | artefacts/logs/policy_audit.csv | percent | drifted_policies / total_policies * 100 | active |

**Manuell gepflegt (Review Mode):**  
Return on Learning (ROL), Time ROI Alignment (%), qualitative Proof-Reviews.

---

### ⚙️ Zone 2 – Bewertungslogik (🟢🟡🔴)

```yaml
thresholds:
  learning_velocity: { green: 2.0, yellow: 1.5, red: 1.0 }
  mvr: { green: 0.25, yellow: 0.15, red: 0.1 }
  pir: { green: 0.10, yellow: 0.07, red: 0.05 }
  eROI: { green: 1.0, yellow: 0.8, red: 0.6 }
  pph: { green: 10, yellow: 8, red: 5 }
  policy_drift: { green: 5, yellow: 8, red: 10 }
weights:
  learning_velocity: 0.2
  mvr: 0.2
  eROI: 0.2
  pph: 0.2
  policy_drift: 0.2
🔢 Zone 3 – Drift & Health Score
Drift-Formel:
Drift % = (abweichende KPI-Werte / Gesamt-KPI) × 100

Health Score (SHS):
SHS = (Summe KPI-Scores / Max-Score) × 100

🟢 ≥ 80 Stable · 🟡 60–79 At Risk · 🔴 < 60 Critical

Beispiel-Berechnung:
Bei 6 KPIs → 12 Maxpunkte → aktuelle Summe 10 → SHS = 83 % → 🟢 Stable

🔁 Zone 4 – Update & Trigger Rhythm
Trigger	Aktiv	Beschreibung
Proof Review	✅	Ledger-Update nach jeder Proof-Review
Wöchentlicher Sync	✅	Sonntag 18 Uhr (validate-only)
Commit	⚪	deaktiviert
Manuell	✅	bei Governance-Freeze

Human Gate: Operator (Stephan) prüft alle Änderungen vor Merge.
Log-Datei: artefacts/logs/ledger_sync_<date>.md (Append-Mode).

🧮 Zone 5 – CI / Automation Definition
CI-Modus: validate-only

Regeln:

Drift > 5 % → CI-Job schlägt fehl.

SHS < 80 % → Warnung im Codex-Kommentar.

Automatische Benachrichtigung bei Drift-Fehlern.

yaml
Code kopieren
jobs:
  ledger_sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Validate Ledger
        run: node scripts/validate_ledger.mjs --max-drift 5 --min-health 80
🧩 Zone 6 – Governance & Freeze Readiness
Pflicht-KPIs für Freeze (müssen 🟢 sein):

Profit per Hour

Learning Velocity

Market Validation Rate

Energy ROI

yaml
Code kopieren
policy:
  name: Ledger Freeze Gate
  rule: "SHS >= 80 and drift <= 5"
  metric: "health_score and drift_rate"
  status: active
Valid-Kriterien:
✅ Alle Pflicht-KPIs 🟢
✅ Drift ≤ 5 %
✅ Letzter Sync ≤ 7 Tage

🧩 Integration Notes
Ledger v1.0 wird im validate-only-Modus betrieben.

KPI-Berechnung erfolgt per Node-Script (update_ledger.mjs).

Ergebnisse fließen in Horizon v1.8 / Business v1.8 / Architecture v1.2 zurück.

Governance-Freeze nur zulässig, wenn Ledger Freeze Gate = true.

yaml
Code kopieren

---

