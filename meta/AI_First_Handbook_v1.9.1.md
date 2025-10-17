---
id: handbook-v1.9.1
layer: meta
status: draft
version: v1.9.1
linked_meta:
  - path: meta/AI_First_System_Architecture_v1.9.md
    version: v1.9
  - path: artefacts/sync/System_Harmony_Ledger_v1.9.md
    version: v1.9
governance:
  prev_freeze: v1.9
  next_probe: GOV-006
---

# AI-First Handbook v1.9.1  
## Overview  
Dieses Handbook beschreibt die erweiterte Governance-Praxis nach dem Freeze v1.9.  
Es fasst die CI-Integration von Proof-, Energy- und Ledger-Validierungen zusammen und stellt die operativen Spielregeln für den Stabilisierungszyklus v1.9.1 bereit.

## 1. Proof Integration  
- **Dual-Proof Policy:** Jedes Artefakt enthält einen Proof of Learning und einen Proof of Value.  
- **Ledger-Linkage:** Proofs werden in `artefacts/logs/proofs/proof_log.csv` verwaltet und automatisch im Ledger validiert.  
- **CI Check:** `proof_log_agg.mjs` prüft Coverage ≥ 95 %, ein Fehler führt zum Re-Run der Trust Probe.  

## 2. Energy Integration  
- **Energy Index (eROI):** Baseline ≥ 1.0, Ziel ≥ 1.1 für v1.9.1.  
- **Source:** `artefacts/data/sbi/sbi_energy.csv`  
- **Validator:** `validate_energy.mjs` importiert SBI und prüft Drift ≤ 5 %.  
- **Governance Guardrail:** Manuelle Überprüfung bei abweichendem Ergebnis (< 1.0).  

## 3. CI Integration Workflow  
| Step | Script | Purpose | Trigger |  
|------|----------|----------|----------|  
| 1 | `proof_log_agg.mjs` | Aggregiert Proofs, berechnet Coverage | on push |  
| 2 | `validate_energy.mjs` | Validiert SBI/eROI Daten | on push |  
| 3 | `run_trust_probe_v1_9.mjs` | Kombiniert alle Validierungen | weekly CI schedule |  

## 4. Human-in-the-Loop  
- Proof und Energy Validation Reports werden vom Operator verifiziert und bei Auffälligkeiten im Transition Log dokumentiert.  
- Bei fehlgeschlagenen Checks erzeugt CI automatisch ein Review-Ticket (AT-OPS-AUTO).  

## 5. Lessons und Empfehlungen  
- CI-basierte Governance reduziert Drift zwischen Architektur und Ledger.  
- Klare Datenquellen und eindeutige Proof-Definitionen beschleunigen Review-Zyklen.  
- Human Oversight bleibt entscheidend für Interpretations-Validität.  

## 6. Changelog  
| Version | Date | Change | Author |  
|----------|------|---------|---------|  
| v1.9.1 | $(date -u +"%Y-%m-%d") | Added Proof, Energy and CI Integration sections | Stephan |

---

_Logged automatically via Codex Governance Pipeline · Handbook Update v1.9.1_
