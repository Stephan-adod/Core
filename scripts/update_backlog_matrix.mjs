#!/usr/bin/env node
import fs from "fs";
import path from "path";

const LIVE_MATRIX = "artefacts/logs/backlog_matrix_v1.8.md";
const DEFAULT_PROPOSED = "artefacts/staging/backlog_matrix_v1.8.proposed.md";
const DIFF_DIR = "artefacts/logs/diagnostics";
const GOV_TICKET = "tickets/GOV-004.md";

function parseArgs(argv) {
  const args = { write: false, accept: false, proposed: DEFAULT_PROPOSED };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "--write") {
      args.write = true;
    } else if (token === "--accept") {
      args.accept = true;
    } else if (token === "--proposed") {
      const next = argv[++i];
      if (!next) throw new Error("--proposed requires a path");
      args.proposed = next;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  return args;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (dir && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readLiveMatrix() {
  try {
    return fs.readFileSync(LIVE_MATRIX, "utf8");
  } catch (err) {
    throw new Error(`Failed to read live matrix at ${LIVE_MATRIX}: ${err.message}`);
  }
}

function extractTableLines(md) {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*\|/.test(line));
  if (start === -1) {
    throw new Error("Could not find markdown table in live matrix");
  }
  let end = start;
  while (end < lines.length && /^\s*\|/.test(lines[end])) {
    end += 1;
  }
  return { lines, start, end, tableLines: lines.slice(start, end) };
}

function parseRows(tableLines) {
  if (tableLines.length < 2) {
    throw new Error("Table missing header/separator rows");
  }
  const headerCells = tableLines[0].split("|").slice(1, -1).map((c) => c.trim());
  const separator = tableLines[1];
  const rowLines = tableLines.slice(2).filter((line) => /^\s*\|/.test(line));
  const rows = rowLines.map((line) => {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    const id = cells[0];
    return { id, cells };
  });
  return { headerCells, separator, rows };
}

function padRow(row, targetLength) {
  while (row.cells.length < targetLength) {
    row.cells.push("—");
  }
  if (row.cells.length > targetLength) {
    row.cells.length = targetLength;
  }
}

function applyRowUpdates(rowMap, rows) {
  const idx = {
    id: 0,
    layer: 1,
    workstream: 2,
    title: 3,
    effort: 4,
    impact: 5,
    confidence: 6,
    priority: 7,
    status: 8,
    owner: 9,
    notes: 10,
    policy: 11,
    phase: 12,
    proof: 13,
  };

  const row003 = rowMap.get("AT-003");
  if (row003) {
    row003.cells[idx.title] = "Automation Proof Pipeline";
    row003.cells[idx.policy] = "Automation · Quality";
    row003.cells[idx.phase] = "Refinement";
    row003.cells[idx.proof] = "artefacts/logs/proof_pipeline_v1.8.md";
  }

  const row005 = rowMap.get("AT-005");
  if (row005) {
    row005.cells[idx.title] = "Trust Probe Validator v1.8";
    row005.cells[idx.policy] = "Ledger Freeze Gate · Harmony";
    if (!row005.cells[idx.phase] || row005.cells[idx.phase] === "—") {
      row005.cells[idx.phase] = row005.cells[idx.status] || "ready";
    }
  }

  const row004 = rowMap.get("AT-004");
  if (row004) {
    row004.cells[idx.layer] = "Docs / Maintenance";
    row004.cells[idx.status] = "parked";
    row004.cells[idx.priority] = "low";
    row004.cells[idx.title] = "Docs-Lite Maintenance & Lint Fixes";
    row004.cells[idx.policy] = "—";
  }

  const row007 = rowMap.get("AT-007");
  if (row007) {
    row007.cells[idx.layer] = "Legacy";
    row007.cells[idx.status] = "archived";
    row007.cells[idx.priority] = "none";
    row007.cells[idx.title] = "Meta-Sync Fixes (v1.6 → v1.7)";
    row007.cells[idx.policy] = "—";
  }

  if (!rowMap.has("AT-009")) {
    const newRow = {
      id: "AT-009",
      cells: [
        "AT-009",
        "Meta / Governance",
        "Governance",
        "Ledger Validation & Freeze-Prep v1.8",
        "—",
        "—",
        "—",
        "High",
        "next",
        "Stephan + Codex App",
        "—",
        "Harmony · Ledger Freeze Gate · Quality",
        "Rebrief → Stabilization",
        "artefacts/logs/system_harmony_report_v1.8.md",
      ],
    };
    rows.push(newRow);
    rowMap.set("AT-009", newRow);
  }
}

function renderTable(headerCells, rows) {
  const header = `| ${headerCells.join(" | ")} |`;
  const separator = `|${headerCells.map(() => "---").join("|")}|`;
  const rowLines = rows.map((row) => `| ${row.cells.join(" | ")} |`);
  return [header, separator, ...rowLines];
}

function buildProposedMatrix(liveText) {
  const { lines, start, end, tableLines } = extractTableLines(liveText);
  const { headerCells, rows } = parseRows(tableLines);
  const extendedHeader = [...headerCells, "Policy-Bezug", "Phase", "Proof-Artefakt"];
  const targetLength = extendedHeader.length;

  const rowMap = new Map();
  for (const row of rows) {
    padRow(row, headerCells.length);
    row.cells.push("—", "—", "—");
    padRow(row, targetLength);
    if (row.id) {
      rowMap.set(row.id, row);
    }
  }

  applyRowUpdates(rowMap, rows);

  const renderedTable = renderTable(extendedHeader, rows);
  const updatedLines = [
    ...lines.slice(0, start),
    ...renderedTable,
    ...lines.slice(end),
  ];

  return {
    headerCells,
    extendedHeader,
    rows,
    content: updatedLines.join("\n"),
  };
}

function writeFile(target, data) {
  ensureDir(target);
  fs.writeFileSync(target, data);
}

function writeDiffReport(originalHeader, extendedHeader, updatedRows) {
  const date = new Date().toISOString().slice(0, 10);
  const diffPath = path.join(DIFF_DIR, `backlog_schema_diff_${date}.md`);
  ensureDir(diffPath);
  const headerBefore = originalHeader.join(" | ");
  const headerAfter = extendedHeader.join(" | ");
  const changedTickets = [];
  const tracked = new Set(["AT-003", "AT-004", "AT-005", "AT-007", "AT-009"]);
  for (const row of updatedRows) {
    if (tracked.has(row.id)) {
      changedTickets.push(row.id);
    }
  }
  const diffLines = [
    `# Backlog Schema Diff · ${date}`,
    "",
    "## Header",
    `- ${headerBefore}`,
    `+ ${headerAfter}`,
    "",
    "## Columns Added",
    "- Policy-Bezug",
    "- Phase",
    "- Proof-Artefakt",
    "",
    "## Ticket Updates",
    ...changedTickets.map((id) => `- ${id}`),
    "",
    "> Generated by scripts/update_backlog_matrix.mjs",
  ];
  writeFile(diffPath, diffLines.join("\n"));
  return diffPath;
}

function ensureGovTicket() {
  if (fs.existsSync(GOV_TICKET)) {
    return false;
  }
  const ticketLines = [
    "# Ticket GOV-004: Backlog Matrix Governance",
    "",
    "## Summary",
    "- Pending governance review",
    "",
    "## Scope",
    "- Pending",
    "",
    "## Impact",
    "- Pending",
    "",
    "## Notes",
    "- Created by scripts/update_backlog_matrix.mjs",
  ];
  writeFile(GOV_TICKET, ticketLines.join("\n"));
  return true;
}

function acceptProposed(proposedPath) {
  if (!fs.existsSync(proposedPath)) {
    console.error(`Proposed file missing: ${proposedPath}`);
    process.exitCode = 1;
    return;
  }
  const data = fs.readFileSync(proposedPath, "utf8");
  writeFile(LIVE_MATRIX, data);
  console.log(`status: accepted proposed matrix -> ${LIVE_MATRIX}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.accept) {
    acceptProposed(args.proposed);
    return;
  }

  if (!args.write) {
    console.log("status: dry-run (no --write provided)");
    return;
  }

  console.log("status: preparing proposed backlog matrix");
  const liveText = readLiveMatrix();
  const { headerCells, extendedHeader, rows, content } = buildProposedMatrix(liveText);
  writeFile(args.proposed, content);
  console.log(`status: wrote proposed matrix -> ${args.proposed}`);

  const diffPath = writeDiffReport(headerCells, extendedHeader, rows);
  console.log(`status: wrote schema diff -> ${diffPath}`);

  const createdTicket = ensureGovTicket();
  if (createdTicket) {
    console.log(`status: created governance ticket -> ${GOV_TICKET}`);
  } else {
    console.log(`status: governance ticket already present -> ${GOV_TICKET}`);
  }

  console.log("status: governance review required (exit 2)");
  process.exitCode = 2;
}

main();
