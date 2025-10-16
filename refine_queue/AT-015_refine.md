---
id: AT-015
status: backlog
priority: 8.0
reviewer: Stephan
---

# AT-015 · Refinement

## Summary
Verknüpfe `cost_time.csv` mit Tickets/Matrix und rendere eine einfache Übersicht (Budget, Ist-Zeit, Abweichung) im Dashboard.

## Goal (Outcome & KPI)
- Outcome: Sichtbarkeit von Aufwand/Kosten pro Ticket.
- KPI/Target:
  - Abdeckung (Tickets mit Eintrag in cost_time.csv): **≥ 60 %**
  - Fehlermeldungen/Parsingfehler: **0**
  - Neue Dashboard-Sektion „Cost/Time“ vorhanden

## Impact (Why now)
- Bessere Entscheidungsgrundlage bei Priorisierung (Nutzen/Aufwand).

## Definition of Ready (DoR)
- [x] Problem/Scope klar
- [x] Lösungsskizze (CSV→map→merge→render)
- [ ] Abhängigkeiten (CSV-Schema) geklärt
- [ ] Aufwand (M)

## Next Step (1 konkrete Aktion)
- Schritt: kleines Parser-Modul + Merge in Dashboard; minimaler CSV-Validator.
- Verantwortlich: ChatGPT + Stephan

## Notes
- Datei liegt bereits unter `logs/cost_time.csv`.
