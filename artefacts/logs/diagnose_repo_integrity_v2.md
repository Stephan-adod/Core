Repo Integrity Report · v2
Datum: 2025-10-15

Summary
✅ Core-Files gefunden
⚠️ Harmony Warning: Architektur-Version v1.1 weicht von Horizon/Business v1.8 ab
❌ Ledger Invalid: Pflichtmetriken & "Last Updated" fehlen
⚠️ Workflow ledger_validate.yml ohne push/pull Trigger
⚠️ Script validate_ledger.mjs ohne `status:`-Ausgabe
⚠️ Cross-Ref Drift: Horizon_Map verlinkt Ledger nicht
⚠️ ChatGPT ↔ Repo Governance-Mismatch (Architecture vs Diagnose-Report)

| ID | Bereich | Befund | Schweregrad | Fixbarkeit | Vorschlag |
|----|---------|--------|-------------|------------|-----------|
| R-001 | Core Files | Architektur v1.1 ≠ Horizon/Business v1.8 → Harmony Warning | Medium | Ja | Version & Governance in Architektur-Frontmatter angleichen |
| R-002 | Ledger | Pflichtmetriken (version_sync, policy_valid, system_harmony_score, drift) & Last Updated-Wert fehlen → Ledger Invalid | Hoch | Ja | Ledger-Frontmatter & KPI-Tabelle um fehlende Felder ergänzen |
| R-003 | Ledger | "Last Updated" leer → Ledger Outdated | Mittel | Ja | Datum im Ledger pflegen |
| R-004 | Workflow | ledger_validate.yml ohne on: [push, pull_request] → Pipeline reagiert nicht auf Commits | Mittel | Ja | Trigger ergänzen |
| R-005 | Script | validate_ledger.mjs erzeugt keine `status:`-Logzeilen → Script Incomplete | Mittel | Ja | Konsolenausgabe um `status:`-Felder erweitern |
| R-006 | Cross-Ref | Horizon_Map linked_meta enthält kein Ledger → Cross-Ref Drift | Mittel | Ja | Ledger-Datei in linked_meta einfügen |
| R-007 | Sync | Architektur-Governance (pre-freeze v1.8) ≠ Diagnose-Empfehlung (v1.8 Bezug) → ChatGPT ↔ Repo Out of Sync | Mittel | Ja | Governance-Label oder Diagnose-Report synchronisieren |

Proposed Patches

```diff
diff --git a/meta/AI_First_System_Architecture_v1_1.md b/meta/AI_First_System_Architecture_v1_1.md
@@
-version: v1.1
-governance: pre-freeze v1.8
+version: v1.8
+governance: v1.8 Bezug
```

```diff
diff --git a/artefacts/sync/System_Harmony_Ledger.md b/artefacts/sync/System_Harmony_Ledger.md
@@
-| Last Updated | YYYY-MM-DD |
+| Last Updated | 2025-10-15 |
@@
-| **Return on Learning (ROL)** | monetarisierte Proofs / Learning Hours | ≥ 0.5 | – | ⚪ |
-| **Profit per Hour (PPH)** | Profit / Gesamtstunden | ≥ 10 € | 12.5 | ⚪ |
-| **MRR Alignment %** | MRR / Target | ≥ 80 % | – | ⚪ |
-| **Policy Drift %** | abweichende Policies | ≤ 5 % | 5 | ⚪ |
-| **Time ROI Alignment %** | Workload vs Plan | ≥ 90 % | – | ⚪ |
+| **Return on Learning (ROL)** | monetarisierte Proofs / Learning Hours | ≥ 0.5 | – | ⚪ |
+| **Profit per Hour (PPH)** | Profit / Gesamtstunden | ≥ 10 € | 12.5 | ⚪ |
+| **Version Sync** | Versionsgleichheit (Arch/Horizon/Business) | = | – | ⚪ |
+| **Policy Valid %** | gültige Policies | ≥ 95 % | – | ⚪ |
+| **System Harmony Score** | SHS | ≥ 80 | – | ⚪ |
+| **Drift %** | KPI-Abweichung | ≤ 5 % | 5 | ⚪ |
+| **Time ROI Alignment %** | Workload vs Plan | ≥ 90 % | – | ⚪ |
```

```diff
diff --git a/.github/workflows/ledger_validate.yml b/.github/workflows/ledger_validate.yml
@@
-on:
-  workflow_dispatch:
-  schedule:
-    - cron: "0 16 * * 0" # So 16:00 UTC (So 18:00 lokal ~ Beispiel)
+on:
+  push:
+  pull_request:
+  workflow_dispatch:
+  schedule:
+    - cron: "0 16 * * 0" # So 16:00 UTC (So 18:00 lokal ~ Beispiel)
```

```diff
diff --git a/scripts/validate_ledger.mjs b/scripts/validate_ledger.mjs
@@
-  console.log("=== System Harmony Ledger Validation (validate-only) ===");
+  console.log("status: running | scope=system_harmony_ledger");
@@
-  if (failed) { console.error("❌ Validation FAILED"); process.exit(1); }
-  console.log("✅ Validation PASSED");
+  if (failed) {
+    console.error("status: failed | reason=thresholds_not_met");
+    process.exit(1);
+  }
+  console.log("status: passed | health=%d | drift=%s", health, isNaN(drift) ? "n/a" : Number(drift).toFixed(2));
```

```diff
diff --git a/meta/Horizon_Map_v1.8.md b/meta/Horizon_Map_v1.8.md
@@
 linked_meta:
   - meta/AI_First_System_Architecture_v1_1.md
-  - docs/BUSINESS_CASE_Horizon_v1.8.md
+  - docs/BUSINESS_CASE_Horizon_v1.8.md
+  - artefacts/sync/System_Harmony_Ledger.md
```
