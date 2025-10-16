#!/usr/bin/env node
/**
 * Repo Diagnose v1.1 (read-only)
 * - Backlog Matrix v1.0 vs v1.1 consistency
 * - Equal score vectors -> equal priority check
 * - Registry presence (ticket_registry_v1.1.md) and set diffs
 * - Dashboard renderer matrix preference
 * - Workflow inventory (no execution)
 * Output: artefacts/logs/repo_diagnose_v1.1.md & .json
 * Exit codes: 0 ok, 2 warnings, 1 blockers
 */
import fs from "fs";
import path from "path";

const OUT_DIR = "artefacts/logs";
const OUT_MD = path.join(OUT_DIR, "repo_diagnose_v1.1.md");
const OUT_JSON = path.join(OUT_DIR, "repo_diagnose_v1.1.json");

const FILES = {
  matrix10: "artefacts/logs/backlog_matrix_v1.0.md",
  matrix11: "artefacts/logs/backlog_matrix_v1.1.md",
  registry:  "artefacts/logs/ticket_registry_v1.1.md",
  dashboard: "artefacts/dashboards/backlog_dashboard_v1.1.md",
  renderer:  "scripts/update_backlog_dashboard.mjs",
  workflows: ".github/workflows"
};

function readIf(p) { try { return fs.readFileSync(p, "utf8"); } catch { return null; } }
function exists(p) { try { fs.accessSync(p); return true; } catch { return false; } }

function parseMatrix(md) {
  if (!md) return { rows: [], tickets: new Map() };
  const lines = md.split("\n");
  // Accept both numeric table and descriptive table; parse rows beginning with "| AT-"
  const rows = lines.filter(l => l.trim().startsWith("| AT-"));
  const tickets = new Map();
  rows.forEach(r => {
    const cols = r.split("|").map(s => s.trim());
    // Try to support both schemas:
    // Schema A (numeric): | AT-xxx | Layer | Cat | Impact | Trust | Effort | Harmony | Learning | Priority | Status |
    // Schema B (descriptive v1.1): ... columns may be shifted; we just map by header guess
    // Best-effort numeric extraction:
    const id = cols[1] || "";
    const impact   = Number(cols.find(c => /^\d+(\.\d+)?$/.test(c) && Number(c) <= 10)) || NaN; // first number
    // try fixed indexes (common v1.0)
    const n = (i)=> Number(cols[i] ?? NaN);
    const byIdx = {
      impact:   n(4),
      trust:    n(5),
      effort:   n(6),
      harmony:  n(7),
      learning: n(8),
      priority: n(9),
      status:   cols[10] ?? cols[5] ?? ""
    };
    // Fallback: scan numbers in row
    const nums = cols.map(c => Number(c)).filter(v => !Number.isNaN(v));
    const guess = {
      impact:   Number.isFinite(byIdx.impact)   ? byIdx.impact   : (nums[0] ?? NaN),
      trust:    Number.isFinite(byIdx.trust)    ? byIdx.trust    : (nums[1] ?? NaN),
      effort:   Number.isFinite(byIdx.effort)   ? byIdx.effort   : (nums[2] ?? NaN),
      harmony:  Number.isFinite(byIdx.harmony)  ? byIdx.harmony  : (nums[3] ?? NaN),
      learning: Number.isFinite(byIdx.learning) ? byIdx.learning : (nums[4] ?? NaN),
      priority: Number.isFinite(byIdx.priority) ? byIdx.priority : NaN,
    };
    tickets.set(id, {
      id,
      row: r,
      impact: guess.impact,
      trust: guess.trust,
      effort: guess.effort,
      harmony: guess.harmony,
      learning: guess.learning,
      priority: guess.priority,
      status: byIdx.status || "",
    });
  });
  return { rows, tickets };
}

function scoreVector(t) {
  return [t.impact, t.trust, t.effort, t.harmony, t.learning]
    .map(v => Number.isFinite(v) ? v.toFixed(2) : "NaN")
    .join("|");
}

function vectorPriorityInconsistencies(tickets) {
  // entries with identical vectors but different numeric priority
  const buckets = new Map();
  for (const t of tickets.values()) {
    const key = scoreVector(t);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(t);
  }
  const issues = [];
  for (const [vec, arr] of buckets.entries()) {
    const prs = arr.map(a => a.priority).filter(p => Number.isFinite(p));
    if (prs.length >= 2) {
      const equal = prs.every(p => p === prs[0]);
      if (!equal) {
        issues.push({
          vector: vec,
          tickets: arr.map(a => ({ id: a.id, priority: a.priority })),
          message: "Same scoring vector but different priorities."
        });
      }
    }
  }
  return issues;
}

// Read files
const m10 = readIf(FILES.matrix10);
const m11 = readIf(FILES.matrix11);
const reg = readIf(FILES.registry);
const dbr = readIf(FILES.dashboard);
const rnd = readIf(FILES.renderer);

const M10 = parseMatrix(m10);
const M11 = parseMatrix(m11);

// Ticket set diffs
const ids10 = new Set([...M10.tickets.keys()]);
const ids11 = new Set([...M11.tickets.keys()]);
const only10 = [...ids10].filter(x => !ids11.has(x));
const only11 = [...ids11].filter(x => !ids10.has(x));
const both   = [...ids10].filter(x => ids11.has(x));

const diffs = [];
only10.forEach(id => diffs.push({ id, area: "matrix", msg: "Present in v1.0, missing in v1.1" }));
only11.forEach(id => diffs.push({ id, area: "matrix", msg: "Present in v1.1, missing in v1.0" }));
both.forEach(id => {
  const a = M10.tickets.get(id);
  const b = M11.tickets.get(id);
  if ((a.status || "").trim() !== (b.status || "").trim()) {
    diffs.push({ id, area: "matrix", msg: `Status differs v1.0='${a.status}' vs v1.1='${b.status}'` });
  }
});

// Priority consistency per matrix
const prIssues10 = vectorPriorityInconsistencies(M10.tickets);
const prIssues11 = vectorPriorityInconsistencies(M11.tickets);

// Registry parse (best effort)
function parseRegistry(md) {
  if (!md) return { ids: [] };
  const ids = md.split("\n").filter(l => l.includes("AT-")).map(l => {
    const m = l.match(/AT-\d+/);
    return m ? m[0] : null;
  }).filter(Boolean);
  return { ids: [...new Set(ids)] };
}
const REG = parseRegistry(reg);
const regOnly = REG.ids.filter(id => !ids10.has(id) && !ids11.has(id));
const matrixOnly = [...new Set([...ids10, ...ids11])].filter(id => !REG.ids.includes(id));

// Renderer: which matrix is referenced?
let rendererPref = "unknown";
if (rnd) {
  if (rnd.includes("backlog_matrix_v1.1.md")) rendererPref = "prefers v1.1";
  else if (rnd.includes("backlog_matrix_v1.0.md")) rendererPref = rendererPref === "prefers v1.1" ? "prefers v1.1 (and v1.0 fallback)" : "prefers v1.0";
}

// Workflows inventory (names & triggers)
function listWorkflows(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map(f => {
      const p = path.join(dir, f);
      const y = readIf(p) || "";
      const hasPush = /on:\s*[\s\S]*push:/.test(y);
      const hasPR   = /on:\s*[\s\S]*pull_request:/.test(y);
      const hasSched= /schedule:/.test(y);
      return { file: p, push: hasPush, pull_request: hasPR, schedule: hasSched };
    });
}
const WF = listWorkflows(FILES.workflows);

// Severity & exit code
const findings = [];
if (!m10 && !m11) findings.push({ id: "M-001", area: "matrix", msg: "No backlog matrix found (v1.0 or v1.1)", severity: "high" });
if (only10.length || only11.length) findings.push({ id: "M-002", area: "matrix", msg: "Ticket set differs between v1.0 and v1.1", severity: "medium", details: { only10, only11 } });
if (prIssues10.length) findings.push({ id: "M-003", area: "priority", msg: "Priority inconsistencies in v1.0", severity: "medium", details: prIssues10 });
if (prIssues11.length) findings.push({ id: "M-004", area: "priority", msg: "Priority inconsistencies in v1.1", severity: "medium", details: prIssues11 });
if (!reg) findings.push({ id: "R-001", area: "registry", msg: "ticket_registry_v1.1.md missing", severity: "low" });
if (reg && regOnly.length) findings.push({ id: "R-002", area: "registry", msg: "Registry contains tickets missing in matrix", severity: "medium", details: regOnly });
if (matrixOnly.length) findings.push({ id: "R-003", area: "registry", msg: "Matrix contains tickets missing in registry", severity: "low", details: matrixOnly });
if (rendererPref === "unknown") findings.push({ id: "D-001", area: "dashboard", msg: "Renderer preference unknown (no reference found)", severity: "low" });

const hasHigh = findings.some(f => f.severity === "high");
const exit_code = hasHigh ? 1 : (findings.length ? 2 : 0);

// Markdown report
const md = [
  "# Repo Diagnose · v1.1",
  "",
  `**Exit:** ${exit_code} (${exit_code===0?"ok":exit_code===2?"warnings":"blockers"})`,
  "",
  "## Summary",
  `- Matrix v1.0 present: ${!!m10}`,
  `- Matrix v1.1 present: ${!!m11}`,
  `- Tickets v1.0: ${M10.tickets.size} | v1.1: ${M11.tickets.size}`,
  `- Registry present: ${!!reg} | Tickets detected: ${REG.ids.length}`,
  `- Renderer matrix preference: ${rendererPref}`,
  "",
  "## Differences v1.0 ↔ v1.1",
  only10.length ? `- Only in v1.0: ${only10.join(", ")}` : "- Only in v1.0: —",
  only11.length ? `- Only in v1.1: ${only11.join(", ")}` : "- Only in v1.1: —",
  diffs.filter(d => d.msg.startsWith("Status differs")).length
    ? `- Status diffs: ${diffs.filter(d => d.msg.startsWith("Status differs")).map(d => d.id).join(", ")}`
    : "- Status diffs: —",
  "",
  "## Priority consistency (equal vectors should share priority)",
  prIssues10.length ? `- v1.0 issues: ${prIssues10.length}` : "- v1.0 issues: 0 ✅",
  prIssues11.length ? `- v1.1 issues: ${prIssues11.length}` : "- v1.1 issues: 0 ✅",
  "",
  "## Registry alignment",
  regOnly.length ? `- Registry only: ${regOnly.join(", ")}` : "- Registry only: —",
  matrixOnly.length ? `- Matrix only: ${matrixOnly.join(", ")}` : "- Matrix only: —",
  "",
  "## Workflow inventory (metadata)",
  ...WF.map(w => `- ${w.file} → triggers: ${[
    w.push?"push":null, w.pull_request?"pull_request":null, w.schedule?"schedule":null
  ].filter(Boolean).join(", ") || "none"}`),
  "",
  "## Findings",
  findings.length ? findings.map(f => `- [${f.severity}] ${f.area} · ${f.id}: ${f.msg}`).join("\n") : "- none ✅",
  "",
  "## Suggested next steps (non-destructive)",
  "- Pick a single source of truth for the backlog matrix (prefer v1.1 or v1.0), and align the other.",
  "- For identical score vectors, harmonize the priority values (or move to computed priority in renderer later).",
  "- Ensure the dashboard renderer points to the intended matrix (prefer v1.1 with v1.0 fallback).",
  "- Align registry tickets with matrix (add missing or prune placeholders).",
  ""
].join("\n");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_MD, md);
fs.writeFileSync(OUT_JSON, JSON.stringify({
  exit_code,
  matrices: { has_v1_0: !!m10, has_v1_1: !!m11, size_v1_0: M10.tickets.size, size_v1_1: M11.tickets.size },
  only10, only11, status_diffs: diffs.filter(d => d.msg.startsWith("Status differs")),
  priority_issues: { v1_0: prIssues10, v1_1: prIssues11 },
  registry: { present: !!reg, tickets: REG.ids.length, registry_only: regOnly, matrix_only: matrixOnly },
  renderer: rendererPref,
  workflows: WF,
  findings
}, null, 2));
console.log(md);
process.exit(exit_code);
