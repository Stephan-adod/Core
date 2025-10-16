import { readFileSync, writeFileSync } from "node:fs";

const MATRIX = "artefacts/logs/backlog_matrix_v1.1.md";
const out = process.argv[2] || `logs/backlog_hygiene_${new Date().toISOString().replace(/[:.]/g,'-')}.md`;

const md = readFileSync(MATRIX, "utf8");
const lines = md.split("\n").filter(l => /\|/.test(l) && /AT-\d{3}/.test(l));

const rows = lines.map(l => {
  const cells = l.split("|").map(c=>c.trim());
  const id = cells.find(c=>/^AT-\d{3}$/.test(c)) || "";
  const desc = cells[4] || cells[3] || "";
  const status = cells.find(c=>/^(backlog|running|planned|ready|doing|done|blocked)$/i.test(c)) || "";
  const prio = cells.find(c=>/^(–|-|0|[0-9]+(\.[0-9]+)?)$/.test(c)) || "–";
  const isPlaceholder = /Placeholder/i.test(desc) || prio === "–" || prio === "-";
  return { id, status, prio, desc, isPlaceholder, raw: l };
});

const placeholders = rows.filter(r=>r.isPlaceholder);
const actives = rows.filter(r=>!r.isPlaceholder);

let outMd = `# Backlog Hygiene Check\n\n`;
outMd += `**Date:** ${new Date().toISOString()}\n\n`;
outMd += `## Kennzahlen\n- Tickets gesamt: ${rows.length}\n- Platzhalter: ${placeholders.length}\n- Aktiv: ${actives.length}\n\n`;

outMd += `## Platzhalter (bitte *aktivieren* oder *archivieren*)\n`;
if (placeholders.length === 0) {
  outMd += `- Keine 👍\n`;
} else {
  outMd += `\n| Ticket | Status | Prio | Nächste Aktion |\n|---|---|---|---|\n`;
  outMd += placeholders.map(p => `| ${p.id} | ${p.status||"–"} | ${p.prio} | Aktivieren (Summary/Goal/DoR setzen) **oder** Archivieren |\n`).join("");
}

outMd += `\n## Aktivierte Tickets (Info)\n`;
outMd += `\n| Ticket | Status | Prio |\n|---|---|---|\n`;
outMd += actives.map(a => `| ${a.id} | ${a.status||"–"} | ${a.prio} |\n`).join("");

writeFileSync(out, outMd, "utf8");
console.log(`🧹 Hygiene-Report geschrieben: ${out}`);
