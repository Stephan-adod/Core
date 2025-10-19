---
title: AI-First Prompt System – Governance & Reflection Overview
version: v2.2
created: 2025-10-19
author: Stephan
---

# 🧭 AI-First Prompt System – Verständnis & Struktur (v2.2)

Dieses Dokument erklärt den logischen Aufbau des **Prompt Inventory** und wie es die Lern-, Reflexions- und Governance-Mechanismen des Systems abbildet.

---

## 1️⃣ Grundprinzip

Das **Prompt Inventory** ist die zentrale Steuertabelle des AI-First Systems.  
Es zeigt, **welche Prompts aktiv** sind, **welche Artefakte sie erzeugen** und **wie sie miteinander interagieren**.

> 💡 Kurz gesagt:  
> Das Prompt Inventory dokumentiert nicht nur Code, sondern die *intelligente Governance-Struktur* deines Systems.

---

## 2️⃣ Prompt-Typen und Funktionen

| Typ | Kürzel | Zweck | Output | Beispiel |
|------|---------|--------|---------|----------|
| **Process Prompts** | `P-00X` | Führen Aktionen aus, erzeugen Artefakte oder Daten | Lessons (L-###), KPIs | `P-009 Lesson Collector`, `P-010 Governance KPI Collector` |
| **Review Prompts** | `RS-00X` | Konsolidieren mehrere Lessons zu Meta-Learnings | Synthesen (S-###) | `RS-001 Review Synthesis` |
| **Operator Prompts** | `OP-00X` | Manuelle oder geplante Ausführung durch Operator | Trigger für P- oder RS-Prompts | `OP-001 Weekly Reflection` |

---

## 3️⃣ Datenfluss im Lernsystem

```text
Intent (P-00X)
   ↓
Lesson (L-###)
   ↓
Review Synthesis (RS-00X)
   ↓
Synthesis (S-###)
   ↓
Governance KPI Collector (P-010)
   ↓
Business Case (v2.3 archive)
Jeder abgeschlossene Intent erzeugt eine Lesson.
Nach 3–5 Lessons oder einem Governance-Change wird eine Review-Synthesis (RS-00X) ausgelöst.
Diese Meta-Learnings fließen in die Governance-Metriken (P-010) und schließlich in den archivierten Business Case.

4️⃣ Struktur des Prompt Inventory (meta/Prompt_Inventory.md)
Spalte	Bedeutung
ID	Technische Referenz (wird von CI-Validator gelesen)
Name	Offizieller Titel des Prompts
Zweck	Kurzbeschreibung, was der Prompt bewirkt
Status	Lebenszyklus-Status (active, planned, archived)
Notes	Links zu Lessons, Synthesen, oder Playbook-Abschnitten

5️⃣ Beispielauszug (v2.2)
markdown
Code kopieren
### A. Governance & Reflection
| ID | Name | Zweck | Status | Notes |
|----|------|--------|--------|-------|
| RS-001 | Review Synthesis (v2.2) | Aggregiert Lessons (L-001–L-004) zu Meta-Learnings und erstellt S-001 | 🟢 active | |
| P-009 | Lesson Collector (refined) | Erzeugt Lesson-Snippets + Logeintrag, verlinkt Core-Docs | 🟢 active | L-004 integrated (Playbook : Learning Rhythm Governance) |
6️⃣ Zusammenspiel mit anderen Core-Docs
Dokument	Rolle im System	Beziehung zum Prompt Inventory
meta/Human_in_the_Loop_Playbook.md	Beschreibt Lernrhythmen und Operator-Guides	Referenziert Prompts (OP-, P-, RS-)
meta/Prompt_Inventory.md	Steuer- und Nachverfolgungstabelle	Quelle für CI- und Freeze-Checks
artefacts/prompts/	Enthält die aktiven Prompt-Definitionen	Wird in Inventory verlinkt
artefacts/syntheses/	Enthält Meta-Learnings (S-###)	Output der RS-Prompts
artefacts/logs/lesson_log.csv	Historischer Verlauf der Lessons	Input für Review-Prompts
docs/AI_First_Business_Case.md	Finale Wissensdokumentation	Aggregiert Synthesen und Governance-KPIs

7️⃣ CI-Integration
Die Validierung der Prompts erfolgt durch:

bash
Code kopieren
npm run validate:lessons
npm run validate:drift
Diese prüfen:

Vollständigkeit der YAML-Header

Existenz aller verlinkten Artefakte

Konsistenz zwischen Inventory, Prompts und Logs

8️⃣ Zusammenfassung
Ebene	Ziel
Operator (OP-00X)	Regelmäßige Reflexion oder Trigger
Process (P-00X)	Automatisierte Erkenntniserzeugung
Review (RS-00X)	Meta-Lernen über mehrere Lessons
Governance (P-010+)	Messbare Reife- und Stabilitätskennzahlen
Business Case (v2.3)	Dokumentierter System-Lernnachweis

✅ Fazit
Das Prompt-System ist das Herzstück deiner AI-First Governance.
Es sorgt dafür, dass Lernen → Reflektieren → Messen → Archivieren
ein durchgängiger, nachweisbarer Prozess bleibt.
Alle Prompts, Lessons, Synthesen und Governance-Mechanismen
folgen einem konsistenten, versionierten und CI-validierbaren Schema.

yaml
Code kopieren

---
