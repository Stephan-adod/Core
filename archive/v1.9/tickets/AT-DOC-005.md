AT-DOC-005 · System Harmony Ledger Cleanup (Mini-Ticket)

Ziel
artefacts/sync/System_Harmony_Ledger.md auf v1.8 Only bringen, SHS/Drift/Policy-Valid sauber definieren, CI-Status dokumentieren.

Scope

Entferne alle v1.1/draft-Verweise.

Setze aktive Quellen:
meta/AI_First_System_Architecture_v1.8.md,
meta/Horizon_Map_v1.8.md,
docs/BUSINESS_CASE_Horizon_v1.8.md.

Ergänze Metrics-Snapshot (temporary notes allowed) + Changelog.

Notiere Validatoren (Freeze/Loop/Proof) + Status.

Copy-Snippet (1:1 in Datei einfügen/ersetzen)

# System Harmony Ledger · v1.8

## Sources (active)
- meta/AI_First_System_Architecture_v1.8.md (v1.8)
- meta/Horizon_Map_v1.8.md (v1.8)
- docs/BUSINESS_CASE_Horizon_v1.8.md (v1.8)

> Hinweis: Historische Versionen (v1.1 / draft) sind **archiviert** und werden nicht mehr für Governance/CI herangezogen.

## Metrics (snapshot)
| Metric | Target | Current | Source | Note |
|---|---:|---:|---|---|
| System Harmony Score (SHS) | ≥ 80 | _tbd_ | Trust Probe | wird nach Cleanup neu berechnet |
| Drift % | ≤ 5 | _tbd_ | CI Diagnostics | v1.1-Links entfernt |
| Policy Valid % | ≥ 95 | _tbd_ | Policy Check | Policies lt. Architecture v1.8 |
| Profit per Hour (€) | ≥ 10 | _tbd_ | Business Case | Monitoring-only |

## Validation & Gates
- Freeze Validator: **active** (PR-Gate)
- Loop Governance Check: **active** (per PR + cron)
- Proof Cycle Validator: **planned** (Q-basiert)

## Sync Rules
1. Nur **v1.8**-Quellen sind harmoniefähig.  
2. Jede Änderung an Horizon/Business/Architecture aktualisiert diesen Ledger.  
3. **Freeze-Kandidat** erst, wenn: SHS ≥ 80, Drift ≤ 5, Policy Valid ≥ 95 %.

## Changelog
| Version | Date | Change | Author |
|---|---|---|---|
| v1.8 | 2025-10-17 | Cleanup: v1.1/draft entfernt; aktive Quellen + Metrics + Gates ergänzt | Stephan |


DoR

 Alte Referenzen identifiziert (v1.1/draft).

 Aktive Kern-Docs auf v1.8 verfügbar.

DoD

 Datei enthält ausschließlich v1.8-Quellen.

 Metrics/Validator-Blöcke vorhanden.

 markdownlint/CI grün.
