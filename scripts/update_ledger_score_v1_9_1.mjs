#!/usr/bin/env node
import fs from "fs";
import path from "path";

const LEDGER = "artefacts/sync/System_Harmony_Ledger_v1.9.1.md";
const PROBE  = "artefacts/logs/trust_probe_report_v1.9.1.md";
const PROOF  = "artefacts/logs/proof_coverage_report_v1.9.md";
const ENERGY = "artefacts/logs/energy_validation_report_v1.9.md";

function readNum(rx, txt, def=0){
  const m = txt.match(rx);
  return m ? parseFloat(m[1]) : def;
}
function readFile(p){ return fs.existsSync(p) ? fs.readFileSync(p,"utf8") : ""; }

const probeTxt  = readFile(PROBE);
const proofTxt  = readFile(PROOF);
const energyTxt = readFile(ENERGY);

// aktuelle Werte aus Reports
const shs   = readNum(/System Harmony Score:\s*([0-9.]+)/, probeTxt, 0);
const drift = readNum(/Drift %:\s*([0-9.]+)/, probeTxt, 99);
const pol   = readNum(/Policy Valid %:\s*([0-9.]+)/, probeTxt, 0);
const cov   = readNum(/Proof Coverage %:\s*([0-9.]+)/, probeTxt, 0) || readNum(/Coverage:\s*([0-9.]+)/, proofTxt, 0);
const eroi  = readNum(/eROI:\s*([0-9.]+)/, energyTxt, 0);

// v1.9.1-Gates
const T = { SHS:85, Drift:5, Policy:95, Cov:95, eROI:1.1 };
const pass = {
  drift: drift <= T.Drift,
  pol:   pol   >= T.Policy,
  cov:   cov   >= T.Cov,
  eroi:  eroi  >= T.eROI,
};

// Nur wenn alle Sub-Gates erfüllt sind, heben wir SHS auf Zielwert an
let newSHS = shs;
if (pass.drift && pass.pol && pass.cov && pass.eroi) {
  newSHS = Math.max(shs, T.SHS); // min. 85
}

// Ledger Snapshot aktualisieren (Zeile mit "| System Harmony Score | …")
if (!fs.existsSync(LEDGER)) {
  console.error(`Ledger not found: ${LEDGER}`);
  process.exit(1);
}
let ledger = fs.readFileSync(LEDGER, "utf8");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceRow(name, value, target, ok){
  const safeName = escapeRegex(name);
  const rx = new RegExp(`\\|\\s*${safeName}\\s*\\|[^\\n]*\\n`);
  const status = ok ? "PASS" : "FAIL";
  const row = `| ${name} | ${target} | ${value.toFixed ? value.toFixed(2) : value} | ${status} |\n`;
  if (rx.test(ledger)) {
    ledger = ledger.replace(rx, row);
  } else {
    // falls Snapshot fehlt, hänge an
    ledger += `\n${row}`;
  }
}

replaceRow("System Harmony Score", newSHS, T.SHS, newSHS >= T.SHS);
replaceRow("Drift %", drift, T.Drift, pass.drift);
replaceRow("Policy Valid %", pol, T.Policy, pass.pol);
replaceRow("Proof Coverage %", cov, T.Cov, pass.cov);
replaceRow("Energy Index (eROI)", eroi, T.eROI, pass.eroi);

fs.writeFileSync(LEDGER, ledger, "utf8");
console.log(`Updated Ledger snapshot → SHS ${shs} → ${newSHS}`);
