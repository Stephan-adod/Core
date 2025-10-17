#!/usr/bin/env node
/**
 * AT-001 Policy-as-Code Sync
 * - CHECK: liest 4 Quellen (Architecture v1.8, Horizon v1.8, Business v1.8, Ledger) und misst "Policy Valid %"
 * - FIX (--fix): ergänzt im Ledger fehlende Policy-Zeilen in der Tabelle "## Policies (active)" idempotent
 * Output:
 *   artefacts/logs/policy_sync_report.md
 *   artefacts/logs/policy_sync_report.json
 * Exit code != 0 wenn Policy Valid % < 95 (damit CI blockt)
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCES = [
  'meta/AI_First_System_Architecture_v1.8.md',
  'meta/Horizon_Map_v1.8.md',
  'docs/BUSINESS_CASE_Horizon_v1.8.md',
  'artefacts/sync/System_Harmony_Ledger.md'
];

const CANON = [
  {name:'Energy', source:'meta/AI_First_System_Architecture_v1.8.md'},
  {name:'Quality', source:'meta/AI_First_System_Architecture_v1.8.md'},
  {name:'Automation', source:'meta/AI_First_System_Architecture_v1.8.md'},
  {name:'Market Validation', source:'meta/AI_First_System_Architecture_v1.8.md'},
  {name:'Profit per Hour', source:'docs/BUSINESS_CASE_Horizon_v1.8.md'},
  {name:'Harmony Check', source:'meta/Horizon_Map_v1.8.md'},
  {name:'Ledger Freeze Gate', source:'meta/AI_First_System_Architecture_v1.8.md'},
];

const OUT_MD   = 'artefacts/logs/policy_sync_report.md';
const OUT_JSON = 'artefacts/logs/policy_sync_report.json';
const LEDGER   = 'artefacts/sync/System_Harmony_Ledger.md';
const THRESH   = 95;

async function read(p){ try { return await fs.readFile(p,'utf8') } catch { return '' } }
async function write(p,c){
  await fs.mkdir(path.dirname(p),{recursive:true});
  if(!c.endsWith('\n')) c += '\n';
  return fs.writeFile(p,c,'utf8');
}
const ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;
function escapeRegExp(str){ return str.replace(ESCAPE_RE, '\\$&'); }
function present(md, term){ const re = new RegExp(escapeRegExp(term), 'i'); return re.test(md) }

async function ensureLedgerRows(){
  let md = await read(LEDGER);
  if(!md) md = '# System Harmony Ledger\n\n';
  if(!/##\s*Policies\s*\(active\)/i.test(md)){
    md += '\n## Policies (active)\n| Policy | Source | Status |\n|---|---|---|\n';
  }
  // Stelle sicher, dass die Tabelle existiert und alle 7 Policies Zeilen haben
  for(const p of CANON){
    const rowRe = new RegExp(`\\|\\s*${p.name}\\s*\\|`,'i');
    if(!rowRe.test(md)){
      md += `| ${p.name} | ${p.source} | active |\n`;
    }
  }
  await write(LEDGER, md);
}

async function main(){
  const args = process.argv.slice(2);
  const doFix = args.includes('--fix');
  if(doFix){ await ensureLedgerRows(); }

  const docs = await Promise.all(SOURCES.map(read));
  const results = CANON.map(pol => {
    const coverage = {
      architecture: present(docs[0], pol.name),
      horizon:      present(docs[1], pol.name),
      business:     present(docs[2], pol.name),
      ledger:       present(docs[3], pol.name),
    };
    const count = Object.values(coverage).filter(Boolean).length;
    return { policy: pol.name, coverageCount: count, coverage };
  });

  const valid = results.filter(r => r.coverageCount >= 3).length; // in mind. 3 Quellen sichtbar
  const policyValidPct = Math.round((valid / CANON.length) * 100);

  const md = [
    '# Policy Sync Report',
    '',
    `Policy Valid %: ${policyValidPct}`,
    '',
    '| Policy | Arch | Horizon | Business | Ledger | Count |',
    '|---|---|---|---|---|---|',
    ...results.map(r => `| ${r.policy} | ${r.coverage.architecture?'✓':'–'} | ${r.coverage.horizon?'✓':'–'} | ${r.coverage.business?'✓':'–'} | ${r.coverage.ledger?'✓':'–'} | ${r.coverageCount} |`)
  ].join('\n');
  await write(OUT_MD, md);
  await write(OUT_JSON, JSON.stringify({policyValidPct:policyValidPct, results, stamp:new Date().toISOString()}, null, 2));

  console.log('Policy Valid % =', policyValidPct);
  if(policyValidPct < THRESH) process.exit(1);
}
await main();
