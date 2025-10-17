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
  const phase = (content.match(/phase:\s*(\w+)/)?.[1]) || 'unknown';
  const gate = (content.match(/##\s*Transitions/m)) ? 'defined' : 'missing';
  findings.push({ ticket: f, phase, gate, missingSections: miss });
}

const md = [
  '# Loop Governance Report · v1.8 (Refinement)',
  '',
  '| Ticket | Phase | Gate | Missing Sections |',
  '|--------|--------|------|------------------|',
  ...findings.map(f => `| ${f.ticket} | ${f.phase} | ${f.gate} | ${f.missingSections.length ? f.missingSections.join('<br>') : '—'} |`)
].join('\n');

const json = JSON.stringify({ version:'v1.8', timestamp:new Date().toISOString(), findings }, null, 2);
await fs.writeFile(path.join(LOG_DIR, 'loop_governance_report.md'), md);
await fs.writeFile(path.join(LOG_DIR, 'loop_governance_report.json'), json);

console.log(`✓ Loop Governance Report created (${findings.length} tickets checked).`);
