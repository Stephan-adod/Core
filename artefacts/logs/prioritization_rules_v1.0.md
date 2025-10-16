---
id: prioritization-rules-v1_0
layer: meta
owner: Governance Maintainer
status: freeze
version: v1.1
governance: freeze v1.8
---

# Prioritization Rules · v1.1

```yaml
weights:
  impact: 0.30
  trust: 0.25
  harmony: 0.20
  effort: -0.15   # Aufwand vermindert Score
  learning: 0.10
thresholds:
  green: 8.5
  yellow: 7.0
  red: 5.0
formula: "(impact*0.30 + trust*0.25 + harmony*0.20 + learning*0.10 - effort*0.15)"
sources:
  - artefacts/logs/meta/diagnose_meta_v1.8.json
  - artefacts/logs/trust_probe_v1.8.json
  - artefacts/sync/System_Harmony_Ledger.md
notes:
  - „Priority“ in der Matrix ist Anzeige; die Berechnung erfolgt im Generator-Script.
```
