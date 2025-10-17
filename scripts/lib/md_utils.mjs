import fs from 'node:fs/promises';
import path from 'node:path';
export async function read(p){ try{ return await fs.readFile(p,'utf8') }catch{ return null } }
export async function write(p,c){ const dir=path.dirname(p); if(dir && dir!=='.'){ await fs.mkdir(dir,{recursive:true}); } return fs.writeFile(p,c) }
export async function backup(p,c){ try{ await fs.access(p+'.bak') }catch{ await fs.writeFile(p+'.bak',c) } }
