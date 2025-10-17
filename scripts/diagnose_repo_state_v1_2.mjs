#!/usr/bin/env node
import fs from 'node:fs/promises';
import {read,write} from './lib/md_utils.mjs';
const enforce = process.argv.includes('--enforce-freeze');
const hdr='| ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes |';
const findings=[];
function add(id,severity,desc,fix){ findings.push({id,severity,desc,fix}) }

async function listBacklogFiles(){
  try{
    const entries = await fs.readdir('artefacts/logs');
    return entries.filter(name=>name.startsWith('backlog_matrix_v') && name.endsWith('.md')).map(name=>`artefacts/logs/${name}`);
  }catch{return []}
}
async function listTicketFiles(){
  try{
    const entries = await fs.readdir('tickets');
    return entries.filter(name=>name.endsWith('.md')).map(name=>`tickets/${name}`);
  }catch{return []}
}

async function checkBacklog(){
  const files = await listBacklogFiles();
  if(!files.length) add('BACKLOG-NONE','high','no backlog matrices found','create v1.8 matrix');
  for(const f of files){
    const md = await read(f)||'';
    const lines = md.split('\n'); const i=lines.findIndex(l=>l.trim().startsWith('|'));
    if(i<0) { add('BACKLOG-HEADER','high',`${f}: no header`,`harmonize_backlog_headers.mjs`); continue; }
    if(lines[i].trim()!==hdr) add('BACKLOG-HEADER','high',`${f}: header != canonical`,`harmonize_backlog_headers.mjs`);
  }
}
async function checkTickets(){
  const files = await listTicketFiles();
  if(!files.length) add('TICKETS-NONE','high','tickets/ folder empty','harmonize_tickets.mjs');
}
async function checkCI(){
  const wf = await read('.github/workflows/freeze_validator.yml');
  if(!wf) add('CI-FREEZE','high','freeze_validator.yml missing','add workflow');
}
await checkBacklog(); await checkTickets(); await checkCI();

if(enforce){
  const hasHigh = findings.some(f=>f.severity==='high');
  if(hasHigh){ console.error('Freeze gate fail:',findings); process.exit(1) }
  console.log('Freeze gate pass'); process.exit(0);
} else {
  const md=['# Deep Diagnose Report · v1.2','','## Findings','| ID | Severity | Description | Fix |','|---|---|---|---|',...findings.map(f=>`| ${f.id} | ${f.severity} | ${f.desc} | ${f.fix} |`)].join('\n');
  await write('artefacts/logs/deep_diagnose_report.md',md+'\n');
  await write('artefacts/logs/deep_diagnose_findings.json',JSON.stringify({version:'v1.2',timestamp:new Date().toISOString(),findings},null,2)+'\n');
  console.log('Report written.'); process.exit(0);
}
