import fs from "fs";

const file = "artefacts/logs/backlog_matrix_v1.1.md";
let s = fs.readFileSync(file, "utf8");

// desired header (11 columns)
const headerDesired = "| Ticket | Layer | Initiative | Beschreibung | Status | Priorität | Owner | Reviewer | Zyklus | Aufwand | Notizen |";
const dashLine = "|" + Array(11).fill("---").join("|") + "|";

const lines = s.split("\n");
let firstPipe = lines.findIndex(l => /^\s*\|/.test(l));
if (firstPipe === -1) {
  if (s[s.length-1] !== "\n") s += "\n";
  s += headerDesired + "\n" + dashLine + "\n";
  fs.writeFileSync(file, s);
  console.log("Injected new table header/trenner (no header found).");
  process.exit(0);
}

lines[firstPipe] = headerDesired;
if (firstPipe + 1 >= lines.length) {
  lines.push(dashLine);
} else {
  lines[firstPipe + 1] = dashLine;
}

for (let i = firstPipe + 2; i < lines.length; i++) {
  if (!/^\s*\|/.test(lines[i])) continue;
  let cells = lines[i].split("|").slice(1, -1).map(c => c.trim());
  while (cells.length < 11) cells.push("–");
  while (cells.length > 11) cells.pop();

  if (!/^(backlog|planned|ready|doing|running|review|done|blocked)$/i.test(cells[4])) {
    cells[4] = cells[4] === "–" ? "planned" : cells[4];
  }
  if (!/^(\d+(\.\d+)?|–|-)$/.test(cells[5])) cells[5] = "–";
  if (cells[6] === "–" || cells[6] === "") cells[6] = "Stephan";
  if (cells[7] === "–" || cells[7] === "") cells[7] = "ChatGPT";
  if (!/^([SML]|–|-|\d+(\.\d+)?)$/.test(cells[9])) cells[9] = "–";

  lines[i] = "| " + cells.join(" | ") + " |";
}

fs.writeFileSync(file, lines.join("\n"));
console.log("Normalized matrix to 11 columns with proper header & separator.");
