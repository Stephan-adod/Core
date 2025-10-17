#!/usr/bin/env node
import {read,write,backup} from './lib/md_utils.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
const HEADER='| ID | Layer | Workstream | Title | Effort | Impact | Confidence | Priority | Status | Owner | Notes | Policy-Bezug | Phase | Proof-Artefakt |';
const SEP='|---|---|---|---|---|---|---|---|---|---|---|---|---|---|';
async function listBacklogFiles(){
  const dir='artefacts/logs';
  try{
    const items = await fs.readdir(dir);
    return items.filter(f=>/^backlog_matrix_v.*\\.md$/i.test(f)).map(f=>path.join(dir,f));
  }catch{ return []; }
}
let changed=0;
for(const f of await listBacklogFiles()){
  const md = await read(f); if(!md) continue;
  const lines = md.split('\n');
  const i = lines.findIndex(l=>l.trim().startsWith('|'));
  if(i<0) continue;
  if(lines[i].trim()!==HEADER || (lines[i+1]||'').trim()!==SEP){
    await backup(f,md);
    lines[i]=HEADER;
    lines[i+1]=SEP;
    await write(f,lines.join('\n'));
    changed++;
  }
}
console.log(`Backlog headers normalized: ${changed} file(s) changed.`);
process.exit(0);
