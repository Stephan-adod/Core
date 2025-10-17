# Core · AI-First Governance Repository

Dieses Repository bildet die **AI-First Governance-Pipeline** ab, in der ChatGPT (Systemic Layer), Codex (Operator Layer),
CI/Validator (Compliance Layer) und der Governance Maintainer (Human Layer) zusammenarbeiten.  
Ziel ist ein nachvollziehbares, selbstüberwachendes System für datengetriebene Architektur- und Entscheidungsprozesse.

---

## 🔍 How the Trust Probe Works · v1.8

Die **Trust Probe** ist der Meta-Sync-Audit-Mechanismus, der die Integrität des gesamten Governance-Systems fortlaufend prüft.

### 🧠 Zweck
- Überwacht Konsistenz zwischen Architecture v1.8 ↔ Horizon v1.8 ↔ Business v1.8.  
- Validiert Ledger-Metriken, CI-Exit-Codes, Lessons-Logs und Governance-Status.  
- Berechnet einen **Trust Score (0–100 %)** und schreibt ihn in das Ledger.  
- Erkennt Governance-Drift automatisch.

### ⚙️ Funktionsweise
1. **Ausführung**  
   `scripts/run_trust_probe_v1_8.mjs` liest Architecture, Horizon, Business, Ledger und Diagnostics und erstellt Markdown + JSON-Reports.  
2. **Reporting**  
   - Menschlich: `artefacts/logs/trust_probe_v1.8.md`  
   - Maschinenlesbar: `artefacts/logs/trust_probe_v1.8.json`  
   - Ledger-Anhang: „Last Trust Audit“ + Score + Datum  
3. **Validierung (CI)**  
   `.github/workflows/trust_probe.yml` läuft bei Push, PR und wöchentlich.  
   - Exit 0 → 🟢 Trust OK  
   - Exit 2 → 🟡 Warnungen (Drift ≤ 5 %)  
   - Exit 1 → 🔴 Fehler / Blocker  
4. **Schutzlogik**  
   - Bricht ab, wenn Report fehlt oder der Lauf fehlschlägt.  
   - Erkennt YAML-Links in Horizon-Frontmatter.  
   - Annotiert Warnungen/Fehler direkt im PR.

### 📊 Trust-Score-Formel
| Dimension | Gewicht | Quelle |
|------------|----------|--------|
| Architecture Integrity | 20 % | meta/AI_First_System_Architecture_v1.8.md |
| Ledger Validity | 25 % | artefacts/sync/System_Harmony_Ledger.md |
| CI Reliability | 20 % | .github/workflows/ledger_validate.yml |
| Human Audit Compliance | 15 % | artefacts/logs/lessons_*.md |
| Meta-Sync Coherence | 20 % | Horizon Map + Diagnostics |

**≥ 95 → Full Trust 🟢 90–94 → Minor Drift 🟡 80–89 → Review 🟠 < 80 → Fail 🔴**

### 📁 Relevante Dateien
.github/workflows/trust_probe.yml
scripts/run_trust_probe_v1_8.mjs
artefacts/logs/rebrief_TRUST_PROBE_v1.8.md
artefacts/logs/trust_probe_v1.8.{md,json}
artefacts/sync/System_Harmony_Ledger.md

pgsql
Code kopieren

### 🪴 Next Steps
- Jede neue Freeze-Version (v1.9 +) erzeugt eine aktualisierte Trust Probe.  
- Vierteljährliche Meta-Audits (TRUST_PROBE_Qx) messen Governance-Reife.

---

## 📚 System-Layer-Überblick
| Layer | Rolle | Tool | Verantwortung | Output |
|--------|--------|------|----------------|---------|
| Systemic | ChatGPT (GPT-5) | Kontext + Governance Alignment | Prompts, Risk Maps |
| Operator | Codex App | Ausführung + Artefakte | Diffs, Reports |
| Compliance | CI / Validator | Prüfung + Exit-Codes | Badges, Logs |
| Human | Governance Maintainer | Review + Freigabe | Lessons, Freeze Updates |
| Meta-Sync | ChatGPT + Scripts | Trust Probes + Systemkarte | Trust Scores, Meta-Diagnosen |

---

## 🧩 Versionierung
- Aktuelle Freeze-Version: **v1.8**
- Letzte Trust Probe: **artefacts/logs/trust_probe_v1.8.md**
- Ledger-Status: **freeze v1.8 / trust_score ≥ 95 %**

<!-- ──────────────────────────────────────────────────────────────
     Governance Status · Freeze v1.9 & Trust Probe v1.9.1
     Werte: aus artefacts/logs/*_report_v1.9(.1).md
     ────────────────────────────────────────────────────────────── -->

<p align="left">
  <a href="https://github.com/Stephan-adod/Core/releases/tag/v1.9">
    <img alt="Freeze v1.9" src="https://img.shields.io/badge/Freeze-v1.9-2ea44f?logo=git&logoColor=white">
  </a>
</p>

**Trust Probe v1.9 (Freeze Baseline)**  
<!-- Targets: SHS ≥ 80 · Drift ≤ 5 · Policy ≥ 95 · Proof ≥ 90 · eROI ≥ 1.0 -->
<img alt="SHS ≥80"    src="https://img.shields.io/badge/SHS-84-2ea44f">
<img alt="Drift ≤5"   src="https://img.shields.io/badge/Drift-5-2ea44f">
<img alt="Policy ≥95" src="https://img.shields.io/badge/Policy-95-2ea44f">
<img alt="Proof ≥90"  src="https://img.shields.io/badge/Proof-100-2ea44f">
<img alt="eROI ≥1.0"  src="https://img.shields.io/badge/eROI-1.20-2ea44f">

**Trust Probe v1.9.1 (Stabilization)**  
<!-- Targets: SHS ≥ 85 · Drift ≤ 5 · Policy ≥ 95 · Proof ≥ 95 · eROI ≥ 1.1 -->
<img alt="SHS ≥85"    src="https://img.shields.io/badge/SHS-84-ffcc00">
<img alt="Drift ≤5"   src="https://img.shields.io/badge/Drift-5-2ea44f">
<img alt="Policy ≥95" src="https://img.shields.io/badge/Policy-95-2ea44f">
<img alt="Proof ≥95"  src="https://img.shields.io/badge/Proof-100-2ea44f">
<img alt="eROI ≥1.1"  src="https://img.shields.io/badge/eROI-1.20-2ea44f">

<sub>
Quellen: 
<a href="artefacts/logs/trust_probe_report_v1.9.md">Trust Probe v1.9</a> ·
<a href="artefacts/logs/trust_probe_report_v1.9.1.md">Trust Probe v1.9.1</a> ·
<a href="artefacts/logs/proof_coverage_report_v1.9.md">Proof Coverage</a> ·
<a href="artefacts/logs/energy_validation_report_v1.9.md">Energy</a>
</sub>


### 🧩 Governance Freeze v1.1 (Backlog & Roadmap)
- Baseline : AT-020 · Backlog & Roadmap Governance v1.0  
- Status   : freeze v1.1 (2025-10-16)  
- Health   : 8.9 (green)  
- Lessons  : artefacts/logs/lessons_AT-020_v1.md  
- Transition: artefacts/logs/transition_AT-020_v1.md

---

## 🤖 Automatisierungen
- `.github/workflows/ledger_validate.yml`  
- `.github/workflows/trust_probe.yml`  
- (geplant) `.github/workflows/meta_diagnose.yml`
