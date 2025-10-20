---
id: sanity-v2_3-stub
layer: meta
status: active
owner: stephan-adod
version: v2.3.1
goal: "Dokumentierter Sanity-Dry-Run, bis Validator-Script verfügbar ist"
---

# Sanity v2.3 — Stub / Dry-Run

Dieser Stub hält den Sanity-Pfad v2.3 dokumentiert, bis ein echtes Script (`scripts/sanity_v2_3_check.mjs`) bereitsteht.

## Aktueller Dry-Run (Fallback)
Die CI nutzt aktuell einen Fallback (OR-Kette), wodurch fehlende Scripts nicht blockieren:

```bash
node scripts/sanity_v2_3_check.mjs || node scripts/sanity_validate_v2_3.mjs || true
```

Hinweis: Sobald das Script existiert, ersetzt dieser Stub die oben genannte OR-Kette durch den realen Check und wird auf deprecated gesetzt.

## To-Do (nach Freeze)
- `scripts/sanity_v2_3_check.mjs` implementieren
- CI-Workflow referenzieren
- Stub archivieren (`docs/ops/snapshots/`)
