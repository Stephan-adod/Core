---
version: v2.0
status: active
phase: operational
updated: 2025-10-19
related_logs:
  - artefacts/logs/transition_P-006_done_v2.0.md
  - artefacts/logs/transition_P-008_intent_confirm_v2.1.md
---

# Prompt Inventory v2.0

## Metadata
related_logs:
  - artefacts/logs/transition_P-006_done_v2.0.md
  - artefacts/logs/transition_P-008_intent_confirm_v2.1.md

| Key   | Category       | Prompt Name                | Purpose (Kurz)                               | Impact (Wert)                        | Trigger            | Output                         | Status    | Owner   |
|-------|----------------|----------------------------|----------------------------------------------|--------------------------------------|--------------------|--------------------------------|-----------|---------|
| P-001 | Archive        | Archive v1.9              | Freeze v1.9 zur Referenz                     | Nachvollziehbarkeit, Risikoreduktion | Manual             | archive/v1.9/**                | ✅ done   | Stephan |
| P-002 | Archive        | Linked Meta Fix           | linked_meta auf Archivpfade umschreiben      | Tote Links entfernt, Tools stabil    | Manual             | fix_report.json                | ✅ done   | Stephan |
| P-003 | CI Governance  | Mode-Gate Patch           | v2-Erkennung + archive/** ignorieren         | CI-Noise eliminiert                  | Manual             | grüne CI-Basis                 | ✅ done   | Stephan |
| P-004 | Repo Structure | Prune to v2.0 Skeleton    | Altlasten weg, Core-Docs angelegt            | Klarheit, geringe Pflege             | Manual             | v2.0-Skeleton                  | ✅ done   | Stephan |
| P-005 | Repo Structure | Simplification PR         | Tickets/Workflows bereinigt, sanity eingeführt | schnelle Wartung                    | Manual             | leichtes Repo + sanity.yml     | ✅ done   | Stephan |
| P-006 | Core Docs      | Seed Content Prompt       | 5 Core-Docs mit Basisinhalt füllen           | System ready for intent confirmation | Nach P-005         | 5 Core-Docs populated (intent_state=draft) | ✅ done   | Stephan |
| P-007 | Governance     | Prompt Inventory Generator| Dieses Sheet aktualisieren                   | Single Source of Truth               | Manual/Scheduled   | aktualisiertes Inventory       | ✅ active | System  |
| P-008 | Reflection     | Lesson Collector Prompt   | Consolidate lessons → Playbook               | Learning Loop established      | After intent confirm | Intent confirmed, Bootstrap archived, phase=operational | ✅ done   | System  |
| P-009 | Diagnostics    | Archive Link Sanity Check | Verify archive references resolve            | Archive integrity verified     | Manual/CI          | diagnostics/report.json        | 🔜 planned | System  |
| P-010 | Energy         | eROI Monitor Prompt       | Compute effort ↔ impact ratio                | Energy awareness loop          | Weekly/Manual      | artefacts/eROI_log.csv         | 🔜 planned | Stephan |
