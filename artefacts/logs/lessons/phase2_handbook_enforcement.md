---
id: LESSONS-Phase2-Handbook-Enforcement
title: phase2 handbook enforcement
version: v2.4.7
phase: v2.2
date: 2025-10-21
owner: stephan-adod
---
## Key Lessons
- **Template-first**: PRs müssen das Compliance-Template nutzen, sonst blockt der Validator.
- **Guards zahlen sich aus**: `.github/**` vom Enforcement auszunehmen verhindert Bootstrapping-Deadlocks.
- **Bounded Intent**: 600–1200 Zeichen reichen, um Motivation & Scope sauber zu binden.
- **Logging-Referenz**: Ein fester Log-Pfad im PR-Body erhöht Nachvollziehbarkeit (Append-only).

## Observations
- Validator-Meldungen sind verständlich (Fehler/Warnungen). 
- Label-basierter Skip ist optional sinnvoll für Hotfixes.

## Follow-ups
- Status Check „Handbook · Enforcement“ in Branch Protection als **required** setzen.
- (Optional) Ticket-ID Check schärfen, sobald alle Teams konform sind.
- (Optional) Automatische Vorschau eines Minimal-Bodies für PR-Erstellung via Connector.

## Risks / Mitigations
- **Risk**: Manuell erstellte PRs mit leerem Body.  
  **Mitigation**: Template im Repo halten + Connector füllt Standard-Body vor.
- **Risk**: Zu strenge Heuristiken.  
  **Mitigation**: „Safe Start“ beibehalten, Regeln inkrementell anziehen.

(End of Lessons)
