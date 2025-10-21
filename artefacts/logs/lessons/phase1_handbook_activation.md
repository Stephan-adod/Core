---
id: LESSONS-Phase1-Handbook-Activation
layer: meta
version: v2.4.8
date: 2025-10-21
status: logged
owner: stephan-adod
related:
  - "meta/AI_First_Handbook.md"
  - "meta/system_version.json"
  - ".github/workflows/handbook-validate.yml"
---

## Key Lessons
- **Machine-readability wins:** Front-Matter im Handbook macht Policies für Tools nutzbar.
- **Safe Mode verhindert Seiteneffekte:** Keine Auto-CI, nur workflow_dispatch → stabiler Übergang.
- **Compliance sichtbar im Alltag:** PR-Template mit Handbook-Check reduziert Interpretationsfehler.
- **Feature Flags = Governance-Optionalität:** Neue Mechaniken können gezielt aktiviert werden.

## Observations
- Handbook & system_version.json sind nun logisch verankert (policy_source).
- context_pack.yaml existiert, aber noch ohne Auto-Build (bewusst).
- Validator-Stub vorhanden; nächste Phase kann sich auf Enforcement fokussieren.

## Follow-ups (DoR für Phase 2)
- Lightweight-Validator `scripts/validate_handbook.mjs` ergänzen:
  - Check: *One PR = One Intent*
  - Check: *Logged (artefacts/logs/**)*
  - Check: *Bounded Mini-Prompt* (Intent-Section vorhanden)
- PR-Template um „Policy Version“ Feld erweitern.
- Optional: „run_log.md“ (append-only) für Codex/Operator-Runs.

## Risks / Mitigations
- **Risk:** Policy-Änderungen ohne Version-Bump.  
  **Mitigation:** In Phase 3 Handbook-Hash im Drift Sentry prüfen.
- **Risk:** Context-Pack zu groß.  
  **Mitigation:** Budget-Grenze beibehalten; Überschreitungen nur berichten.

(End of Lessons)
