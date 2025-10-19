## Learning Rhythm Governance (v2.1)

Der Reflexions-Loop ist Teil der AI-First System-Governance und verbindet operative Arbeit (Tickets, Prompts, PRs) mit fortlaufendem organisationalem Lernen.

### Rhythmus

| Zyklus    | Aktivität                                   | Artefakt                                        | Verantwortlich |
|-----------|---------------------------------------------|--------------------------------------------------|----------------|
| Weekly    | Lesson Collector Prompt ausführen           | /artefacts/lessons/lesson_snippets/              | Operator       |
| Monthly   | Lessons clustern & konsolidieren            | /artefacts/logs/lesson_log.csv                   | Steward        |
| Quarterly | Lessons in Core-Docs integrieren            | Business Case / Handbook / Architecture / Roadmap| Owner          |
| Annual    | Meta-Review „AI-First System Learnings“     | /artefacts/reports/system_learnings_YYYY.md      | Governance     |

### Prinzipien
- Jede Lesson ist ein überprüfbarer Datenpunkt im Lernsystem.
- Lessons dürfen Prozesse verändern, müssen aber dokumentiert & versioniert werden.
- Reflexion ist Teil der CI-Pipeline (nicht optional).

### Working Agreements
- IDs: `L-###`, Dateinamen: `L-###_<topic>.md`
- Pflichtfelder im YAML: id, phase, source, category, impact, tags, related_docs, created, author
- Verlinke relevante Core-Docs (Business Case, Playbook, Architecture, Handbook, Roadmap)
