#!/usr/bin/env node
import fs from "fs"; import path from "path";
const argv=new Map(process.argv.slice(2).map((a,i,arr)=>[a,arr[i+1]]));
const LOG=argv.get("--log")||"artefacts/logs/proofs/proof_log.csv";
const MIN=parseFloat(argv.get("--min-coverage")||"0.9");
const REPORT=argv.get("--report")||"artefacts/logs/proof_coverage_report_v1.9.md";
function parseCsv(p){const t=fs.readFileSync(p,"utf8");const r=t.split(/\r?\n/).filter(Boolean).slice(1);
  const m=new Map(); for(const x of r){const[id,type]=x.split(",").map(s=>s.trim()); if(!id||!type)continue;
    if(!m.has(id))m.set(id,new Set()); m.get(id).add(type.toLowerCase())}
  const ids=[...m.keys()]; const both=ids.filter(id=>m.get(id).has("learning")&&m.get(id).has("value"));
  return{total:ids.length,both:both.length,coverage:ids.length?both.length/ids.length:0}}
function ensureDir(p){fs.mkdirSync(path.dirname(p),{recursive:true})}
function writeReport({total,both,coverage}){ensureDir(REPORT);const ok=coverage>=MIN;fs.writeFileSync(REPORT,
  `# Proof Coverage Report v1.9\n\n- Log: \`${LOG}\`\n- Artefacts (total): ${total}\n- Artefacts with both proofs: ${both}\n- Coverage: ${(coverage*100).toFixed(1)}% (min ${(MIN*100).toFixed(0)}%)\n\n**Status:** ${ok?"PASS":"FAIL"}\n`,"utf8");return ok}
(function(){ if(!fs.existsSync(LOG)){console.error(`Proof log not found: ${LOG}`);process.exit(1)}
  const res=parseCsv(LOG); const ok=writeReport(res); if(!ok)process.exit(2)})();
