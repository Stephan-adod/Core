#!/usr/bin/env node
/**
 * Renders artefacts/dashboards/backlog_dashboard_v1.1.md from:
 *  - artefacts/logs/backlog_matrix_v1.0.md
 *  - artefacts/logs/roadmap_v1.0.md
 *  - artefacts/logs/meta/diagnose_backlog_v1.0.json
 * Also writes a JSON snapshot for diff-friendly consumption.
 * Crash-safe: never throws; prints 'status:' lines; exits 0.
 */

import fs from "fs";

const prefer = (p1, p2) => require("fs").existsSync(p1) ? p1 : p2;
const PATHS = {
  matrix: prefer("artefacts/logs/backlog_matrix_v1.1.md","artefacts/logs/backlog_matrix_v1.0.md"),
  roadmap: "artefacts/logs/roadmap_v1.0.md",
  diag: "artefacts/logs/meta/diagnose_backlog_v1.0.json",
  outMd: "artefacts/dashboards/backlog_dashboard_v1.1.md",
  outJson: "artefacts/logs/meta/backlog_dashboard_snapshot_v1.1.json",
  ledger: "artefacts/sync/System_Harmony_Ledger.md",
};

function read(p) { try { return fs.readFileSync(p, "utf8"); } catch { return null; } }
function ensureDirOf(file) {
  const dir = file.split("/").slice(0, -1).join("/");
  if (dir) fs.mkdirSync(dir, { recursive: true });
}

// --- Parse helpers (markdown tables, simple & robust)
function parseMatrix(md) {
  if (!md) return { items: [], warnings: ["matrix missing"] };
  const lines = md.split("\n").filter(l => /^\|/.test(l));
  if (lines.length < 3) return { items: [], warnings: ["matrix table not found"] };
  const rows = lines.slice(2); // skip header & separator
  const warnings = [];
  const items = rows.map(line => {
    const cols = line.split("|").map(s=>s.trim());
    const getNum = (i, label) => {
      const v = Number(cols[i]);
      if (!Number.isFinite(v)) { warnings.push(`Non-numeric ${label} for ${cols[1]} (${cols[i]})`); return 0; }
      return v;
    };
    return {
      ticket: cols[1], layer: cols[2], category: cols[3],
      impact: getNum(4,"impact"),
      trust: getNum(5,"trust"),
      effort: getNum(6,"effort"),
      harmony: getNum(7,"harmony"),
      learning: getNum(8,"learning"),
      priority: Number(cols[9]) || 0,
      status: cols[10] || "backlog"
    };
  }).filter(it => it.ticket && /^[A-Z]+-\d+/.test(it.ticket));
  return { items, warnings };
}

function avg(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }

function parseDiag(json) {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

function parseRoadmap(md) {
  if (!md) return [];
  const sec = md.split("\n").filter(l=>/^\|/.test(l));
  if (sec.length < 3) return [];
  const rows = sec.slice(2);
  return rows.map(r=>{
    const c=r.split("|").map(s=>s.trim());
    return { cycle:c[1], period:c[2], focus:c[3], goals:c[4], tickets:c[5], status:c[6] };
  }).filter(x=>x.cycle && x.cycle!=="Cycle");
}

function mermaidPieFromStatus(counts) {
  const entries = Object.entries(counts);
  const safeEntries = entries.length ? entries : [["empty", 1]];
  const parts = safeEntries.map(([k,v])=>`  "${k}" : ${v}`).join("\n");
  return `pie title Backlog Distribution\n${parts}`;
}

// --- Main
(function main(){
  console.log("status: running | scope=backlog_dashboard_v1_1");

  try {
    const mTxt = read(PATHS.matrix);
    const rTxt = read(PATHS.roadmap);
    const dTxt = read(PATHS.diag);

    const { items, warnings } = parseMatrix(mTxt);
    const diag = parseDiag(dTxt);
    const roadmap = parseRoadmap(rTxt);

    const kpi = {
      impact: Number(avg(items.map((i) => i.impact)).toFixed(1)),
      trust: Number(avg(items.map((i) => i.trust)).toFixed(1)),
      effort: Number(avg(items.map((i) => i.effort)).toFixed(1)),
      harmony: Number(avg(items.map((i) => i.harmony)).toFixed(1)),
      learning: Number(avg(items.map((i) => i.learning)).toFixed(1)),
    };

    // health: prefer diagnose JSON, fallback to items average priority
    const avgPriority = Number(avg(items.map((i) => i.priority)).toFixed(2)) || 0;
    const health = diag?.avg_priority ?? avgPriority;
    const badge = health >= 8.5 ? "🟢" : health >= 7 ? "🟡" : "🔴";

    const statusCounts = items.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {});
    const pie = mermaidPieFromStatus(statusCounts);

    const warningsBlock = warnings.length
      ? `> ⚠️ Data warnings:\n> - ${warnings.join("\n> - ")}\n\n`
      : "";

    const prioritiesTable = (items.length
      ? [...items]
      : [
          {
            ticket: "–",
            layer: "–",
            category: "No entries",
            priority: 0,
            status: "n/a",
          },
        ])
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5)
      .map(
        (i) =>
          `| ${i.ticket} | ${i.layer} | ${i.category} | ${i.priority.toFixed(1)} | ${i.status} |`
      )
      .join("\n");

    const roadmapEntries = roadmap.length
      ? roadmap
      : [{ cycle: "–", period: "–", focus: "No cycles", goals: "", tickets: "", status: "n/a" }];

    const roadmapTable = roadmapEntries
      .map(
        (c) => `| ${c.cycle} | ${c.period} | ${c.focus} | ${c.goals} | ${c.tickets} | ${c.status} |`
      )
      .join("\n");

    const frontMatter = `---\nid: backlog-dashboard-v1.1\nlayer: operational\nowner: Governance Maintainer\nstatus: active\nversion: v1.1\ngovernance: freeze v1.8\nlinked_meta:\n  - artefacts/logs/backlog_matrix_v1.0.md\n  - artefacts/logs/roadmap_v1.0.md\n  - artefacts/logs/meta/diagnose_backlog_v1.0.json\n  - artefacts/sync/System_Harmony_Ledger.md\n---`;

    const md = `${frontMatter}

# 📊 Backlog Dashboard · v1.1 (AI-First Operational View)

## 1️⃣ System Overview

| Kategorie | Wert | Quelle |
|---|---|---|
| **Backlog Health (avg)** | ${health.toFixed(2)} / 10 ${badge} | diagnose_backlog_v1.0.json |
| **Impact-Score (avg)** | ${kpi.impact} | backlog_matrix_v1.0.md |
| **Trust-Score (avg)** | ${kpi.trust} | backlog_matrix_v1.0.md |
| **Effort-Load (avg)** | ${kpi.effort} | backlog_matrix_v1.0.md |

${warningsBlock}## 2️⃣ Prioritäten-Matrix (Top 5)
| Ticket | Layer | Category | Priority | Status |
|---|---|---|---:|---|
${prioritiesTable}

## 3️⃣ Cycle Overview (Roadmap)
| Cycle | Zeitraum | Fokus | Ziele | Tickets | Status |
|---|---|---|---|---|---|
${roadmapTable}

## 4️⃣ Visual Snapshot
\`\`\`mermaid
${pie}
\`\`\`

*Auto-rendered: ${new Date().toISOString()}*`;

    const finalMd = `${md}\n`;

    ensureDirOf(PATHS.outMd);
    fs.writeFileSync(PATHS.outMd, finalMd);

    ensureDirOf(PATHS.outJson);
    fs.writeFileSync(
      PATHS.outJson,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          health,
          badge,
          kpi,
          statusCounts,
          items: items.map((i) => ({ ticket: i.ticket, priority: i.priority, status: i.status })),
        },
        null,
        2
      ) + "\n"
    );

    console.log("status: rendered | file=" + PATHS.outMd);
    console.log("status: snapshot  | file=" + PATHS.outJson);
  } catch (error) {
    const message = error?.message ?? String(error);
    console.log("status: error | message=" + message);
  }

  process.exit(0);
})();
