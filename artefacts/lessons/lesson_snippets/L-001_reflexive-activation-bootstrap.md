---
id: L-001
phase: v2.1
source: ["P-008","P-008.5","PR-109"]
category: ["Process","Governance"]
impact: High
tags: [learning, reflection, ai-first, system, bootstrap, governance]
related_docs:
  - docs/AI_First_Business_Case_v2.1.md
  - meta/Human_in_the_Loop_Playbook_v2.1.md
  - meta/AI_First_System_Architecture_v2.1.md
  - meta/Prompt_Inventory_v2.1.md
  - meta/AI_First_Roadmap_v2.1.md
created: 2025-10-19
author: Stephan
---

### Lesson Summary
Die Reflexive Activation (P-009) braucht eine formale Governance-Verankerung **und** CI-Validierung, sonst entstehen stille Drifts – besonders bei IDs, Pfaden und Versionen.

### Context
Nach P-008 (operational) und P-008.5 (Playbook-Update) wurde P-009 vorbereitet. Der erste CI-Lauf scheiterte am Node-Cache ohne Lockfile; zudem verlinkten Core-Docs noch auf v2.0.

### Key Insight
Kleine Governance-Inkosistenzen (Versionen, Pfade) blockieren Automatisierung überproportional. CI muss frühzeitig auf Metadaten-Kohärenz (IDs/Dateinamen/Log) prüfen.

### Actionable Implication
- CI: kein Cache ohne Lockfile; Validator prüft ID=Filename und CSV-Duplikate.  
- Artefakte: Core-Docs auf v2.1 heben; `related_docs` konsistent halten.

### Follow-Up / Integration
- Monthly: Lessons clustern und in Core-Docs übernehmen.  
- Quarterly: Governance-Kapitel um „Reflexive Guardrails“ ergänzen (Versioning, IDs, Paths).
