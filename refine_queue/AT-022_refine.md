---
id: AT-022
status: backlog
priority: 8.6
reviewer: Stephan
---

# AT-022 · Refinement

## Summary
Filter im Backlog-Dashboard, damit Zeilen mit Priorität „–/-“ oder Beschreibung „Placeholder“ **nicht** in aktive Metriken einfließen.

## Goal (Outcome & KPI)
- Outcome: Dashboard reflektiert nur aktiv priorisierte Arbeit.
- KPI/Target:
  - Abweichung „Active Backlog Size“ vs. Diagnose-Filtered-Snapshot: **0**
  - Tests vorhanden (Unit auf Filterfunktion)

## Impact (Why now)
- Verhindert verzerrte Velocity/Score – wichtige Voraussetzung für saubere Planung.

## Definition of Ready (DoR)
- [x] Problem/Scope klar
- [x] Lösungsskizze (Filter + Test)
- [ ] Abhängigkeiten (Renderer-Datei) geklärt
- [ ] Aufwand (S)

## Next Step (1 konkrete Aktion)
- Schritt: Filter-Utility ergänzen und in `dashboards/*` anwenden; Testdatei hinzufügen.
- Verantwortlich: ChatGPT + Stephan

## Notes
- Kann `artefacts/logs/snapshots/v1.1_filtered_*.json` als Erwartungswert nutzen.
