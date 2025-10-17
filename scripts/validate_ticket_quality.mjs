#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {read,write} from './lib/md_utils.mjs';
const min = parseInt((process.argv.find(a=>a.startsWith('--minScore='))||'--minScore=70').split('=')[1],10);
async function listTickets(){
  try{
    const items = await fs.readdir('tickets');
    return items.filter(f=>f.endsWith('.md')).map(f=>path.join('tickets',f));
  }catch{ return []; }
}
function score(md){
  let s=0;
  if(/^#\s*Ticket\s+[A-Z]+-\d+:/m.test(md)) s+=15;
  if(/##\s*Definition of Ready/i.test(md)) s+=15;
  if(/##\s*Definition of Done/i.test(md)) s+=15;
  if(/##\s*Proof of Learning/i.test(md) && /KPI|Messpunkt|KPI\/Messpunkte/i.test(md)) s+=20;
  if(/##\s*Policy References/i.test(md) && /POL:/i.test(md)) s+=20;
  if(/##\s*Transitions/i.test(md)) s+=15;
  return s;
}
const files = await listTickets();
let fails=[];
let report=['# Ticket Quality Report',''];
for(const f of files){
  const md = await read(f)||'';
  const sc=score(md);
  report.push(`- ${f}: ${sc}`);
  if(sc<min) fails.push(f);
}
await write('artefacts/logs/ticket_quality_report.md',report.join('\n'));
if(fails.length){
  console.error('Tickets below threshold:',fails);
  process.exit(1);
}else{
  console.log('All tickets >=',min);
  process.exit(0);
}
