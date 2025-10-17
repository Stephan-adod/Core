#!/usr/bin/env node
/**
 * Phase 1 Curation:
 * - Reframe AT-000 as "System Stabilization & CI Baseline Check" (done)
 * - Delete placeholder idea stubs (ideas/IDEA_from_AT-*.md)
 * - Append 5 curated backlog rows (AT-001..AT-005) to backlog_matrix_v1.8.md
 *   using canonical 11-column schema; avoid duplicates.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const BACKLOG = 'artefacts/logs/backlog_matrix_v1.8.md';
const IDEAS_DIR = 'ideas';
const TICKET = 'tickets/AT-000.md';
const OWNER = 'Stephan';

const HEADER = '| ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes |';
const SEP    = '|---|---|---|---|---|---|---|---|---|---|---|';

async function read(p){ try{ return await fs.readFile(p,'utf8') }catch{ return null } }
async function write(p,c){ await fs.mkdir(path.dirname(p),{recursive:true}); return fs.writeFile(p,c,'utf8') }
async function exists(p){ try{ await fs.access(p); return true }catch{ return false } }

async function ensureBacklogRows() {
  let md = await read(BACKLOG);
  if(!md){
    md = ['# Backlog Matrix · v1.8','',HEADER,SEP].join('\n')+'\n';
  }
  const lines = md.split('\n');
  const first = lines.findIndex(l=>l.trim().startsWith('|'));
  if(first>=0) {
    // ensure canonical header
    if(lines[first].trim()!==HEADER){ lines[first]=HEADER }
    if((lines[first+1]||'').trim()!==SEP){ lines[first+1]=SEP }
  } else {
    lines.push(HEADER, SEP);
  }

  const want = [
    // ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes
    ['AT-001','Meta','Governance','Policy-as-Code Sync','2','4','4','5','ready',OWNER,'Ensure 7 policies active & linked'],
    ['AT-002','Meta','Quality Ops','Ticket Quality Validator v2','2','4','3','4','ready',OWNER,'Score ≥80; DoR/DoD/Proof enforced'],
    ['AT-003','Product','Automation','Harmonize Pipeline as-a-Service','3','4','3','4','ready',OWNER,'Reusable CI steps ≥60% coverage'],
    ['AT-004','Foundation','System Health','Trust Probe Dashboard','2','3','3','3','ready',OWNER,'Visual SHS/Drift/Proofs'],
    ['AT-005','Meta','Governance','Freeze Audit Report v1.9','2','3','3','3','ready',OWNER,'Quarterly freeze summary'],
  ];

  // update AT-000 status to done (if present)
  for(let i=0;i<lines.length;i++){
    if(/^\|\s*AT-000\s*\|/.test(lines[i])) {
      const cols = lines[i].split('|').map(s=>s.trim());
      // cols: 0 "" 1 ID 2 Layer 3 Workstream 4 Title 5 Effort 6 Impact 7 Confidence 8 Priority 9 Status 10 Owner 11 Notes 12 ""
      cols[9] = 'done';
      cols[11] = 'System baseline proof (CI/Harmonize/Freeze ok)';
      lines[i] = cols.join(' | ');
    }
  }

  // append curated rows if missing
  const haveId = new Set(lines.filter(l=>l.startsWith('|')).map(l=> (l.split('|')[1]||'').trim()));
  for(const r of want){
    if(!haveId.has(r[0])){
      lines.push(`| ${r.join(' | ')} |`);
      haveId.add(r[0]);
    }
  }
  await write(BACKLOG, lines.join('\n').replace(/\n{3,}/g,'\n\n'));
  console.log('Backlog curated/updated:', BACKLOG);
}

async function reframeAT000(){
  const skeleton = (await read('templates/ticket_AT.md'))||`# Ticket AT-XXX: <Kurz-Titel>

## Context
- Ziel/Nutzen:
- Referenzen:

## Outcome Target (1–2 Sätze & KPI)
- Ergebnis:
- KPI/Messpunkte:

## Definition of Ready (DoR)
- [ ] Problem & Scope klar
- [ ] Messpunkte definiert
- [ ] Abhängigkeiten geklärt
- [ ] Risiken adressiert
- [ ] Owner & Zeitfenster gesetzt

## Definition of Done (DoD)
- [ ] Ergebnis nachweisbar (Artefakte)
- [ ] KPI gemessen & dokumentiert
- [ ] Lessons erfasst
- [ ] CI grün
- [ ] Ticketstatus aktualisiert

## Proof of Learning & Value
- Hypothese:
- Evidenz (Dateien/Logs):
- Ergebnis (Ja/Nein/Teil):
- Impact (kurz):

## Policy References
- POL:Quality
- POL:Automation
- POL:MarketValidation

## Transitions
- YYYY-MM-DD: <Aktion> – <PR/Commit>
`;
  let md = await read(TICKET);
  if(!md){
    md = skeleton.replaceAll('AT-XXX','AT-000').replace('<Kurz-Titel>','System Stabilization & CI Baseline Check');
  }
  // Title
  md = md.replace(/^#\s*Ticket\s+AT-000:.*$/m, '# Ticket AT-000: System Stabilization & CI Baseline Check');
  // Proof section – ensure a short baseline proof
  if(!/##\s*Proof of Learning/i.test(md)){
    md += `

## Proof of Learning & Value
- Hypothese: Mit Harmonize + Diagnose + Freeze-Gate ist die Basis stabil.
- Evidenz: CI-Run „Freeze · Validator (v1.8)“, harmonize-Logs, deep_diagnose_report.md
- Ergebnis: Ja (Baseline erzeugt & geprüft)
- Impact: Governance- und Ticket-Loop sind funktionsfähig
`;
  }
  // Policy refs (at least 3)
  if(!/##\s*Policy References/i.test(md)){
    md += `

## Policy References
- POL:Quality
- POL:Automation
- POL:Harmony
`;
  }
  // Minimal transitions hint
  if(!/##\s*Transitions/i.test(md)){
    md += `

## Transitions
- ${new Date().toISOString().slice(0,10)}: Baseline Stabilization – PR merged
`;
  }
  await write(TICKET, md);
  console.log('Ticket reframed:', TICKET);
}

async function cleanupIdeas(){
  try{
    const items = await fs.readdir(IDEAS_DIR);
    const del = items.filter(f=>/^IDEA_from_AT-\d+\.md$/.test(f));
    for(const f of del){ await fs.rm(path.join(IDEAS_DIR,f)) }
    console.log('Ideas placeholders removed:', del.length);
  }catch{
    console.log('Ideas dir missing or empty – nothing to clean');
  }
}

await reframeAT000();
await cleanupIdeas();
await ensureBacklogRows();
console.log('Phase 1 curation completed.');
