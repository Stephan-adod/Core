---
id: meta.human_in_the_loop_playbook_v1_0
layer: meta
owner: Stephan
version: v1.0
linked_core_docs:
  - path: meta/AI_First_System_Architecture_v1.9.md
    version: v1.9
  - path: meta/AI_First_Handbook_v1.9.1.md
    version: v1.9.1
  - path: meta/Horizon_Map_v1.8.md
    version: v1.8
  - path: docs/BUSINESS_CASE_Horizon_v1.8.md
    version: v1.8
governance:
  freeze_source: core_docs
  update_trigger: core_doc_freeze
  next_probe: GOV-010
status: active
---

# 🧭 Human-in-the-Loop Playbook · v1.0  
**AI-First Life–Work System · Human Role, Learning & Automation Map**

---

## 1️⃣ Purpose & Scope

Dieses Playbook definiert die Rolle des Menschen im AI-First System:
- Wann und wo **du steuerst**
- Wann und wo **das System autonom handelt**
- Wie das System **lernt und dich entlastet**, ohne Kontrolle zu verlieren

> Ziel: *Reflexive Governance* – Mensch und Maschine arbeiten in klar getrennten, aber vernetzten Loops.

---

## 2️⃣ Rollenmatrix · Wer tut was?

| Ebene | Verantwortlich | Werkzeug | Verantwortung | Eingriffsrecht |
|:------|:----------------|:----------|:----------------|:----------------|
| **Strategisch** | **Stephan (Human)** | Roadmap, Horizon Map | Zielbild, Priorisierung, Freigaben | ✅ immer |
| **Systemisch** | **ChatGPT (GPT-5)** | Rebriefs, Meta-Sync, Lessons | Kontextaufbereitung, Vorschläge | ⚙️ nur nach Intent-Freeze |
| **Operativ** | **Codex App / CI** | Tickets, Proofs, Reports | Automatisierung & Validierung | ⚙️ vollautomatisch |
| **Reflexiv** | **Du + System** | Handbook, Ledger, Lessons | Lernen, Governance-Review | ✅ alle 6–12 Wochen |

---

## 3️⃣ Eingriffslogik (Human Gates)

| Gate | Beschreibung | Wann aktiv | Entscheidung |
|:-----|:--------------|:------------|:--------------|
| **Intent Gate** | Start eines neuen Pfads (z. B. Pfad A) | vor AI-Ausführung | du bestätigst Ziel, Scope, Version |
| **Rebrief Gate** | Nach AI-Draft / Loop-Vorschlag | wenn Missverständnis oder Scope-Shift | du korrigierst Richtung |
| **Review Gate** | Nach Proof-Runs oder CI-Checks | bei Abweichung > 5 % | du validierst oder akzeptierst |
| **Lesson Gate** | Nach Loop-Abschluss | jede 2. Woche / Phase | du entscheidest, welche Learnings ins System zurückfließen |
| **Freeze Gate** | Versions- oder Governance-Update | nach jedem Quartal | du fixierst den Zustand als „wahr“ |

**Nicht tun:**  
- Operative Änderungen an Tickets, CI-Skripten oder Proof-Logs während laufender Freeze-Phasen.  
- Prompts mit Schreibrechten ausführen, bevor ein Intent Gate geschlossen ist.

---

## 4️⃣ Lern- & Automationspfade

### 🔹 Learning Loop (Reflexiv)
Action → Proof (Value + Learning) → Lesson → Policy-Update → System adapt

markdown
Code kopieren
- **Proofs** kommen aus CI & Ledger  
- **Lessons** werden im Handbook gespiegelt  
- **Policies** werden in Architecture aktualisiert  
- **Du** entscheidest, ob eine Lesson „global“ (System) oder „lokal“ (Projekt) wirkt  

### 🔹 Automation Loop (Operativ)
Roadmap Intent → Ticket Draft → CI-Proof → Trust Probe → Lessons-Feedback

markdown
Code kopieren
- Vollautomatisiert durch Codex + CI  
- Human Review nur, wenn Trust Probe Fail > 5 %  

### 🔹 Energy Loop (Sustainability)
Work Session → Energy Log → SBI / eROI → Time Ledger → Adjustment

ruby
Code kopieren
- Du trackst Fokus / Energie  
- System optimiert Workload & Proof-Frequenz  

---

## 5️⃣ Human-in-the-Loop Aufgabenübersicht

| Phase | Human Input | Ziel | Tool / Artefakt |
|:------|:-------------|:------|:----------------|
| **Planung** | Priorisieren & Intent definieren | Richtung & Fokus | Horizon Map / Roadmap |
| **Erstellung** | Scope-Review / Rebrief | AI verstehen & fokussieren | Codex Review |
| **Ausführung** | Überwachen & ggf. Eingreifen | Stabilität sichern | Trust Probe Reports |
| **Evaluation** | Lessons bewerten & freigeben | Lernen verstärken | Handbook / Ledger |
| **Governance** | Freeze bestätigen & Version syncen | Vertrauen sichern | Architecture / Governance Changelog |

---

## 6️⃣ Update- & Reflexionsmechanismus

**Trigger:**  
Sobald eines der vier Core-Docs eine neue Version erhält (`governance: freeze`), wird das Playbook automatisch neu generiert.

**CI-Hook:**  
`scripts/update_human_in_the_loop_playbook.mjs`  
→ liest Meta-Infos (Linked Core Docs)  
→ aktualisiert Rollen, Gates, Loops  
→ erzeugt `vX+0.1` Version mit Changelog

---

## 7️⃣ KPIs & Reifegradpfade

| Dimension | KPI | Zielwert | Quelle |
|:-----------|:------|:----------|:--------|
| **Governance Clarity** | Sync Drift | ≤ 5 % | Harmony Ledger |
| **Learning Velocity** | Lessons / Monat | ≥ 4 | Handbook |
| **Automation Coverage** | Automatisierbare Loops | ≥ 70 % | Architecture |
| **Energy ROI (eROI)** | Effizienzfaktor | ≥ 1.1 | Energy Ledger |
| **Human Load Balance** | Zeitanteil für Reflexion | 25 % | Time Ledger |

**Reifegradpfad**
| Stufe | Fokus | Kennzeichen |
|:-------|:-------|:-------------|
| 1 | Operativ | Tickets & Proofs manuell |
| 2 | Strategisch | AI-Drafts mit Review |
| 3 | Systemisch | Loops laufen stabil |
| 4 | Reflexiv | Lessons werden systemisch integriert |
| 5 | Integrativ | System lernt & korrigiert sich selbst |

---

## 8️⃣ Changelog

| Version | Datum | Änderung | Autor |
|:---------|:-------|:----------|:-------|
| v1.0 | 2025-10-19 | Erstfassung basierend auf Core-Docs v1.8–v1.9; Rollen- & Gate-Struktur definiert | Stephan |

---

## 9️⃣ AI-Mentorship Map · v1.0 Rebrief
**Basierend auf Playbook v1.0 + Handbook v1.9.1 · Erstintegration Human–AI Mentorship Layer**

Dieses Kapitel beschreibt, **wie ChatGPT dich aktiv in deiner Rolle als Human-in-the-Loop begleitet**.  
Die Mentorship Map verknüpft die Human Gates aus dem Playbook mit den Proof-, CI- und Energy-Loops aus dem Handbook.

---

### 🤝 Übersicht: Human Gates & Mentor-Verhalten

| Gate | Trigger Condition | Mentor Behaviour (ChatGPT) | Erwartete Human Action | CI / Proof Bezug |
|:-----|:------------------|:----------------------------|:------------------------|:-----------------|
| **Intent Gate** | Neue Roadmap oder Pfad entsteht (`intent_state: draft`) | Fragt nach Ziel, Scope, Erfolgskriterien und Governance Version; bietet Freeze-Prompt an | Bestätigt Intent und legt Scope fest („Go für Pfad A“) | Architecture · Horizon · Business |
| **Rebrief Gate** | Widerspruch oder Unklarheit im Ziel erkannt | Stoppt Automationen, signalisiert „Rebrief-Phase“, stellt 3 Klarheitsfragen (Zweck, Wert, Kontext) | Klärt Intention, entscheidet Weiterarbeit oder Neuansatz | Handbook Proof Integration |
| **Review Gate** | CI / Trust Probe meldet Drift > 5 % oder Proof-Fail | Startet Reflexive Review Prompt („Was lief gut? Was nicht? Was lernen wir?“) | Bewertet Proof-Ergebnis, markiert Lesson oder Fix | Trust Probe v2 · Energy Validator |
| **Lesson Gate** | Loop abgeschlossen oder Proof Success | Erstellt Lesson Summary Prompt; fasst Learning & Impact zusammen | Bestimmt, ob Lesson systemisch oder lokal wird | Handbook · Ledger · Lessons Collector |
| **Freeze Gate** | Alle Proofs valid, Drift < 5 % | Meldet „System ready for Freeze vX“; fordert Bestätigung | Bestätigt Governance-Freeze & Version-Update | Architecture · Governance Freeze Gate |
| **Energy Gate** | eROI < 1.0 oder SBI Δ negativ | Mentor-Check: „Energieindex kritisch – willst du pausieren oder refokussieren?“ | Entscheidet über Pause / Delegation / Scope-Shift | Energy Validator · SBI Log |
| **Harmony Gate** | Version-Drift zwischen Core-Docs | „Harmony Drift > 5 % – Review empfohlen.“ | Führt Abgleich und Freigabe durch | Harmony Check · Ledger Sync |
| **Reflection Gate** | 2 Proof-Zyklen ohne Meta-Update | Vorschlag: „Wollen wir einen Meta-Rebrief?“ | Führt Lern- und Governance-Review durch | Handbook · Meta Lessons |

---

### 🧠 Mentorship Logic (System Awareness)

| Mechanismus | Beschreibung |
|:-------------|:-------------|
| **Loop Awareness** | ChatGPT erkennt, ob du dich in einem Intent-, Execution-, Review- oder Reflection-Loop befindest. |
| **Mentor Behaviour** | Statt nur zu antworten, stellt ChatGPT *kontextabhängige Fragen*, wenn ein Gate erkannt wird. |
| **Human Agency** | Du bleibst Entscheider. AI erinnert, führt, reflektiert – aber setzt nichts um ohne dein GO. |
| **Energy Awareness** | ChatGPT prüft Energy-Logs (eROI, SBI) und erinnert, wenn dein Energiehaushalt aus dem Gleichgewicht gerät. |

---

### 🪞 Reflexive Regel: „Intent before Action“
> Kein operativer Prompt ohne aktiven Intent.  
> ChatGPT prüft aktiv, ob ein Intent-Gate geöffnet oder geschlossen ist, bevor es Änderungen im System vorschlägt.

---

### 🔄 Automatische Integration & Governance

- **Linked Handbook:** AI-First Handbook v1.9.1 → Proof-, Energy-, CI-Verhalten als Basis für Mentorship-Trigger.  
- **CI-Hook:** `scripts/check_human_gates.mjs`  
  - liest aktuelle Systemphase aus (`intent_state`, `drift`, `proof_status`)  
  - meldet offene Human Gates (Review / Lesson / Freeze)  
  - gibt Warnung, wenn kein Review erfolgt ist.  
- **Update Trigger:** bei jedem Freeze eines Core-Dokuments regeneriert sich die Mentorship Map (`update_human_in_the_loop_playbook.mjs`).

---

### 🎯 Ziel dieser Integration
- Das System erinnert dich **zur richtigen Zeit am richtigen Ort**.  
- Du bleibst **Mentor, nicht Mechaniker**.  
- Lernen, Energie und Governance werden **kontinuierlich synchronisiert**.

---

### 🔖 Changelog (Mentorship Layer)

| Version | Date | Change | Author |
|:---------|:------|:---------|:--------|
| v1.0 | 2025-10-19 | Erstintegration der AI-Mentorship Map in Playbook v1.0 (basierend auf Handbook v1.9.1) | Stephan |

---

