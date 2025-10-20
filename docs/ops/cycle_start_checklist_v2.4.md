---
id: ops-cycle-start-checklist-v2_4
layer: meta
status: active
owner: stephan-adod
version: v2.4.2
goal: "Standardisierte Vorbereitung für neuen Learning Cycle (n+1)"
---

# Cycle Start Checklist · v2.4

## Purpose
Sicherstellen, dass jeder neue Zyklus (Cycle n+1) konsistent, nachvollziehbar und governance-konform startet.

## 1️⃣ Pre-Check
- [ ] Alle Drift- und Adoption-Daten aktualisiert (`docs/data/*history.*`)
- [ ] `computeDriftScore()` zuletzt erfolgreich ausgeführt
- [ ] Data-Freshness < 7 Tage
- [ ] Keine offenen ALERTS im letzten Findings-Report
- [ ] Compliance Register aktuell (`meta/AI_Compliance_Register_v2.4.json`)

## 2️⃣ Start Cycle n+1
- [ ] Neues Daten-Snapshot (Context + Forecast) erfassen
- [ ] Findings aktualisieren (`forecast_drift_findings_v2.4.md`)
- [ ] Lessons `L-013` mit neuem Cycle-Eintrag ergänzen
- [ ] Prüfen, ob Auto-Tune-Thresholds angepasst wurden

## 3️⃣ Post-Start Governance
- [ ] Freeze Candidate bleibt gültig (≥ 0.9 Harmony)
- [ ] Transition-Log ergänzt
- [ ] Roadmap-Link auf neuen Cycle gesetzt

> 🧭 Hinweis: Kein Kalender-Takt erforderlich – ein Cycle startet, wenn Drift- oder Adoption-Signale auftreten.
