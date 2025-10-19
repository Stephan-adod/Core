---
title: P-009 · Lesson Collector Prompt (refined)
version: v2.1
related_docs:
  - docs/AI_First_Business_Case.md
  - meta/AI_First_Handbook.md
  - meta/AI_First_Roadmap.md
  - meta/AI_First_System_Architecture.md
  - meta/Human_in_the_Loop_Playbook.md
  - meta/Prompt_Inventory.md
---

## Operator Instructions
1. Sammle neue Lessons aus dem Weekly-Reflection-Loop.
2. Für jede Lesson:
   - Erstelle eine neue Markdown-Datei unter `artefacts/lessons/lesson_snippets/L-###_<topic>.md` mit phase=v2.1, author=Stephan und aktuellem Datum.
   - Verlinke nur stabile Core-Dokumente unter `related_docs` (siehe Liste oben).
   - Ergänze eine CSV-Zeile in `artefacts/logs/lesson_log.csv` mit ID, Datum, Thema, Impact und Related Docs.
3. Verifiziere, dass sowohl Markdown als auch CSV-Eintrag gespeichert wurden.

## Prompt Outline
- Verdichte die Lesson zu Insight, Impact und Next Steps.
- Referenziere Roadmap- oder Business-Case-Konsequenzen.
- Notiere empfohlene Folgeaktionen für Operator:innen.
