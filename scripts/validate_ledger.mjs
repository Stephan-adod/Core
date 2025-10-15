// scripts/validate_ledger.mjs
// Minimaler Validator: liest Tabellen-Sektionen aus artefacts/sync/System_Harmony_Ledger.md,
// prüft Ampel-Logik & Drift-Grenzen. validate-only (schreibt nichts).

import { readFileSync } from "fs";
import path from "path";

const args = Object.fromEntries(process.argv.slice(2).map(a=>{
  const [k,v] = a.replace(/^--/,'').split('=');
  return [k, v ?? true];
}));

const MAX_DRIFT = Number(args.max-drift || args["max-drift"] || 5);
const MIN_HEALTH = Number(args.min-health || args["min-health"] || 80);
const LEDGER_PATH = args.ledger || "artefacts/sync/System_Harmony_Ledger.md";

function read(file){ return readFileSync(path.resolve(file), "utf8"); }

// naive section extractor
function section(md, title){
  const re = new RegExp(`^##\\s+${title}[^\\n]*\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`, "m");
  const m = md.match(re);
  return m ? m[1].trim() : "";
}

// parse thresholds yaml block from Refinement v1 Responses
function parseThresholds(block){
  const m = block.match(/```yaml([\s\S]*?)```/m);
  if(!m) return {};
  const yaml = m[1];
  const lines = yaml.split("\n").map(l=>l.trim()).filter(Boolean);
  const thresholds = {};
  let current = null;
  for(const line of lines){
    if(line.startsWith("thresholds:")) { current = "thresholds"; continue; }
    if(line.startsWith("weights:")) break;
    const kv = line.match(/^(\w+):\s*\{\s*green:\s*([^,}]+),\s*yellow:\s*([^,}]+),\s*red:\s*([^}]+)\s*\}/);
    if(kv) thresholds[kv[1]] = {
      green: Number(kv[2]), yellow: Number(kv[3]), red: Number(kv[4])
    };
  }
  return thresholds;
}

// simple number finder in KPI table lines like: "| Learning Velocity | ... | ≥ 2 | 1.6 |"
function parseKpiTable(block){
  const rows = block.split("\n").filter(l=>l.startsWith("|"));
  const data = {};
  for(const r of rows){
    const cells = r.split("|").map(c=>c.trim());
    if(cells.length < 6 || cells[1]==="KPI") continue;
    const kpi = cells[1];
    const target = cells[3].replace(/[^\d\.\-]/g,"");
    const value = cells[4].replace(/[^\d\.\-]/g,"");
    if(kpi && target){
      data[kpi] = {
        target: target ? Number(target) : NaN,
        value: value ? Number(value) : NaN
      };
    }
  }
  return data;
}

function main(){
  const md = read(LEDGER_PATH);
  const kpiSection = section(md, "2️⃣ Core KPIs");
  const respSection = section(md, "🔧 Refinement v1 Responses");

  if(!kpiSection) { console.error("Ledger: KPI section missing"); process.exit(2); }
  if(!respSection) { console.error("Ledger: Refinement v1 Responses missing"); process.exit(2); }

  const thresholds = parseThresholds(respSection);
  const kpis = parseKpiTable(kpiSection);

  let failed = false;
  let greenCount = 0, yellowCount = 0, redCount = 0, totalScorable = 0;

  const report = [];

  Object.entries(kpis).forEach(([name, {target, value}])=>{
    // only score if threshold exists for shorthand key mapping
    const keyMap = {
      "Learning Velocity":"learning_velocity",
      "Market Validation Rate (MVR)":"mvr",
      "Proof-to-Investment Ratio (PIR)":"pir",
      "Energy ROI (eROI)":"eROI",
      "Profit per Hour (PPH)":"pph",
      "Policy Drift %":"policy_drift"
    };
    const key = keyMap[name];
    if(!key || !thresholds[key]) return; // skip unscored KPIs

    totalScorable++;
    const th = thresholds[key];

    let status = "🔴";
    // note: for "Policy Drift %" lower is better
    if(key === "policy_drift"){
      if(!isNaN(value) && value <= th.green) status = "🟢";
      else if(!isNaN(value) && value <= th.yellow) status = "🟡";
    } else {
      if(!isNaN(value) && value >= th.green) status = "🟢";
      else if(!isNaN(value) && value >= th.yellow) status = "🟡";
    }

    if(status==="🟢") greenCount++;
    else if(status==="🟡") yellowCount++;
    else redCount++;

    report.push(`${status} ${name}: value=${isNaN(value)?"n/a":value}`);
  });

  const maxScore = totalScorable * 2;
  const score = greenCount*2 + yellowCount*1 + redCount*0;
  const health = maxScore ? Math.round((score/maxScore)*100) : 0;

  // naive drift read from KPI table if present
  const driftRow = (kpiSection.split("\n").find(l=>l.includes("Policy Drift %"))||"");
  const driftVal = Number(driftRow.replace(/[^\d\.\-]/g,"")) || NaN;

  const drift = isNaN(driftVal) ? 100 : driftVal;

  console.log("=== System Harmony Ledger Validation (validate-only) ===");
  report.forEach(line=>console.log(line));
  console.log(`Health Score: ${health}%  |  Drift: ${isNaN(drift)?"n/a":drift}%`);
  console.log(`Thresholds: min health ${MIN_HEALTH}%, max drift ${MAX_DRIFT}%`);

  if(health < MIN_HEALTH || (!isNaN(drift) && drift > MAX_DRIFT)){
    console.error("❌ Validation FAILED");
    failed = true;
  } else {
    console.log("✅ Validation PASSED");
  }
  process.exit(failed?1:0);
}

main();
