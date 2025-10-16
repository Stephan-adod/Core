import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, unlinkSync, appendFileSync } from "node:fs";

const MATRIX = "artefacts/logs/backlog_matrix_v1.1.md";
const TICKETS_DIR = "tickets";
const LEDGER = "artefacts/logs/System_Harmony_Ledger.md";
const QUEUE_DIR = "refine_queue";
mkdirSync(TICKETS_DIR, { recursive: true });

const now = new Date().toISOString();

function parseFrontmatter(s) {
  const m = s.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!m) return {};
  const obj = {};
  m[1].split("\n").forEach(l=>{
    const mm = l.match(/^\s*([a-zA-Z_]+)\s*:\s*(.*)\s*$/);
    if (mm) obj[mm[1]] = mm[2].replace(/^["']|["']$/g,"");
  });
  return obj;
}

let matrix = readFileSync(MATRIX, "utf8");
const qfiles = readdirSync(QUEUE_DIR).filter(f=>/_refine\.md$/.test(f));

function upsertTicket(id, summary, status="backlog") {
  const path = `${TICKETS_DIR}/${id}.md`;
  const base = `# Ticket ${id}

## Status
${status}

## Summary
${summary}

## Links
- Matrix: ${MATRIX}
`;
  writeFileSync(path, base, "utf8");
}

function updateMatrixRow(id, { summary, priority }) {
  const lines = matrix.split("\n");
  const idx = lines.findIndex(l=>l.includes(id));
  if (idx === -1) return;

  // Spalten: | Ticket | Layer | Initiative | Beschreibung | Status | Priorität | Owner | Cycle | Notizen |
  const cols = lines[idx].split("|").map(x=>x.trim());

  // Beschreibung ersetzen (kein "Placeholder")
  const DESC_IDX = 4; // oder 3 je nach Offset; robust ersetzen:
  // Finde erste Spalte, die nach Ticket noch vor Status kommt → hier heuristisch:
  // Wir setzen safe: index 4 (Beschreibung)
  cols[DESC_IDX] = summary?.replace(/\|/g,"/") || cols[DESC_IDX];

  // Priorität setzen, wenn numerisch
  const prioIdx = cols.findIndex(c=>/^(–|-|0|[0-9]+(\.[0-9]+)?)$/.test(c));
  if (prioIdx >= 0 && priority && /^([0-9]+(\.[0-9]+)?)$/.test(String(priority))) {
    cols[prioIdx] = String(priority);
  }

  lines[idx] = cols.join(" | ").replace(/\s+\|\s+/g," | ").replace(/^\s*[^|]/,'$&'); // beautify
  matrix = lines.join("\n");
}

function archiveTicket(id, note) {
  // Matrix-Zeile entfernen
  const lines = matrix.split("\n").filter(l=>!l.includes(id));
  matrix = lines.join("\n");
  // Ticketdatei löschen, falls vorhanden
  const t = `${TICKETS_DIR}/${id}.md`;
  if (existsSync(t)) unlinkSync(t);
  // Ledger-Eintrag
  const entry = `\n- ${now} · Archived ${id} · ${note || "refinement decision"}\n`;
  appendFileSync(LEDGER, entry);
}

let applied = 0, archived = 0;
for (const f of qfiles) {
  const p = `${QUEUE_DIR}/${f}`;
  const raw = readFileSync(p, "utf8");
  const fm = parseFrontmatter(raw);
  const id = fm.id;
  if (!id) continue;

  // wenn archive:true → archivieren
  if (String(fm.archive).toLowerCase() === "true") {
    archiveTicket(id, "marked archive in refine_queue");
    applied++;
    archived++;
    continue;
  }

  // Priority numerisch? wenn nicht, Ticket als Platzhalter belassen (skip)
  const prio = fm.priority && /^([0-9]+(\.[0-9]+)?)$/.test(String(fm.priority)) ? Number(fm.priority) : null;
  const body = raw.replace(/^---[\s\S]*?---\s*/,"").trim();
  const summary = (body.match(/##\s*Summary([\s\S]*?)(##|$)/i)?.[1] || "").trim().split("\n").map(l=>l.trim()).filter(Boolean).slice(0,2).join(" ");

  if (!summary) continue; // nichts zu übernehmen

  upsertTicket(id, summary, fm.status || "backlog");
  updateMatrixRow(id, { summary, priority: prio });
  applied++;
}

writeFileSync(MATRIX, matrix, "utf8");
console.log(`✅ Applied: ${applied} (archived: ${archived})`);
