#!/usr/bin/env node
/**
 * Roadmap generator from session telemetry + backlog matrix.
 * Inputs:
 *   - artefacts/data/time_sessions.json
 *   - artefacts/logs/backlog_matrix_v1.8.md  (if present)
 * Outputs:
 *   - artefacts/data/ticket_time_rollup.json
 *   - artefacts/logs/ticket_time_rollup_YYYY-MM-DD.md
 *   - meta/roadmap_v1.9_auto.md  (informational, governance-neutral)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SESS = "artefacts/data/time_sessions.json";
const BACKLOG = "artefacts/logs/backlog_matrix_v1.8.md";

// ---------- helpers ----------
const TICKET_RE = /\b([A-Z]{2,5}-\d{1,4})\b/;

function fmtMin(min=0){const m=Math.max(0,Math.round(min));const h=Math.floor(m/60);const mm=String(m%60).padStart(2,"0");return `${h}h ${mm}m`;}
function toISO(d){return new Date(d).toISOString();}
function trim(s){return String(s||"").trim();}
function todayStr(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const dd=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${dd}`;}

// ---------- load session telemetry ----------
if(!existsSync(SESS)){
  console.log(`No ${SESS} found. Run analyze_sessions first. Exiting 0.`);
  process.exit(0);
}
const sessData = JSON.parse(readFileSync(SESS,"utf8"));
const sessions = Array.isArray(sessData.sessions)? sessData.sessions : [];
const totals = sessData.totals || { minutes:0, sessions:0, avgSessionMin:0 };
const ticketRoll = sessData.ticketRollup || {};
// compute velocity (hours/day) from active days in window
const uniqueDays = new Set(sessions.map(s => toISO(s.start).slice(0,10)));
const activeDays = Math.max(1, uniqueDays.size);
const velocityHoursPerDay = (totals.minutes/60)/activeDays;

// ---------- parse backlog matrix (best-effort) ----------
const backlog = {};
if (existsSync(BACKLOG)) {
  const text = readFileSync(BACKLOG, "utf8");
  const lines = text.split(/\r?\n/);
  for(const line of lines){
    if(!line.startsWith("|")) continue;
    if(!line.includes("AT-") && !line.match(/\b[A-Z]{2,5}-\d{1,4}\b/)) continue;
    // naive split of markdown row
    const cells = line.split("|").map(trim).filter(x=>x!="");
    // find first cell that looks like a ticket id
    let id = cells.find(c => TICKET_RE.test(c));
    if(!id) continue;
    id = (id.match(TICKET_RE)||[])[1];
    // heuristics: derive status/layer/title if present
    const status = (cells.find(c => /done|running|todo|blocked|review/i.test(c)) || "").toLowerCase();
    const layer  = (cells.find(c => /meta|product|foundation|life|docs|ops/i.test(c)) || "");
    // title: pick first non-id, non-status-ish cell with words
    let title = cells.find(c => c !== id && !/done|running|todo|blocked|review/i.test(c) && c.length>1) || "";
    backlog[id] = { id, status, layer, title };
  }
}

// ---------- build ticket list with telemetry ----------
const totalMinutes = totals.minutes || 0;
const tickets = [];
let unassignedMin = 0;
let unassignedSessions = 0;

for (const [id, v] of Object.entries(ticketRoll)) {
  const minutes = Number(v.minutes||0);
  const sessionsCount = Number(v.sessions||0);
  const commitsInSessions = Number(v.commits||0);
  const focusRatio = totalMinutes>0 ? (minutes/totalMinutes) : 0;
  const meta = backlog[id] || { id, status: "unknown", layer: "", title: "" };
  tickets.push({
    id,
    minutes: Math.round(minutes),
    sessions: sessionsCount,
    commits: commitsInSessions,
    focusRatio,
    status: meta.status || "unknown",
    layer: meta.layer||"",
    title: meta.title||""
  });
}

// estimate "unassigned" from sessions without ticket mentions in session analyzer JSON
// our analyzer stores only assigned minutes; approximate unassigned as difference to sum
const assignedSum = tickets.reduce((a,t)=>a + t.minutes, 0);
unassignedMin = Math.max(0, Math.round(totalMinutes - assignedSum));

// sessions that might be unassigned: rough heuristic (not stored); keep 0 by default
unassignedSessions = 0;

tickets.sort((a,b)=> b.minutes - a.minutes);

// ---------- write JSON rollup ----------
const rollup = {
  generatedAt: new Date().toISOString(),
  window: sessData.params?.since || sessData.params?.until ? {
    since: sessData.params?.since || null,
    until: sessData.params?.until || null
  } : null,
  totals: {
    sessions: totals.sessions || sessions.length,
    minutes: totalMinutes,
    avgSessionMin: totals.avgSessionMin || 0
  },
  velocity: {
    activeDays,
    hoursPerDay: Number(velocityHoursPerDay.toFixed(2))
  },
  tickets,
  unassigned: { minutes: unassignedMin, sessions: unassignedSessions }
};
writeFileSync("artefacts/data/ticket_time_rollup.json", JSON.stringify(rollup,null,2), "utf8");

// ---------- write Markdown report ----------
const today = todayStr();
let md = `# Ticket Time Rollup\n\n`;
md += `**Generated:** ${rollup.generatedAt}\n\n`;
md += `## Summary\n\n`;
md += `- Total active time: ${fmtMin(totalMinutes)}\n`;
md += `- Sessions: ${rollup.totals.sessions}\n`;
md += `- Active days: ${activeDays}\n`;
md += `- Velocity: ${rollup.velocity.hoursPerDay} h/day\n`;
md += `- Unassigned: ${fmtMin(unassignedMin)}\n\n`;

md += `## Top Tickets (by time)\n\n`;
if (tickets.length===0){
  md += `*(no ticket time recorded in this window)*\n`;
} else {
  md += `| Ticket | Effort | Sessions | Focus % | Status | Layer | Title |\n`;
  md += `|:--|--:|--:|--:|:--|:--|:--|\n`;
  for (const t of tickets.slice(0, 15)) {
    md += `| ${t.id} | ${fmtMin(t.minutes)} | ${t.sessions} | ${(t.focusRatio*100).toFixed(1)} | ${t.status||""} | ${t.layer||""} | ${t.title||""} |\n`;
  }
}
const reportPath = `artefacts/logs/ticket_time_rollup_${today}.md`;
writeFileSync(reportPath, md, "utf8");

// ---------- derive adaptive roadmap (informational) ----------
function pick(arr, fn){ return arr.filter(fn); }
function toHours(min){ return Math.round(min)/60; }

const running = pick(tickets, t => /running|review|blocked/.test(t.status));
const todo    = pick(tickets, t => /todo|backlog|new/.test(t.status));
const done    = pick(tickets, t => /done|closed/.test(t.status));
const unknown = pick(tickets, t => t.status==="unknown");

const byFocus = (a,b)=> b.focusRatio - a.focusRatio;
running.sort(byFocus); todo.sort(byFocus); unknown.sort(byFocus);

function sumH(list){ return Number((list.reduce((s,t)=>s + toHours(t.minutes),0)).toFixed(1)); }

const phase1 = running.slice(0, 6);
const phase2 = (todo.length? todo: unknown).slice(0, 8);
const phase3 = (todo.length>8? todo.slice(8): unknown.slice(8, 20));

function etaDays(totalHours){
  const v = Math.max(0.1, rollup.velocity.hoursPerDay);
  return Math.ceil(totalHours / v);
}

const p1h = sumH(phase1), p2h = sumH(phase2), p3h = sumH(phase3);
const p1eta = etaDays(p1h), p2eta = etaDays(p2h), p3eta = etaDays(p3h);

// write roadmap
let r = `# Adaptive Roadmap · v1.9 (autogenerated)\n\n`;
r += `**Window:** ${
  rollup.window ? `${rollup.window.since||"–"} → ${rollup.window.until||"now"}` : "latest telemetry"
}\n\n`;
r += `**Velocity:** ${rollup.velocity.hoursPerDay} h/day · **Active days:** ${activeDays}\n\n`;

function tableFor(phaseName, items, totalH, eta){
  let s = `## ${phaseName}\n\n`;
  if (items.length===0){ s+= `*(no items)*\n\n`; return s; }
  s += `Total Effort: ${totalH} h · Forecast: ~${eta} days (informational)\n\n`;
  s += `| Ticket | Effort[h] | Sessions | Focus % | Status | Layer | Title |\n`;
  s += `|:--|--:|--:|--:|:--|:--|:--|\n`;
  for (const t of items){
    s += `| ${t.id} | ${(t.minutes/60).toFixed(1)} | ${t.sessions} | ${(t.focusRatio*100).toFixed(1)} | ${t.status||""} | ${t.layer||""} | ${t.title||""} |\n`;
  }
  s += `\n`;
  return s;
}

r += tableFor("Phase 1 · Finish Running / Current Focus", phase1, p1h, p1eta);
r += tableFor("Phase 2 · Next Up (Todo / Unknown)", phase2, p2h, p2eta);
r += tableFor("Phase 3 · Later", phase3, p3h, p3eta);

const roadmapPath = "meta/roadmap_v1.9_auto.md";
writeFileSync(roadmapPath, r, "utf8");

console.log(`Wrote ${reportPath}`);
console.log(`Wrote artefacts/data/ticket_time_rollup.json`);
console.log(`Wrote ${roadmapPath}`);
