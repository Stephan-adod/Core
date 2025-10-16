id: diagnose-meta-v1.8
layer: meta
owner: Governance Maintainer
status: draft
version: v1.8
governance: freeze v1.8
linked_meta:
  - meta/AI_First_System_Architecture_v1.8.md
  - meta/Horizon_Map_v1.8.md
  - docs/BUSINESS_CASE_Horizon_v1.8.md
  - artefacts/sync/System_Harmony_Ledger.md
---

# Meta-Sync Summary · Diagnose Prompt v1.8

🎯 Ziel  
Führe eine Meta-Diagnose über alle Governance-Layer durch.  
Analysiere, ob der aktuelle Freeze-Zustand v1.8 vollständig harmonisch ist und welche systemischen Drifts bestehen.

## Prüfziele
1. Governance-Zustand (freeze v1.8) = Ledger-Status (freeze v1.8)  
2. Trust Probe Score ≥ 90 %  
3. Keine offenen Transition- oder Lessons-Logs älter als 14 Tage  
4. Diagnose-Reports (core v3, trust v1.8) vorhanden + gültig  
5. Cross-Layer-Linked Meta vollständig (Architecture/Horizon/Business/Ledger)

## Ausgaben
- `artefacts/logs/meta/diagnose_meta_v1.8.md` (Report)  
- Optional JSON: `artefacts/logs/meta/diagnose_meta_v1.8.json`  
- Ledger-Anhang: „Last Meta Diagnosis“ + Audit-Datum  

## Bewertung
| Kategorie | Gewicht | Kriterium | Ziel |
|------------|----------|------------|------|
| Freeze Integrity | 25 % | Governance = Ledger | 1.0 |
| Diagnostics Coverage | 20 % | Reports vorhanden + valide | 1.0 |
| Trust Continuity | 25 % | Trust Score ≥ 90 % | 1.0 |
| Lessons Compliance | 15 % | Lessons aktuell | 1.0 |
| Meta-Harmony | 15 % | Cross-Refs komplett | 1.0 |

## Ergebnis-Intervall
- 🟢 ≥ 95 → Meta OK  
- 🟡 90–94 → Minor Drift  
- 🟠 80–89 → Review nötig  
- 🔴 < 80 → Audit Fail

## Nächster Schritt
Nach erfolgreicher Diagnose v1.8 → automatische Erzeugung von  
`trust_probe_v1.9_prompt.md` als Startpunkt für den nächsten Zyklus.
