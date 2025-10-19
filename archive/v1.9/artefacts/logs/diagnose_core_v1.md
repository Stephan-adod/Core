# Codex Diagnose – Core Files v1

## Zusammenfassung
- Alle drei Kerndokumente gefunden; Pfade entsprechen den Soll-Positionen.
- Blocker: Architektur-Frontmatter Version/Governance nicht harmonisiert mit Horizon/Business.
- Blocker: Policy-YAML in der Architektur-Datei verletzt Schema und enthält zusammengeführte Policies.
- Keine fehlenden Pflichtabschnitte; System Harmony Ledger vorhanden.

## Findings
| ID | Datei | Befund | Schweregrad | Fixability | Empfohlene Aktion |
|----|-------|--------|-------------|------------|-------------------|
| CORE-001 | meta/AI_First_System_Architecture_v1_1.md | Frontmatter-Version (v1.1) & Governance ("pre-freeze v1.8") weichen von Horizon/Business (v1.8 / "v1.8 Bezug") ab → Harmony-Check schlägt fehl. | Blocker | Hoch | Unified Diff:<br>`--- a/meta/AI_First_System_Architecture_v1_1.md`<br>`+++ b/meta/AI_First_System_Architecture_v1_1.md`<br>`@@`<br>`-version: v1.1`<br>`-governance: pre-freeze v1.8`<br>`+version: v1.8`<br>`+governance: v1.8 Bezug` |
| CORE-002 | meta/AI_First_System_Architecture_v1_1.md | Policy-YAML blockiert Parsing: mehrfaches `name:` im selben Objekt, fehlende Pflicht-Policies (Energy, Quality, Automation). | Blocker | Mittel | Unified Diff (ersetzen des Codeblocks):<br>`@@`<br>`-```yaml`<br>`-policy:`<br>`-  name: Market Validation`<br>`-  rule: "each quarter >= 1 validated external proof"`<br>`-  metric: "proofs_validated / quarter >= 1"`<br>`-  rationale: "Umsatz oder Nutzerfeedback ist ein Lernsignal, kein Endziel"`<br>`-  status: active`<br>`-  name: Profit per Hour`<br>`-  rule: "profit_per_hour >= 10"`<br>`-  metric: "total_profit / total_hours"`<br>`-  status: active`<br>`-  name: Harmony Check`<br>`-  rule: "horizon.version == business.version == architecture.version"`<br>`-  status: active`<br>`-  name: Ledger Freeze Gate`<br>`-  rule: "SHS >= 80 and drift <= 5"`<br>`-  status: active`<br>`-``` `<br>`+```yaml`<br>`+policy:`<br>`+  - name: Energy`<br>`+    rule: "output requires SBI >= 1.0"`<br>`+    metric: "sbi_last >= 1.0"`<br>`+    status: active`<br>`+  - name: Quality`<br>`+    rule: "each artefact meets DoR & DoD"`<br>`+    status: active`<br>`+  - name: Automation`<br>`+    rule: "no manual repetition > 2x"`<br>`+    status: active`<br>`+  - name: Market Validation`<br>`+    rule: "each quarter >= 1 validated external proof"`<br>`+    metric: "proofs_validated_per_quarter >= 1"`<br>`+    status: active`<br>`+  - name: Profit per Hour`<br>`+    rule: "profit_per_hour >= 10"`<br>`+    metric: "total_profit / total_hours"`<br>`+    status: active`<br>`+  - name: Harmony Check`<br>`+    rule: "horizon.version == business.version == architecture.version"`<br>`+    metric: "version_sync == true"`<br>`+    status: active`<br>`+  - name: Ledger Freeze Gate`<br>`+    rule: "system_harmony_score >= 80 and drift <= 5"`<br>`+    status: active`<br>`+``` |

## Pfadabgleich
| Datei | IST-Pfad | SOLL-Pfad | Abweichung | git mv Vorschlag |
|-------|----------|-----------|------------|------------------|
| ARCHITECTURE | meta/AI_First_System_Architecture_v1_1.md | meta/AI_First_System_Architecture_v1_1.md | – | – |
| HORIZON | meta/Horizon_Map_v1.8.md | meta/Horizon_Map_v1.8.md | – | – |
| BUSINESS | docs/BUSINESS_CASE_Horizon_v1.8.md | docs/BUSINESS_CASE_Horizon_v1.8.md | – | – |

## Ergänzende Hinweise
- Linked-Meta-Referenzen sind wechselseitig vollständig.
- Pflichtabschnitte (Integration Recommendations, Proof & Trust-Mechanik, 90-Day Action Plan, ROI-Mechanik mit „Profit per Hour ≥ 10 €") sind vorhanden.
- System Harmony Ledger liegt vor (`artefacts/sync/System_Harmony_Ledger.md`).
