---
id: freeze-candidate-check-v2_3
layer: meta
status: active
owner: stephan-adod
version: v2.3.1
goal: "Leichte Checkliste zur Bewertung 'Release v2.3 Freeze Candidate'"
---

# Freeze Candidate Check · v2.3

## Required
- [x] Blueprint v2.3.1 promoted → `meta/AI_First_System_Architecture.md`
- [x] Transition Log vorhanden → `docs/logs/transition_META_v2.2.5_to_v2.3.1.md`
- [x] Decision Matrix verlinkt → `docs/frameworks/DaaS_UseCase_Decision_Matrix_v2.3.md`
- [x] Loops spec + Runbook → `docs/prompts/P-011_loops_v2.3.mjs`, `docs/ops/loop_runbook_v2.3.md`
- [x] Lessons aktiv zentral → `docs/lessons/` (L-011, L-012)
- [x] Sanity v2.3 Stub → `docs/ops/sanity_v2_3_stub.md`

## Probes (targets)
- **Policy Valid %** ≥ 95 → _Week 0: 96_ ✅
- **Sanity %** ≥ 90 (Stub) → _Week 0: pass_ ✅
- **Context Adoption** ≥ 0.90 → _Week 0: 0.83_ ⚠️
- **Model Card Validated (AI Act)** → _Attribution pending_ ⚠️

## Decision
- **Freeze Candidate:** _Conditional_ (nachziehen bis Week 1)  
  - [ ] Context Adoption ≥ 0.90  
  - [ ] Model Card Validated (Attribution)
