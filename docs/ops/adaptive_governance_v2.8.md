# Adaptive Governance v2.8 — Kick-off

**Ziel:** Governance wird kontextsensitiv und adaptiv.  
**Kernideen:**
- Checks gewichten nach *Intent-Confidence*, Risk, Scope.
- *Soft-Fail* Pfade mit Feedback → Strict-Promotion bei Reife.
- AI-gestützte Empfehlungen (z. B. fehlende Belege, Unsicherheiten).

## Roadmap (Draft)
1. Context-Features erfassen (PR-Metadaten, Diff-Scope, Ticket-Klasse)
2. Confidence-Score schätzen (Heuristik → später ML)
3. Regeln ableiten:
   - Low risk/High confidence → Soft-Fail möglich
   - High risk/Low confidence → Strict
4. Telemetrie sammeln (Lessons / Proofs → Verbesserungsloop)

## Artefakte
- `artefacts/logs/transition_v2.8_kickoff.md` (dieser Kick-off)
- später: `scripts/validate_adaptive_v2_8.mjs` (optional)

_Status:_ Kick-off erstellt (siehe Transition-Log).
