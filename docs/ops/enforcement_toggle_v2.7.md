# Enforcement Toggle v2.7 — Quickref

**Zweck:** Temporärer Downgrade von *strict* → *lean (warn-only)* für Ausnahmen (z. B. Hotfix).

**Wer darf:** Maintainer (Label-Recht). Andere Rollen: via Workflow-Dispatch nur mit Freigabe.

## Nutzung
- **PR-basiert:** Label `lean-ok` zum PR hinzufügen → nächster Run = *lean*.  
  Label entfernen → zurück *strict*.
- **Manuell:** Actions → „Unified Enforcement v2.7 (Strict w/ Toggle)” → Input `mode=lean`.

## Audit
- Jeder Run loggt nach: `artefacts/logs/enforce_report_v2_7.md`  
  (timestamp, actor, mode, reason, run_id, pr#)

## Leitplanken
- Nur kurzzeitig, niemals als Dauerzustand.
- Policy bleibt gültig: PR-Body-Anchors & Logs sind weiterhin Pflicht.
- Missbrauch vermeiden: Label-Rechte auf Maintainer beschränken.
