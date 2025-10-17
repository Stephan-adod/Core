import fs from "fs";
import path from "path";
const ideaFile = process.argv[2];
if (!ideaFile) { console.error("usage: node scripts/promote_idea_to_ticket.mjs ideas/IDEA_*.md"); process.exit(2); }

const MATRIX = "artefacts/logs/backlog_matrix_v1.1.md";
const TICKETS_DIR = "tickets";

// 1) Gate prüfen
const { spawnSync } = await import("node:child_process");
const gate = spawnSync("node", ["scripts/validate_ticket_quality.mjs", ideaFile], { encoding: "utf8" });
if (gate.status !== 0) {
  console.error("❌ Quality-Gate nicht bestanden.\n", gate.stdout);
  process.exit(1);
}

// 2) nächste AT-ID bestimmen
function nextId() {
  let max = 0;
  if (fs.existsSync(TICKETS_DIR)) {
    for (const f of fs.readdirSync(TICKETS_DIR)) {
      const m = f.match(/AT-(\d{3})\.md$/);
      if (m) max = Math.max(max, Number(m[1]));
    }
  }
  const n = String(max + 1).padStart(3, "0");
  return `AT-${n}`;
}

// 3) Summary/Owner/Reviewer/Priority extrahieren
const s = fs.readFileSync(ideaFile, "utf8");
function grab(h) {
  const m = s.match(new RegExp(`^##\\s*${h}\\b[\\s\\S]*?(?=^##\\s|$)`, "im"));
  return m ? m[0].replace(/^##.*\n?/, "").trim() : "";
}
const summary = grab("Summary").split(/\n/).filter(Boolean).slice(0, 2).join(" ");
const owner = (s.match(/Owner\s*:\s*(.+)/i) || s.match(/Verantwortlich\s*:\s*(.+)/i) || [])[1]?.trim() || "Stephan";
const reviewer = (s.match(/Reviewer\s*:\s*(.+)/i) || [])[1]?.trim() || "ChatGPT";
const prio = (s.match(/Priority\s*:\s*([0-9]+(\.[0-9]+)?)/i) || [])[1] || "5";

const id = nextId();
const ticketPath = path.join(TICKETS_DIR, `${id}.md`);

const body = `# Ticket ${id}

## Status
planned

## Summary
${summary}

## Owner
${owner}

## Reviewer
${reviewer}

## Priority
${prio}

## Links
- Source Idea: ${ideaFile}
- Matrix: ${MATRIX}
`;

fs.mkdirSync(TICKETS_DIR, { recursive: true });
fs.writeFileSync(ticketPath, body, "utf8");

// 4) Matrixzeile anhängen
let m = fs.readFileSync(MATRIX, "utf8").trimEnd() + "\n";
m += `| ${id} | – | – | ${summary.replace(/\|/g, "/")} | planned | ${prio} | ${owner} | ${reviewer} | C? | – |\n`;
fs.writeFileSync(MATRIX, m, "utf8");

// 5) Idea kennzeichnen (optional)
fs.writeFileSync(`${ideaFile}.promoted`, `Promoted to ${id} @ ${new Date().toISOString()}\n`);
console.log(`🎟  ${id} erzeugt → ${ticketPath}`);
