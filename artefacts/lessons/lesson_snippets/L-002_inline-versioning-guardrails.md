---
id: L-002
phase: v2.1
source: ["P-009 · Refined", "PR: P-009-refined-lesson-collector"]
category: ["Governance", "Process"]
impact: High
tags: [learning, reflection, ai-first, governance, versioning, guardrails, ci]
related_docs:
  - docs/AI_First_Business_Case.md
  - meta/AI_First_Handbook.md
  - meta/AI_First_Roadmap.md
  - meta/AI_First_System_Architecture.md
  - meta/Human_in_the_Loop_Playbook.md
  - meta/Prompt_Inventory.md
  - meta/CORE_INDEX.md
created: 2025-10-19
author: Stephan
---

### Lesson Summary
Inline-Versionierung (Version im YAML statt im Dateinamen) reduziert Drift, vereinfacht CI und verbessert Operator-Ergonomie – bei gleichbleibender Governance-Sicherheit via Guardrails.

### Context
Der erste P-009-PR scheiterte u. a. an gemischten `_v2.0/_v2.1`-Pfade und Lockfile/Caching. Wir haben auf stabile Dateinamen + `version: v2.1` im YAML umgestellt und die CI-Checks auf YAML-Validierung (statt Dateinamen) angepasst.

### Key Insight
Dateinamen-Versionierung ist robust für Freezes, erzeugt aber hohen Pflegeaufwand und Link-Drift. Mit Inline-Versionierung bleibt das System schlanker, solange CI die Version im YAML strikt prüft.

### Actionable Implication
- Core-Docs: stabile Pfade, `version: v2.1` im YAML.
- CI: Drift-Guard liest YAML, Lessons-Validator prüft `related_docs` + Version-Match.
- Sanity-Workflow: prüft stabile Pfade statt `_vX.Y`.
- Operator-Prompts/Templates: Beispiele auf stabile Pfade umstellen.

### Follow-Up / Integration
- Playbook ergänzen („Reflexive Guardrails“: Inline-Version + YAML-Prüfung).
- Version-Bump-Runbook (v2.2) mit Auto-Report (dry-run).
- Monatlich: Lesson-Cluster → Updates in Business Case / Handbook einspeisen.
