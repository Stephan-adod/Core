#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const BACKLOG_DIR = 'artefacts/logs';
const BACKLOG_FILE = path.join(BACKLOG_DIR, 'backlog_matrix_v1.8.md');
const TICKETS_DIR = 'tickets';
const SEED_TICKET = path.join(TICKETS_DIR, 'AT-000.md');

const HEADER = '| ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes |';
const SEP    = '|---|---|---|---|---|---|---|---|---|---|---|';

async function exists(p){ try{ await fs.access(p); return true } catch { return false } }
async function ensureDir(d){ await fs.mkdir(d, { recursive: true }); }

async function ensureBacklog(){
  await ensureDir(BACKLOG_DIR);
  if(!(await exists(BACKLOG_FILE))){
    const tpl = [
      '# Backlog Matrix · v1.8',
      '',
      HEADER,
      SEP,
      `| AT-000 | Meta | Governance | Seed ticket for stabilization | 1 | 1 | 1 | 1 | ready | Stephan | Bootstrap entry |`,
      ''
    ].join('\n');
    await fs.writeFile(BACKLOG_FILE, tpl, 'utf8');
    console.log('Created:', BACKLOG_FILE);
  } else {
    console.log('Backlog exists:', BACKLOG_FILE);
  }
}

async function ensureSeedTicket(){
  await ensureDir(TICKETS_DIR);
  if(!(await exists(SEED_TICKET))){
    // try template; if missing, use fallback
    let skeleton = '';
    try { skeleton = await fs.readFile('templates/ticket_AT.md','utf8') } catch {}
    if(!skeleton){
      skeleton = `# Ticket AT-XXX: <Kurz-Titel>

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
- [ ] CI grün (Freeze/Trust)
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
    }
    const md = skeleton.replaceAll('AT-XXX','AT-000').replace('<Kurz-Titel>','Stabilization Seed');
    await fs.writeFile(SEED_TICKET, md, 'utf8');
    console.log('Created:', SEED_TICKET);
  } else {
    console.log('Ticket exists:', SEED_TICKET);
  }
}

await ensureBacklog();
await ensureSeedTicket();
console.log('Bootstrap v1.8 done.');
