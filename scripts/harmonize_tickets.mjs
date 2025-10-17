#!/usr/bin/env node
import {read,write,backup} from './lib/md_utils.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const SKELETON = await read('templates/ticket_AT.md');
function ensureSection(md, title){
  return md.includes(title) ? md : md + `\n\n${SKELETON.split('\n\n').find(s=>s.startsWith(title))}\n`;
}
async function ensureTicket(key){
  const p=`tickets/${key}.md`;
  let md = await read(p);
  if(!md){
    await write(p,SKELETON.replaceAll('AT-XXX',key));
    return {created:true,updated:false};
  }
  const before=md;
  md = ensureSection(md,'# Ticket');
  md = ensureSection(md,'## Definition of Ready');
  md = ensureSection(md,'## Definition of Done');
  md = ensureSection(md,'## Proof of Learning & Value');
  md = ensureSection(md,'## Policy References');
  md = ensureSection(md,'## Transitions');
  if(md!==before){
    await backup(p,before);
    await write(p,md);
    return {created:false,updated:true};
  }
  return {created:false,updated:false};
}
async function listBacklogFiles(){
  const dir='artefacts/logs';
  try{
    const items = await fs.readdir(dir);
    return items.filter(f=>/^backlog_matrix_v.*\\.md$/i.test(f)).map(f=>path.join(dir,f));
  }catch{ return []; }
}
let created=0,updated=0;
for(const f of await listBacklogFiles()){
  const md = await read(f)||'';
  const rows = md.split('\n').filter(l=>l.startsWith('|') && !l.includes('---')).slice(1);
  for(const r of rows){
    const cols = r.split('|').map(s=>s.trim());
    const id = cols[1];
    const status = (cols[9]||'').toLowerCase();
    if(!/^AT-\d+/.test(id)) continue;
    if(['ready','doing','review','blocked'].includes(status)){
      const res = await ensureTicket(id);
      if(res.created) created++;
      if(res.updated) updated++;
    }
  }
}
console.log(`Tickets created:${created}, updated:${updated}`);
process.exit(0);
