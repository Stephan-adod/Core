# Daily Diagnostics (read-only)

**Ziel:** Kompakter, schreibgeschützter Überblick über Version, aktiven Cycle, Governance- und Signal-Status.

## Start
- GitHub → Actions → **P-CORE · Daily Diagnostics (read-only)** → *Run workflow*.

## Output
- **Job Summary:** Markdown (oben rechts im Run)
- **Artefakt:** `diag_p_core_snapshot.json` (Download im Run)

## Hinweise
- Keine Commits, keine Repo-Writes (writes nur im Runner-Temp).
- Version & Cycle werden automatisch erkannt (ohne Hardcodes).
- Falls Warnings erscheinen (z. B. Data Freshness > 14d), im nächsten Cycle priorisieren.
