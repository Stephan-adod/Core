# Ticket AT-DOC-010: README · Governance Dashboard Integration

## Scope
Refactor der zentralen `README.md` als sichtbares Governance-Dashboard für Freeze- und Probe-Zyklen (v1.9 → v1.9.1).  
Ziel ist, die README als Single Source of Truth für:
- Freeze-Status (Tags, Versionen, Metriken)
- Aktive Stabilisierung (v1.9.1)
- Visualisierung der Trust-Probe-Badges
- Systemreferenzen (Architecture, Ledger, Handbook, Horizon)

---

## Definition of Ready (DoR)
- [ ] Letzter Freeze (v1.9) dokumentiert  
- [ ] Trust-Probe-Reports v1.9 & v1.9.1 liegen vollständig im Repo  
- [ ] Governance Review v1.9.1 vorhanden (`governance_review_v1.9.1.md`)  
- [ ] Badges / KPIs sind definiert  
- [ ] README-Template in Meta-Freeze-Format vorbereitet  

---

## Implementation Notes
1. **Structure**
   - Einleitung (AI-First Governance Repository)
   - Governance Loops (v1.9, v1.9.1)
   - Live-Metrics & Badges
   - Reference Table (Docs, Logs, Meta)
   - Version History

2. **Badge Block**
   - Übernimm den bestehenden Freeze-/Probe-Statusblock  
     (siehe Governance Prompt 2025-10-18)
   - Optional: shields.io Endpoints für Live-Updates per CI

3. **Governance References**
   - `[meta/AI_First_System_Architecture_v1.9.md]`
   - `[meta/AI_First_Handbook_v1.9.1.md]`
   - `[artefacts/sync/System_Harmony_Ledger_v1.9.1.md]`
   - `[artefacts/logs/trust_probe_report_v1.9.1.md]`

---

## Definition of Done (DoD)
- [ ] README enthält Governance-Badges (Freeze + Probe)
- [ ] Alle Referenzen sind klickbar und korrekt versioniert
- [ ] Datei validiert durch `markdownlint` & `freeze-validate`
- [ ] Pull Request mit Commit-Message:  
  `docs(readme): integrate governance dashboard and status badges (AT-DOC-010)`

---

## Linked Meta
| Type | Path | Version |
|------|------|----------|
| Architecture | meta/AI_First_System_Architecture_v1.9.md | v1.9 |
| Handbook | meta/AI_First_Handbook_v1.9.1.md | v1.9.1 |
| Ledger | artefacts/sync/System_Harmony_Ledger_v1.9.1.md | v1.9.1 |
| Governance Review | artefacts/logs/governance_review_v1.9.1.md | v1.9.1 |

---

## Expected Outcome
README fungiert als:
- lebendes Governance-Dashboard  
- Onboarding-Dokument für Meta/Operator/CI-Loop  
- Prüfanker für Freeze/Probe-Snapshots  

---

**Owner:** Stephan  
**Priority:** 🔺 High  
**Freeze Reference:** v1.9  
**Target Version:** v1.9.1  
**Category:** Documentation / Governance
