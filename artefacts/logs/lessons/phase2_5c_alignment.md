---
id: LESSONS-Phase2.5c-Alignment
layer: meta
version: v2.5c
date: 2025-10-22
status: logged
owner: stephan-adod
related:
 - scripts/validate_handbook.mjs
 - scripts/synthesize_pr_body.mjs
---

## Key Lessons
- Minor syntax differences break strict validators in AI-generated PRs.  
- Header tolerances („##“ + „###“) machen das System robuster.  
- Policy Version sollte empfohlen, nicht erzwingend sein.

## Observations
- Nach Patch laufen alle PRs (grün) ohne Neusynthese.
- CI-Runtime bleibt identisch, kein Kostenanstieg.

## Next Steps
- Merge nach main → aktiviert Phase 2.6 Unified Pipeline erneut.
