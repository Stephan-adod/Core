#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const MATRIX = 'artefacts/logs/backlog_matrix_v1.8.md';
const TDIR   = 'tickets';
const PHASE_MAP = { // Backlog-Status -> phase
  'idea':'idea','ready':'ready','doing':'doing','review':'review','blocked':'blocked','done':'done'
};

function parseRows(md){
  const rows = md.split('\n').filter(l=>/^\|\s*AT-\d+/.test(l.trim()));
  const map = new Map();
  for(const r of rows){
    // | AT-001 | Meta | Governance | ... | Status | Owner | Notes |
    const cols = r.split('|').map(s=>s.trim());
    const id = cols[1]; // AT-xxx
    const status = cols[9]; // "Status" Spalte (0:"",1:ID,2:Layer,3:Workstream,4:Title,5:Effort,6:Impact,7:Confidence,8:Priority,9:Status,10:Owner,11:Notes,12:"")
    map.set(id, (PHASE_MAP[status?.toLowerCase?.()] || 'ready'));
  }
  return map;
}

async function read(p){ try{ return await fs.readFile(p,'utf8') }catch{ return null } }
async function write(p,c){ await fs.writeFile(p,c,'utf8') }

async function upsertPhaseInTicket(fp, phase){
  let md = await read(fp);
  if(!md) return;
  // Wenn Frontmatter-Kommentar vorhanden, ersetze/füge phase: <x>
  // Wir nutzen einen HTML-Kommentar-Block wie bei AT-008
  if(/<!--[\s\S]*?-->/.test(md)){
    if(/phase:\s*\w+/i.test(md)){
      md = md.replace(/(phase:\s*)\w+/i, `$1${phase}`);
    } else {
      md = md.replace(/<!--([\s\S]*?)-->/, (m, inner)=>`<!--${inner}\nphase: ${phase}\n-->`);
    }
  } else {
    // Kein Meta-Kommentar: füge einen direkt nach der H1 ein
    md = md.replace(/^(#\s*Ticket\s+AT-\d+:[^\n]*\n)/, `$1\n<!--\nphase: ${phase}\n-->\n`);
  }
  // Spezielle Notiz für AT-000
  if (/Ticket\s+AT-000:/i.test(md) && !/> Note: Baseline\/Seed ticket – System proof/.test(md)) {
    md = md.replace(/##\s*Context/, '## Context\n> Note: Baseline/Seed ticket – System proof');
  }
  await write(fp, md);
}

async function main(){
  const matrix = await read(MATRIX);
  if(!matrix) { console.error('Matrix not found:', MATRIX); process.exit(0); }
  const phases = parseRows(matrix);
  const files = (await fs.readdir(TDIR)).filter(f=>/^AT-\d+\.md$/.test(f));
  for(const f of files){
    const id = f.replace('.md','').toUpperCase();
    const p  = phases.get(id) || 'ready';
    await upsertPhaseInTicket(path.join(TDIR,f), p);
  }
  console.log('✓ phases synced to tickets from backlog matrix.');
}
await main();
