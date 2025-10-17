#!/usr/bin/env node
/**
 * Analyze Git "work sessions" by grouping commits with inactivity gaps.
 * Default: gap >= 120 minutes -> new session.
 * Writes a Markdown report + JSON with commit→session mapping and ticket rollups.
 *
 * Usage:
 *   node scripts/analyze_sessions.mjs --threshold-min=120 --min-session-min=10 --since="2025-09-01"
 *
 * Notes:
 * - Uses --date=iso-strict for reliable parsing.
 * - Timezone: uses system TZ (set to Europe/Berlin in CI if needed).
 */

import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const THRESHOLD_MIN = Number(args["threshold-min"] ?? 120); // inactivity gap
const MIN_SESSION_MIN = Number(args["min-session-min"] ?? 0); // clamp short sessions
const SINCE = args["since"]; // optional: YYYY-MM-DD
const UNTIL = args["until"]; // optional

const rangeSince = SINCE ? ` --since="${SINCE}"` : "";
const rangeUntil = UNTIL ? ` --until="${UNTIL}"` : "";
const prettyFormat = "%H|%ad|%an|%ae|%s";
const gitCmd = `git log --all --reverse --pretty=format:'${prettyFormat}' --date=iso-strict${rangeSince}${rangeUntil}`;

let raw;
try {
  raw = execSync(gitCmd, { encoding: "utf8" });
} catch (e) {
  console.error("Failed to read git log:", e.message);
  process.exit(2);
}

const lines = raw.split("\n").filter(Boolean);
if (!lines.length) {
  console.log("No commits found for given range.");
  process.exit(0);
}

function parseLine(l) {
  const [hash, dateIso, author, email, ...rest] = l.split("|");
  const subject = rest.join("|");
  const date = new Date(dateIso);
  return { hash, dateIso, date, author, email, subject };
}

const TICKET_RE = /\b([A-Z]{2,5}-\d{1,4})\b/g;
const commits = lines.map(parseLine);

const sessions = [];
let current = null;

function minutesBetween(a, b) {
  return Math.abs((b.getTime() - a.getTime()) / 60000);
}

for (const c of commits) {
  if (!current) { current = { start: c.date, end: c.date, commits: [c] }; continue; }
  const gap = minutesBetween(current.end, c.date);
  if (gap >= THRESHOLD_MIN) {
    let dur = minutesBetween(current.start, current.end);
    if (dur < MIN_SESSION_MIN) dur = MIN_SESSION_MIN;
    current.durationMin = Math.round(dur);
    sessions.push(current);
    current = { start: c.date, end: c.date, commits: [c] };
  } else {
    current.end = c.date;
    current.commits.push(c);
  }
}
if (current) {
  let dur = minutesBetween(current.start, current.end);
  if (dur < MIN_SESSION_MIN) dur = MIN_SESSION_MIN;
  current.durationMin = Math.round(dur);
  sessions.push(current);
}

const totalSessions = sessions.length;
const totalMinutes = sessions.reduce((s, x) => s + x.durationMin, 0);
const avgSessionMin = totalSessions ? Math.round(totalMinutes / totalSessions) : 0;

const ticketRollup = new Map();
for (const s of sessions) {
  const seenTickets = new Map();
  for (const c of s.commits) {
    const matches = [...(c.subject.matchAll(TICKET_RE) ?? [])].map((m) => m[1]);
    for (const t of matches) seenTickets.set(t, (seenTickets.get(t) ?? 0) + 1);
  }
  const totalMentions = [...seenTickets.values()].reduce((a, b) => a + b, 0);
  if (totalMentions > 0) {
    for (const [t, cnt] of seenTickets) {
      const share = (s.durationMin * cnt) / totalMentions;
      const cur = ticketRollup.get(t) ?? { minutes: 0, sessions: 0, commits: 0 };
      ticketRollup.set(t, {
        minutes: cur.minutes + share,
        sessions: cur.sessions + 1,
        commits: cur.commits + s.commits.length,
      });
    }
  }
}

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, "0");
const d = String(now.getDate()).padStart(2, "0");
const mdName = `artefacts/logs/time_sessions_${y}-${m}-${d}.md`;
const jsonName = `artefacts/data/time_sessions.json`;

for (const dir of ["artefacts/logs", "artefacts/data"]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function fmt(dt) { return dt.toISOString(); }
function fmtMin(min) {
  const h = Math.floor(min / 60);
  const mm = Math.round(min % 60);
  return `${h}h ${String(mm).padStart(2, "0")}m`;
}

let md = `# Time Sessions Report\n\n`;
md += `**Generated:** ${fmt(now)}\n\n`;
md += `**Params:** threshold=${THRESHOLD_MIN} min, min_session=${MIN_SESSION_MIN} min, since=${SINCE ?? "–"}, until=${UNTIL ?? "–"}\n\n`;
md += `## Summary\n\n`;
md += `- Sessions: ${totalSessions}\n`;
md += `- Total active time: ${fmtMin(totalMinutes)}\n`;
md += `- Avg session: ${fmtMin(avgSessionMin)}\n\n`;

md += `## Sessions\n\n`;
md += `| # | Start | End | Duration | Commits |\n`;
md += `|---:|---|---|---:|---:|\n`;
sessions.forEach((s, i) => {
  md += `| ${i + 1} | ${fmt(s.start)} | ${fmt(s.end)} | ${fmtMin(s.durationMin)} | ${s.commits.length} |\n`;
});

md += `\n## Ticket Rollup (heuristic)\n\n`;
if (ticketRollup.size === 0) {
  md += `*(no ticket mentions found in commit subjects)*\n`;
} else {
  md += `| Ticket | Time | Sessions | Commits (in sessions) |\n`;
  md += `|:--|--:|--:|--:|\n`;
  [...ticketRollup.entries()]
    .sort((a, b) => b[1].minutes - a[1].minutes)
    .forEach(([t, v]) => {
      md += `| ${t} | ${fmtMin(v.minutes)} | ${v.sessions} | ${v.commits} |\n`;
    });
}

writeFileSync(mdName, md, "utf8");

const json = {
  generatedAt: fmt(now),
  params: { thresholdMin: THRESHOLD_MIN, minSessionMin: MIN_SESSION_MIN, since: SINCE ?? null, until: UNTIL ?? null },
  totals: { sessions: totalSessions, minutes: totalMinutes, avgSessionMin },
  sessions: sessions.map((s, i) => ({
    index: i + 1,
    start: fmt(s.start),
    end: fmt(s.end),
    durationMin: s.durationMin,
    commits: s.commits.map((c) => ({ hash: c.hash, date: c.dateIso, author: c.author, email: c.email, subject: c.subject })),
  })),
  ticketRollup: Object.fromEntries(
    [...ticketRollup.entries()].map(([t, v]) => [t, { minutes: Math.round(v.minutes), sessions: v.sessions, commits: v.commits }])
  ),
};

writeFileSync(jsonName, JSON.stringify(json, null, 2), "utf8");

console.log(`Wrote ${mdName}`);
console.log(`Wrote ${jsonName}`);
