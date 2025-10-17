#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ARCH_PATH = "meta/AI_First_System_Architecture_v1.9.md";
const LEDGER_PATH = "artefacts/sync/System_Harmony_Ledger.md";
const PROOF_LOG = "artefacts/logs/proof_log.csv";
const REPORT_PATH = "artefacts/logs/trust_probe_report_v1.9.md";

const thresholds = {
  SHS: 80,
  Drift: 5,
  Policy: 95,
  Proof: 90,
  Energy: 1.0,
};

function readFileSafe(p) {
  try {
    return fs.readFileSync(path.resolve(p), "utf8");
  } catch (err) {
    return "";
  }
}

function parseTableValue(markdown, metric) {
  const lines = markdown.split("\n");
  for (const line of lines) {
    if (!line.trim().startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 5) continue;
    const name = cells[1].replace(/\*\*/g, "");
    if (name.toLowerCase() === metric.toLowerCase()) {
      const valueCell = cells[4] ?? "";
      const numeric = Number(String(valueCell).replace(/[^0-9.\-]/g, ""));
      return isNaN(numeric) ? null : numeric;
    }
  }
  return null;
}

function extractCoreKpiBlock(md) {
  const sectionRegex = /##\s+2️⃣ Core KPIs[^#]+/;
  const match = md.match(sectionRegex);
  return match ? match[0] : "";
}

function parseProofCoverage(csv) {
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length < 2) return null;
  const [, data] = rows;
  const cols = data.split(",");
  if (cols.length < 2) return null;
  const valid = Number(cols[0]);
  const total = Number(cols[1]);
  if (!total) return null;
  return (valid / total) * 100;
}

function ledgerVersionOk(ledger, expect, strict) {
  const versionLine = ledger.split("\n").find((l) => l.startsWith("version:"));
  if (!versionLine) return false;
  const version = versionLine.split(":")[1]?.trim();
  if (strict) {
    return version === expect;
  }
  return version === expect || version === "v" + expect.replace(/^[^\d]*/, "");
}

function runProbe() {
  const architecture = readFileSafe(ARCH_PATH);
  const ledger = readFileSafe(LEDGER_PATH);
  const proofCsv = readFileSafe(PROOF_LOG);

  if (!architecture) {
    console.error(`missing architecture file: ${ARCH_PATH}`);
  }
  if (!ledger) {
    console.error(`missing ledger file: ${LEDGER_PATH}`);
  }

  const kpiBlock = extractCoreKpiBlock(ledger);
  const systemHarmonyScore = parseTableValue(kpiBlock, "System Harmony Score");
  const driftPct = parseTableValue(kpiBlock, "Drift %");
  const policyValidPct = parseTableValue(kpiBlock, "Policy Valid %");
  const energyRoi = parseTableValue(kpiBlock, "Energy ROI (eROI)");
  const proofCoverage = parseProofCoverage(proofCsv);

  const results = {
    SHS: {
      label: "System Harmony Score",
      value: systemHarmonyScore,
      target: `≥ ${thresholds.SHS}`,
      pass: systemHarmonyScore != null && systemHarmonyScore >= thresholds.SHS,
    },
    Drift: {
      label: "Drift %",
      value: driftPct,
      target: `≤ ${thresholds.Drift}`,
      pass: driftPct != null && driftPct <= thresholds.Drift,
    },
    Policy: {
      label: "Policy Valid %",
      value: policyValidPct,
      target: `≥ ${thresholds.Policy}`,
      pass: policyValidPct != null && policyValidPct >= thresholds.Policy,
    },
    Proof: {
      label: "Proof Coverage %",
      value: proofCoverage,
      target: `≥ ${thresholds.Proof}`,
      pass: proofCoverage != null && proofCoverage >= thresholds.Proof,
    },
    Energy: {
      label: "Energy Index (eROI)",
      value: energyRoi,
      target: `≥ ${thresholds.Energy}`,
      pass: energyRoi != null && energyRoi >= thresholds.Energy,
    },
  };

  const ledgerValid = ledgerVersionOk(ledger, "v1.9", true);
  const proofDual = /Proof/.test(architecture) && /Dual-Proof/i.test(architecture);
  const energyPolicy = /Energy Index.*Pflichtfelder/i.test(architecture);
  const policySync = /Policy Valid %/.test(ledger) && /Policy/.test(architecture);

  const validationFindings = [];

  if (!ledgerValid) {
    validationFindings.push({
      check: "validate_ledger",
      status: "fail",
      detail: "Ledger version does not match expected v1.9",
    });
  } else {
    validationFindings.push({ check: "validate_ledger", status: "pass", detail: "Ledger version matches v1.9" });
  }

  if (results.Proof.pass && proofDual) {
    validationFindings.push({ check: "validate_proof", status: "pass", detail: "Proof coverage meets threshold" });
  } else {
    validationFindings.push({ check: "validate_proof", status: "fail", detail: "Proof coverage below threshold or architecture proof requirements missing" });
  }

  if (results.Energy.pass && energyPolicy) {
    validationFindings.push({ check: "validate_energy", status: "pass", detail: "Energy index within target" });
  } else {
    validationFindings.push({ check: "validate_energy", status: "fail", detail: "Energy index below target or policy linkage missing" });
  }

  if (results.Policy.pass && policySync) {
    validationFindings.push({ check: "validate_policy", status: "pass", detail: "Policy validity meets governance expectations" });
  } else {
    validationFindings.push({ check: "validate_policy", status: "fail", detail: "Policy validity below target or sync missing" });
  }

  const failing = Object.values(results).filter((r) => !r.pass);
  const status = failing.length === 0 && validationFindings.every((c) => c.status === "pass") ? "🟢 PASS" : "🔴 FAIL";

  const lines = [];
  lines.push("# Trust Probe Report · v1.9 (GOV-005)");
  lines.push(`Date: ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`**Overall Status:** ${status}`);
  lines.push("");
  lines.push("## Summary");
  Object.entries(results).forEach(([key, info]) => {
    const checkMark = info.pass ? "✅" : "❌";
    const valueStr = info.value == null ? "n/a" : info.value.toFixed(2);
    lines.push(`- ${checkMark} ${info.label}: ${valueStr} (${info.target})`);
  });
  lines.push("");
  lines.push("## Findings & Thresholds");
  validationFindings.forEach((vf) => {
    const emoji = vf.status === "pass" ? "✅" : "❌";
    lines.push(`- ${emoji} **${vf.check}** – ${vf.detail}`);
  });
  failing.forEach((fail) => {
    lines.push(`- ❗ ${fail.label} is below threshold (${fail.value == null ? "n/a" : fail.value.toFixed(2)} vs ${fail.target})`);
  });
  if (failing.length === 0) {
    lines.push("- No metric deviations detected against thresholds.");
  }
  lines.push("");
  lines.push("## Next Governance Actions");
  if (failing.length > 0) {
    lines.push("1. Investigate failing metrics and update ledger data sources.");
    lines.push("2. Align architecture v1.9 with ledger versioning before freeze.");
    lines.push("3. Re-run Trust Probe after metrics meet thresholds.");
  } else {
    lines.push("1. Proceed with governance freeze preparations.");
    lines.push("2. Confirm CI automation reflects v1.9 thresholds.");
    lines.push("3. Schedule governance review for final approval.");
  }
  lines.push("");

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join("\n"));

  console.log("status: completed | trust_probe_v1_9");
  Object.entries(results).forEach(([key, info]) => {
    console.log(`${key}=${info.value == null ? "n/a" : info.value.toFixed(2)} | pass=${info.pass}`);
  });
  validationFindings.forEach((vf) => {
    console.log(`${vf.check}: ${vf.status}`);
  });

  const exitCode = failing.length === 0 && validationFindings.every((c) => c.status === "pass") ? 0 : 1;
  process.exit(exitCode);
}

runProbe();
