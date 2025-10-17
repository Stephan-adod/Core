#!/usr/bin/env node
/**
 * validate_loop_state.mjs  ·  v1.8 (Refinement)
 * Purpose: Prüft Tickets auf AI-First-Loop-Konsistenz (Frontmatter & Pflichtabschnitte)
 * Output: artefacts/logs/loop_governance_report.md / .json
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TICKET_DIR = path.join(ROOT, 'tickets');
const LOG_DIR = path.join(ROOT, 'artefacts', 'logs');
await fs.mkdir(LOG_DIR, { recursive: true });

const files = (await fs.readdir(TICKET_DIR)).filter(f => f.match(/^AT-\d+\.md$/));
const findings = [];
const MATRIX_PATH = path.join(ROOT, 'artefacts', 'logs', 'backlog_matrix_v1.8.md');
let matrixText = '';
try {
  matrixText = await fs.readFile(MATRIX_PATH, 'utf8');
} catch {
  matrixText = '';
}

function phaseFromMatrix(ticket) {
  if (!matrixText) return null;
  const id = ticket.replace('.md', '').toUpperCase();
  const row = matrixText.split('\n').find(l => new RegExp(`\\|\\s*${id}\\s*\\|`).test(l));
  if (!row) return null;
  const cols = row.split('|').map(s => s.trim());
  const status = (cols[9] || '').toLowerCase();
  const map = { idea: 'idea', ready: 'ready', doing: 'doing', review: 'review', blocked: 'blocked', done: 'done' };
  return map[status] || null;
}
const requiredSections = [
  /^# Ticket AT-\d+:/m,
  /^## Context/m,
  /^## Outcome Target/m,
  /^## Definition of Ready/m,
  /^## Definition of Done/m,
  /^## Proof of Learning/m
];

for (const f of files) {
  const full = path.join(TICKET_DIR, f);
  const content = await fs.readFile(full, 'utf8');
  const miss = requiredSections.filter(r => !r.test(content)).map(r => r.toString());
  let phase = (content.match(/phase:\s*(\w+)/)?.[1]) || null;
  if (!phase) {
    phase = phaseFromMatrix(f) || 'unknown';
  }
  const gate = (content.match(/##\s*Transitions/m)) ? 'defined' : 'missing';
  findings.push({ ticket: f, phase, gate, missingSections: miss });
}

const md = [
  '# Loop Governance Report · v1.8 (Refinement)',
  '',
  '| Ticket | Phase | Gate | Missing Sections |',
  '|--------|--------|------|------------------|',
  ...findings.map(f => `| ${f.ticket} | ${f.phase} | ${f.gate} | ${f.missingSections.length ? f.missingSections.join('<br>') : '—'} |`)
].join('\n') + '\n';

const json = JSON.stringify({ version:'v1.8', timestamp:new Date().toISOString(), findings }, null, 2);
await fs.writeFile(path.join(LOG_DIR, 'loop_governance_report.md'), md);
await fs.writeFile(path.join(LOG_DIR, 'loop_governance_report.json'), json);

console.log(`✓ Loop Governance Report created (${findings.length} tickets checked).`);
