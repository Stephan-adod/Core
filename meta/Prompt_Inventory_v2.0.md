---
status: active
phase: bootstrap
---

# Prompt Inventory v2.0

## Metadata
related_logs:
  - artefacts/logs/transition_2025-10-19_v1.9_to_v2.0.md

| Key   | Category       | Prompt Name                | Purpose (Kurz)                               | Impact (Wert)                        | Trigger            | Output                         | Status    | Owner   |
|-------|----------------|----------------------------|----------------------------------------------|--------------------------------------|--------------------|--------------------------------|-----------|---------|
| P-001 | Archive        | Archive v1.9              | Freeze v1.9 zur Referenz                     | Nachvollziehbarkeit, Risikoreduktion | Manual             | archive/v1.9/**                | ✅ done   | Stephan |
| P-002 | Archive        | Linked Meta Fix           | linked_meta auf Archivpfade umschreiben      | Tote Links entfernt, Tools stabil    | Manual             | fix_report.json                | ✅ done   | Stephan |
| P-003 | CI Governance  | Mode-Gate Patch           | v2-Erkennung + archive/** ignorieren         | CI-Noise eliminiert                  | Manual             | grüne CI-Basis                 | ✅ done   | Stephan |
| P-004 | Repo Structure | Prune to v2.0 Skeleton    | Altlasten weg, Core-Docs angelegt            | Klarheit, geringe Pflege             | Manual             | v2.0-Skeleton                  | ✅ done   | Stephan |
| P-005 | Repo Structure | Simplification PR         | Tickets/Workflows bereinigt, sanity eingeführt | schnelle Wartung                    | Manual             | leichtes Repo + sanity.yml     | ✅ done   | Stephan |
| P-006 | Core Docs      | Seed Content Prompt       | 5 Core-Docs mit Basisinhalt füllen           | System wird nutzbar                  | Nach P-005         | aktualisierte 5 Core-Docs      | 🔜 planned | Stephan |
| P-007 | Governance     | Prompt Inventory Generator| Dieses Sheet aktualisieren                   | Single Source of Truth               | Manual/Scheduled   | aktualisiertes Inventory       | ✅ active | System  |
