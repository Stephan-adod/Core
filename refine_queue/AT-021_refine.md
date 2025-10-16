---
id: AT-021
status: backlog
priority: 8.8
reviewer: Stephan
---

# AT-021 · Refinement

## Summary
Automatisiere den wöchentlichen Backlog-Hygiene-Check (Platzhalter erkennen, Liste erzeugen, Artefakt anhängen) als GitHub Action.

## Goal (Outcome & KPI)
- Outcome: Verbindlicher, leichter Hygiene-Loop ohne manuelle Ausführung.
- KPI/Target:
  - <= 14 Tage alte Platzhalter: **0**
  - Anteil Tickets mit numerischer Prio: **≥ 80 %**
  - Wöchentlicher Report-Artefakt vorhanden: **100 %**

## Impact (Why now)
- Stellt sicher, dass Platzhalter nicht liegen bleiben.
- Entlastet dich operativ; hält den Backlog „wertvoll“.

## Definition of Ready (DoR)
- [x] Problem/Scope klar
- [x] Lösungsskizze vorhanden (Action + Script)
- [ ] Abhängigkeiten geklärt (Repo-Token, Pfade)
- [ ] Aufwand grob geschätzt (S)

## Next Step (1 konkrete Aktion)
- Schritt: `backlog_hygiene.yml` unter `.github/workflows/` anlegen (weekly, artefact upload).
- Verantwortlich: ChatGPT + Stephan

## Notes
- Nutzt `scripts/backlog_hygiene.mjs` (bereits im Repo).
