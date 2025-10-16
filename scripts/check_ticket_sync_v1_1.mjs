#!/usr/bin/env node
/**
 * Mini Sync Check · v1.1
 * Reads ticket_registry_v1.1.md, backlog_matrix_v1.1.md, backlog_dashboard_v1.1.md
 * → Reports alignment across files.
 * Exit code: 0 (ok), 2 (warning)
 */

import fs from "fs";

const FILES = {
  registry: "artefacts/logs/ticket_registry_v1.1.md",
  backlog: "artefacts/logs/backlog_matrix_v1.1.md",
  dashboard: "artefacts/dashboards/backlog_dashboard_v1.1.md",
  outMd: "artefacts/logs/ticket_sync_check_v1.1.md",
  outJson: "artefacts/logs/ticket_sync_check_v1.1.json",
};

function read(p) {
  try { return fs.readFileSync(p, "utf8"); }
  catch { console.error(`Missing: ${p}`); return ""; }
}

function parseTickets(md) {
  const rows = md.split("\n").filter(l => l.startsWith("| AT-"));
  return rows.map(r => {
    const cols = r.split("|").map(s => s.trim());
    return {
      id: cols[1],
      title: cols[2] || "",
      status: cols[5] || cols[9] || "",
    };
  }).filter(t => /^AT-\d+/.test(t.id));
}

function unique(arr) {
  return [...new Set(arr)];
}

const reg = parseTickets(read(FILES.registry));
const bl  = parseTickets(read(FILES.backlog));
const db  = parseTickets(read(FILES.dashboard));

const regIDs = reg.map(t => t.id);
const blIDs  = bl.map(t => t.id);
const dbIDs  = db.map(t => t.id);

const all = unique([...regIDs, ...blIDs, ...dbIDs]);
const findings = [];

for (const id of all) {
  if (!regIDs.includes(id))
    findings.push({id, area:"registry", msg:"Fehlt in Registry"});
  if (!blIDs.includes(id))
    findings.push({id, area:"backlog", msg:"Fehlt in Backlog"});
  if (!dbIDs.includes(id))
    findings.push({id, area:"dashboard", msg:"Fehlt im Dashboard"});
}

const dups = all.filter((id, i) => all.indexOf(id) !== i);
for (const d of unique(dups))
  findings.push({id:d, area:"all", msg:"Doppelte ID"});

const exit = findings.some(f => f.msg.includes("Fehlt")) ? 2 : 0;

const md = [
  "# Ticket Sync Check · v1.1",
  "",
  `**Exit:** ${exit} (${exit===0?"ok":"warnings"})`,
  "",
  "## Findings",
  findings.length ? findings.map(f => `- ${f.id} · ${f.area}: ${f.msg}`).join("\n") : "- none ✅",
  "",
  "## Summary",
  `Registry Tickets: ${regIDs.length}`,
  `Backlog Tickets: ${blIDs.length}`,
  `Dashboard Tickets: ${dbIDs.length}`,
].join("\n");

fs.mkdirSync("artefacts/logs", {recursive:true});
fs.writeFileSync(FILES.outMd, md);
fs.writeFileSync(FILES.outJson, JSON.stringify({exit, findings}, null, 2));
console.log(md);
process.exit(exit);
