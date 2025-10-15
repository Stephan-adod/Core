---
id: rebrief-trust-probe-v1_8
layer: meta
owner: Governance Maintainer
status: active
version: v1.8
governance: freeze v1.8
linked_meta:
  - path: meta/AI_First_System_Architecture_v1.8.md
    version: v1.8
  - path: meta/Horizon_Map_v1.8.md
    version: v1.8
  - path: docs/BUSINESS_CASE_Horizon_v1.8.md
    version: v1.8
  - path: artefacts/sync/System_Harmony_Ledger.md
    version: v1.8
---

# Rebrief & Refinement · TRUST PROBE v1.8 · Meta-Sync & System Integrity Audit

**Ziel**  
Nach dem Freeze v1.8 überprüft die Trust Probe die Integrität der Meta-Schicht:
- Freeze-Kohärenz (Architecture/Horizon/Business)
- Ledger-Validität & Governance-Status
- CI/Validator-Exit-Codes (0/2/1)
- Lessons-Log vorhanden
- Konsistenz zwischen semantischem (Governance) und technischem Status (Diagnostics)

**Rollen (AI-First)**  
Systemic: ChatGPT · Operator: Codex · Compliance: CI/Validator · Human: Governance Maintainer · Meta-Sync: ChatGPT+Scripts

**Deliverables**  
- artefacts/logs/trust_probe_v1.8.{md,json}  
- Ledger-Update („Last Trust Audit“, Trust Score)  
- optional: .github/workflows/trust_probe.yml

**Trust Score** (Gewichte)  
- Architecture Integrity 20% · Ledger Validity 25% · CI Reliability 20% · Human Audit 15% · Meta-Sync Coherence 20%  
Interpretation: ≥95 🟢 · 90–94 🟡 · 80–89 🟠 · <80 🔴

**Exit-Regeln**  
0=OK, 2=Warnungen, 1=Fail (Blocker)
