# Codex Prompt · P-009 · Lesson Collector (v2.1)

## Zweck
Reflexionen/Erkenntnisse in gültige Lesson-Snippets transformieren und im Lesson-Log registrieren.

## Operator Input
<Reflexion oder Erkenntnis hier einfügen>

## Schritte
1) Transformiere den Operator-Input in ein Lesson-Snippet gemäß `artefacts/lessons/lesson_template_v2.1.md`.
   - Vergib eine neue ID `L-###` (numerisch aufsteigend, führende Nullen).
   - Setze `phase: v2.1`, `created: <YYYY-MM-DD>`, `author: Stephan`.
   - `source`: Liste aus Tickets/PRs/Prompts/Docs, sofern referenzierbar.
   - `category`: eine oder mehrere aus [Governance, Process, Insight, Technical, Business].
   - `impact`: [Low|Medium|High].
   - `tags`: mind. [learning, reflection] + kontextuelle Tags.
   - `related_docs`: existierende Core-Docs (sofern relevant), z. B.:
     - docs/BUSINESS_CASE_v2.1.md
     - docs/PLAYBOOK_v2.1.md
     - docs/ARCHITECTURE_v2.1.md
     - docs/HANDBOOK_v2.1.md
     - docs/ROADMAP_v2.1.md

2) Speichere als Datei:
   `artefacts/lessons/lesson_snippets/L-XXX_<kebab-topic>.md`

3) Ergänze (falls noch nicht vorhanden) folgenden CSV-Header in `artefacts/logs/lesson_log.csv`:
   `id,phase,source,category,impact,tags,related_docs,created,author`

4) Füge einen CSV-Datensatz hinzu (eine Zeile):
   - id, phase, source (semicolon-separated), category (semicolon-separated), impact, tags (semicolon-separated), related_docs (semicolon-separated), created, author

5) Validierung (Preflight):
   - YAML-Header vorhanden & Pflichtfelder befüllt.
   - `lesson_log.csv` enthält die neue `id`.
   - Alle in `related_docs` referenzierten Pfade existieren (falls gesetzt).

## Output
- 1x Markdown-Datei in `/artefacts/lessons/lesson_snippets/`
- 1x neue Zeile in `/artefacts/logs/lesson_log.csv`

## Hinweis
- Keine bestehenden Lessons überschreiben.
- IDs fortlaufend halten; bei Kollision nächsthöhere ID wählen.
