import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const MATRIX = "artefacts/logs/backlog_matrix_v1.1.md";
const QUEUE_DIR = "refine_queue";
mkdirSync(QUEUE_DIR, { recursive: true });

const md = readFileSync(MATRIX, "utf8");
/**
 * Erwartete Matrix-Spalten:
 * | Ticket | Layer | Initiative | Beschreibung | Status | Priorität | Owner | Cycle | Notizen |
 */
const rows = md.split("\n").filter(l => /\|/.test(l) && /AT-\d{3}/.test(l));

function cell(l, idx) {
  const c = l.split("|").map(x => x.trim());
  return (c[idx] ?? "").trim();
}
function isPlaceholderRow(l) {
  const desc = cell(l, 4) || cell(l, 3);
  const prio = l.split("|").map(x=>x.trim()).find(x=>/^(–|-|0|[0-9]+(\.[0-9]+)?)$/.test(x)) || "–";
  return /Placeholder/i.test(desc) || prio === "–" || prio === "-";
}

const placeholders = rows.filter(isPlaceholderRow);

const now = new Date().toISOString();
for (const line of placeholders) {
  const id = line.split("|").map(x=>x.trim()).find(x=>/^AT-\d{3}$/.test(x));
  const file = `${QUEUE_DIR}/${id}_refine.md`;
  if (existsSync(file)) continue;

  const template = `---
id: ${id}
status: backlog
# archive: true   # ← wenn gesetzt, wird das Ticket archiviert/entfernt
# priority: 8.5   # ← Zahl 0–10; "–" lässt Platzhalter bestehen (kein Apply)
# reviewer: Stephan
---

# ${id} · Refinement

## Summary
<kurz und prägnant – 1–2 Sätze>

## Goal (Outcome & KPI)
- Outcome:
- KPI/Target:

## Impact (Why now)
- Business Impact (1–2 Bullet Points):
- Risiko bei Nicht-Umsetzung:

## Definition of Ready (DoR)
- [ ] Problem/Scope klar
- [ ] Lösungsskizze vorhanden
- [ ] Abhängigkeiten geklärt
- [ ] Aufwand grob geschätzt (S/M/L)

## Next Step (1 konkrete Aktion)
- Schritt:
- Verantwortlich:

## Notes
- Kontext/Links:

`;
  writeFileSync(file, template, "utf8");
  console.log("📝 created", file);
}

console.log(`✅ Queue erstellt (${placeholders.length}) – bearbeite die Dateien in ${QUEUE_DIR}/ und fülle Summary/Goal/priority/... aus.`);
