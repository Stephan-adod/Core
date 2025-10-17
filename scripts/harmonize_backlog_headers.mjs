#!/usr/bin/env node
import fs from 'node:fs/promises';
import {read,write,backup} from './lib/md_utils.mjs';
const HEADER='| ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes |';
const SEP='|---|---|---|---|---|---|---|---|---|---|---|';
async function listBacklogFiles(){
  try{
    const entries = await fs.readdir('artefacts/logs');
    return entries.filter(name=>name.startsWith('backlog_matrix_v') && name.endsWith('.md')).map(name=>`artefacts/logs/${name}`);
  }catch{return []}
}
const files = await listBacklogFiles();
let changed=0;
for(const f of files){
  let md = await read(f); if(!md) continue;
  const lines = md.split('\n');
  const i = lines.findIndex(l=>l.trim().startsWith('|'));
  if(i<0) continue;
  if(lines[i].trim()!==HEADER || (lines[i+1]||'').trim()!==SEP){
    await backup(f,md); lines[i]=HEADER; lines[i+1]=SEP; await write(f,lines.join('\n')); changed++;
  }
}
console.log(`Backlog headers normalized: ${changed} file(s) changed.`); process.exit(0);
