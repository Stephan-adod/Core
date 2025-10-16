# Rebriefing · AT-020 · AI-First Backlog & Roadmap Management v1.0

🎯 Ziel
Ein zentrales, AI-First gesteuertes Backlog- und Roadmap-System aufbauen,
das alle Governance-, Produkt- und Architektur-Initiativen integriert,
ihre Wirkung (Impact, Trust, Harmony, Effort) bewertet
und automatisch in den Freeze- und Diagnose-Zyklus einspeist.

---

## 🧩 Rollen & Zuständigkeiten

| Layer | Rolle | Verantwortung | Output |
|--------|--------|---------------|---------|
| Systemic | ChatGPT (GPT-5) | Rebriefing, Priorisierungslogik, Governance Alignment | Prompts, Rules |
| Operator | Codex App | Erstellung der Matrix, Roadmap & Rules Files | Artefakte |
| Compliance | CI / Validator | Validierung, Scoring & Reporting | Diagnose Reports |
| Human | Governance Maintainer | Review, Lessons, Merge Decisions | Approvals, Lessons |
| Meta-Sync | ChatGPT + Scripts | Reifegradmessung & Driftmanagement | `diagnose_backlog_v1.0.*` |

---

## ⚙️ Scope

1. **Backlog Matrix v1.0** – zentrale Übersicht aller Themen mit Impact/Trust/Effort-Scores  
2. **Roadmap v1.0** – 12-Wochen-Planung nach AI-First Loops (Proof → Governance → Automation)  
3. **Prioritization Rules v1.0** – Gewichtung & Formel (Impact × Trust × Harmony × Learning / Effort)  
4. **Generator Script** – `generate_backlog_summary.mjs` → JSON-Aggregat  
5. **CI-Integration** – Badges & Reports (Backlog Health ≥ 85 % = 🟢)

---

## 📋 Deliverables Matrix

| Abschnitt | Quelle | Status | Maßnahme | Owner |
|------------|--------|---------|-----------|--------|
| Governance Context | Meta v1.8 | vorhanden | übernehmen | ChatGPT |
| Prioritization Logic | neu | fehlt | entwickeln | ChatGPT |
| Backlog Matrix | Tickets AT-015→019 | fehlt | generieren | Codex |
| Roadmap | Planning Sheet v1 | fehlt | strukturieren | ChatGPT + Codex |
| CI Validation | Meta Diagnose | fehlt | anlegen | Codex + CI |

---

## ⚖️ Risiken & Annahmen
- *Komplexität*: zu viele Metriken → Start „Lean“ (Impact, Trust, Effort)
- *Drift*: Backlog ≠ Governance → CI koppeln an Meta Diagnose
- *Overhead*: doppelte Pflege → Script-Aggregation
- *AI Bias*: ChatGPT priorisiert falsch → Human Review + Lessons-Loop

---

## ✅ Definition of Ready
- Meta Freeze v1.8 aktiv  
- Trust & Meta Diagnose 🟢  
- Lessons < 14 Tage  
- Governance Maintainer bestätigt Scope

---

## ✅ Definition of Done
- Matrix, Roadmap, Rules im Repo  
- Generator Script läuft  
- CI Badge „Backlog Health“ aktiv  
- Lessons + Transition Log vorhanden

---

## 📘 Nächster Schritt
→ Starte **Refinement Prompt AT-020 v1** (Prompt-Chaining)
   mit Deliverables-Sequenz + CI-Wiring Plan.
