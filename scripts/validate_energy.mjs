#!/usr/bin/env node
import fs from "fs"; import path from "path";
const argv=new Map(process.argv.slice(2).map((a,i,arr)=>[a,arr[i+1]]));
const FEED=argv.get("--feed")||"artefacts/data/sbi/sbi_energy.csv";
const MIN=parseFloat(argv.get("--min-erio")||"1.0");
const REPORT=argv.get("--report")||"artefacts/logs/energy_validation_report_v1.9.md";
function parseCsv(p){const t=fs.readFileSync(p,"utf8");const r=t.split(/\r?\n/).filter(Boolean).slice(1);let o=0,i=0;for(const x of r){const[_,eout,ein]=x.split(",").map(s=>s.trim());o+=parseFloat(eout||"0");i+=parseFloat(ein||"0");}return{out:o,inn:i,eroi:i>0?o/i:0}}
function ensureDir(p){fs.mkdirSync(path.dirname(p),{recursive:true})}
function writeReport({out,inn,eroi}){ensureDir(REPORT);const ok=eroi>=MIN;fs.writeFileSync(REPORT,
  `# Energy Validation Report v1.9\n\n- Feed: \`${FEED}\`\n- Sum Out: ${out.toFixed(2)}\n- Sum In: ${inn.toFixed(2)}\n- eROI: ${eroi.toFixed(3)} (min ${MIN.toFixed(2)})\n\n**Status:** ${ok?"PASS":"FAIL"}\n`,"utf8");return ok}
(function(){ if(!fs.existsSync(FEED)){console.error(`Energy feed not found: ${FEED}`);process.exit(1)}
  const res=parseCsv(FEED); const ok=writeReport(res); if(!ok)process.exit(2)})();
