# Refinement · AT-020 · AI-First Backlog & Roadmap Management v1.0
# (Prompt-Chaining · ChatGPT ↔ Codex ↔ CI)

🎯 Ziel
Operationalisierung des Rebriefings AT-020: Aufbau eines AI-First gesteuerten Backlog- und Roadmap-Systems,
das Impact-, Trust-, Effort- und Harmony-Signale strukturiert, bewertet und automatisiert in Governance-Prozesse integriert.

---

## 🧭 Sequenzplan (Prompt-Chaining)

| Phase | Beschreibung | Output | Verantwortlicher Layer |
|--------|---------------|---------|-------------------------|
| **1️⃣ Artefakt-Initialisierung** | Anlegen der 3 Kern-Artefakte (Backlog-Matrix, Roadmap, Priorisierungs-Regeln) | `artefacts/logs/backlog_matrix_v1.0.md`, `artefacts/logs/roadmap_v1.0.md`, `artefacts/logs/prioritization_rules_v1.0.md` | Codex |
| **2️⃣ Data-Seeding** | ChatGPT extrahiert alle offenen Themen aus Tickets AT-015→019, gruppiert nach Layer (Foundation / Product / Meta) | Inhalte in Matrix + Roadmap | ChatGPT |
| **3️⃣ Scoring-Logic Integration** | Berechnung Impact × Trust × Harmony × Learning / Effort (Gewichte lt. Rules) | YAML-Block in `prioritization_rules_v1.0.md` | ChatGPT |
| **4️⃣ CI-Setup & Automation** | Neues Workflow-File `backlog_health.yml` → prüft Score ≥ 85 %, erzeugt Badge | `.github/workflows/backlog_health.yml` | Codex |
| **5️⃣ Validation & Lessons** | CI erzeugt Report (`artefacts/logs/diagnose_backlog_v1.0.md`), Human validiert, Lessons + Freeze | `lessons_AT-020_v1.md`, `transition_AT-020_v1.md` | CI + Human |

---

## ⚙️ Deliverables Details

### 🗂️ 1. Backlog Matrix (artefacts/logs/backlog_matrix_v1.0.md)
| Ticket | Layer | Kategorie | Impact | Trust | Effort | Harmony | Learning | Priority | Status | Owner |
|---------|--------|------------|---------|--------|---------|----------|-----------|----------|--------|
| AT-015 | Meta | Architecture Uplift | 9 | 10 | 6 | 9 | 8 | 9.1 | done | Stephan |
| AT-016 | Meta | Proof Mechanism | 10 | 8 | 7 | 9 | 9 | 8.6 | planned | – |
| AT-017 | Product | Action Plan Automation | 9 | 8 | 6 | 8 | 9 | 8.2 | planned | – |
| GOV-003 | Meta | Archive Policy | 7 | 7 | 5 | 8 | 6 | 7.0 | backlog | – |
| OPS-001 | Foundation | Probe Parameterization | 8 | 8 | 6 | 8 | 8 | 8.0 | backlog | – |
| DOC-001 | Meta | Docs & Badges | 7 | 9 | 5 | 9 | 7 | 7.8 | backlog | – |

→ CI berechnet `Backlog Health = Durchschnitt(Priority Scores)`  
   und vergleicht mit Schwellenwert ≥ 8.5 (= 85 %).

---

### 🗺️ 2. Roadmap v1.0 (artefacts/logs/roadmap_v1.0.md)
| Zyklus | Zeitraum | Fokus | Hauptziele | Tickets | Status |
|---------|-----------|--------|-------------|----------|---------|
| Cycle 1 | Okt–Nov 2025 | Proof & Action Plan | ROI Mechanik messbar, Action Plan CI-fähig | AT-016 / 017 | running |
| Cycle 2 | Dez 2025–Jan 2026 | Governance & Archive | Archiv-Policy, Lessons Automation | GOV-003 / OPS-001 | planned |
| Cycle 3 | Feb–Mär 2026 | Docs & Meta Upgrade | Badges, Roadmap 2.0, v1.9 Prep | DOC-001 | backlog |

---

### ⚖️ 3. Prioritization Rules v1.0 (artefacts/logs/prioritization_rules_v1.0.md)
```yaml
weights:
  impact: 0.30
  trust: 0.25
  harmony: 0.20
  effort: -0.15   # negativer Beitrag
  learning: 0.10
thresholds:
  green: 8.5
  yellow: 7.0
  red: 5.0
formula: "(impact*0.30 + trust*0.25 + harmony*0.20 + learning*0.10 - effort*0.15)"
source:
  - meta/AI_First_System_Architecture_v1.8.md
  - artefacts/logs/trust_probe_v1.8.json
  - artefacts/logs/meta/diagnose_meta_v1.8.json
🔧 CI-Workflow (Backlog Health)
CREATE FILE: .github/workflows/backlog_health.yml

yaml
Code kopieren
name: CI · Backlog Health v1.0
on:
  push:
  pull_request:
  schedule:
    - cron: "0 8 * * 1" # Montag 08 UTC
jobs:
  backlog-health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - name: Evaluate Backlog Health
        id: eval
        run: |
          node -e "
            const fs=require('fs');
            const rows=fs.readFileSync('artefacts/logs/backlog_matrix_v1.0.md','utf8')
              .split('\n').filter(l=>/^\| AT-/.test(l));
            const vals=rows.map(r=>Number((r.match(/\|\s*(\d\.\d)\s*\|/)||[])[1])).filter(Boolean);
            const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
            const color=avg>=8.5?'green':avg>=7?'yellow':'red';
            console.log('Backlog Health',avg.toFixed(2),color);
            if(avg<7)process.exit(1);
          "
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: backlog-health-report
          path: artefacts/logs/backlog_matrix_v1.0.md
🔗 Integration mit Meta Diagnose
Nach jedem erfolgreichen Run:

CI schreibt Last Backlog Health in artefacts/sync/System_Harmony_Ledger.md

Meta Diagnose liest diesen Wert in den nächsten Zyklus ein → volle Governance-Kohärenz.

✅ Definition of Ready
Rebriefing AT-020 abgeschlossen

Meta Freeze v1.8 aktiv

Trust & Meta Diagnose 🟢

Lessons aktuell (< 14 Tage)

✅ Definition of Done
Matrix, Roadmap, Rules vorhanden

CI Workflow „Backlog Health“ läuft grün

Score ≥ 85 %

Lessons + Transition Logs erstellt

📘 Nächster Schritt
→ Ausführen dieses Refinement-Prompts in der Codex App.
→ Danach generiert ChatGPT die Execution Prompts (Codex Apply für Files + CI).
→ Ziel: PR codex/at-020-backlog-governance mit allen drei Artefakten und CI grün.

yaml
Code kopieren

---
