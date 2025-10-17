---
id: meta.ai_first_handbook_v1_8
layer: meta
owner: Stephan
status: active
version: v1.8
governance: pre-freeze v1.8
linked_meta:
  - path: meta/Horizon_Map_v1.8.md
    version: v1.8
  - path: docs/BUSINESS_CASE_Horizon_v1.8.md
    version: v1.8
  - path: meta/AI_First_System_Architecture_v1.8.md
    version: v1.8
---

# AI-First Handbook · v1.8

## 1️⃣ Purpose & Principles
Dieses Dokument definiert, wie ChatGPT, Codex und der Operator gemeinsam in AI-First Loops handeln.  
Es operationalisiert die drei Kerndokumente (Horizon Map, Business Case, System Architecture) und macht Governance prüfbar.

**Prinzipien**
- System vor Geschwindigkeit
- Governance vor Komfort
- Lernen vor Automatisierung
- Mensch in der Schleife („Human-in-the-Loop“) bleibt Entscheidungsträger
- Jede Aktion muss erklärbar sein

### Proof-Mechanik & Audit Cycle
Jeder abgeschlossene Loop erzeugt ein **Proof-of-Value**, bestehend aus :
- validiertem Report (`artefacts/logs/...`)
- Eintrag im **System Harmony Ledger**
- ggf. aktualisierter Policy oder Lesson.

**Audit-Zyklus:**  
– bei jedem Pull Request (CI) und monatlich automatisch über `freeze_validator.yml`  
– Operator reviewt Lessons, ChatGPT synchronisiert Policies.

---

## 2️⃣ Roles & Responsibilities
| Rolle | Verantwortung | Tools | Key Artefakte |
|--------|----------------|-------|----------------|
| **Operator (Stephan)** | Vision, Entscheidungen, Freigabe von Gates | GitHub UI, PR Reviews | Backlog, Tickets, Ledger |
| **ChatGPT** | Strategie, Rebriefing, Struktur, Qualität | Prompt Chain | Ticket-Inhalte, Docs |
| **Codex App** | Ausführung & Reporting (keine Entscheidungen) | Node Scripts, CI | Reports, Logs, Artefakte |
| **CI / Governance Layer** | Überwachung & Enforce | GitHub Actions | Freeze Validator, Loop Check |
| **System Harmony Ledger** | Monitoring & KPIs | Markdown DB | Policy Valid %, Drift, SHS |

---

## 3️⃣ Loop Framework (Phasen & Gates)
| Phase | Beschreibung | Gate | ChatGPT Verhalten | Operator Aktion |
|--------|---------------|------|-------------------|----------------|
| **Rebrief** | Ziel & Scope klären | Scope OK | Kein Code, nur Klarheit | „Go“ für Refinement |
| **Refinement** | Struktur & Scripts entwerfen | Struktur OK | Keine Ausführung | Review & Merge |
| **Execution** | Code ausführen, Proof erzeugen | Proof OK | Nur Diagnose | Sichtprüfung |
| **Acceptance** | CI-Gate aktivieren, Lessons erfassen | Freeze OK | Nichts Neues starten | Merge + Lessons |
| **Evolution** | Updates & Policies | Lernloop | Kontextanalyse | Governance Review |

---

## 4️⃣ Core-Doc Integration
| Kerndokument | Beitrag zum AI-First System |
|---------------|-----------------------------|
| **Horizon_Map_v1.8.md** | Strategische Ausrichtung, Proof Cycles |
| **BUSINESS_CASE_Horizon_v1.8.md** | Wert, Energie & ROI-Mechanik |
| **AI_First_System_Architecture_v1.8.md** | Policies, Freeze Rules, Automation |
| **AI_First_Handbook_v1.8.md** | Übersetzt Strategie & Architektur in tägliche Entscheidungslogik |

---

## 5️⃣ Governance Mechanics
**Loop Validator (`validate_loop_state.mjs`)**
- Prüft alle Tickets auf Phasen, Gates & Pflichtabschnitte.
- Report: `artefacts/logs/loop_governance_report.*`

**Freeze Validator (CI)**
- Prüft System Harmony, Policies, Governance Loops.
- Wird erst in Acceptance aktiviert.

**System Harmony Ledger**
- Enthält Metriken: SHS ≥ 80, Drift ≤ 5 %, Policy Valid ≥ 95 %.

**Audit Frequency:** Per Pull Request + monatlicher Governance-Cron Check (`loop_governance_report` + `freeze_validator`).

---

## 6️⃣ Learning & Evolution
- Jeder abgeschlossene Loop erzeugt ein Proof-Artefakt (Report + Lessons).
- Lessons fließen in Policies oder Handbook zurück.
- Versionierung:  
  - v1.8 = initial Governance Integration  
  - v1.9 = Feedback & Loop Refinement  

### Lesson-Feedback Pipeline
1️⃣ ChatGPT analysiert Lessons & Loop Reports  
2️⃣ Operator entscheidet, ob eine Lesson eine Policy- oder Handbook-Änderung wird  
3️⃣ Policy Sync (Script / Manual) führt die Änderung ein und aktualisiert Ledger.

---

## 7️⃣ Appendix – Operator Guidance & Prompt Standards
**Operator-Checkliste**
1. Ist das Ticket in der richtigen Phase?  
2. Gibt es ein „Go“ oder Gate-Approval?  
3. Wird Codex im richtigen Modus genutzt (kein Codespaces)?  
4. Ist der Proof-Report vorhanden?  
5. Ist der Freeze erst nach Dokumentation aktiv?

### Recovery-Pfad bei Fehlern
- **Validator Fail:** ChatGPT führt Rebrief aus → Codex Fix → Operator Review.  
- **CI Block:** Operator analysiert Report → Handbook/Policy Update → erneute Execution.  
- **Drift:** Validator öffnet automatisch ein Ticket (`AT-auto-fix-####`) mit Empfehlung.

**Prompt Standards (ChatGPT)**
- Jede Antwort nennt Phase & Gate (z. B. *Refinement → Execution Gate pending*).  
- Kein unautorisierter Phasenwechsel.  
- Kein Over-Automation ohne Kontext-Proof.  
- Am Ende jedes Loops: Lessons learned + Governance Update.

---

**Version:** v1.8
**Author:** Stephan (Operator)
**Reviewed by:** ChatGPT (Governance Layer)
**Last Updated:** <auto filled during Acceptance>

## Changelog

| Version | Date | Change | Owner |
| --- | --- | --- | --- |
| v1.8 | 2025-10-16 | Frontmatter ergänzt, Governance-Verknüpfungen synchronisiert, Changelog hinzugefügt. | Stephan |
## Proof & Audit Status (v1.8)
Aktive Validatoren:
- freeze_validator.yml → CI-Gate aktiv
- validate_loop_state.mjs → Loop-Check aktiv
- Ledger Sync: SHS ≥ 80 | Drift ≤ 5 | Policy Valid ≥ 95 %
## Changelog
| Version | Date | Change | Author |
|----------|------|---------|--------|
| v1.8 | 2025-10-17 | Frontmatter und Changelog hinzugefügt | Stephan |
