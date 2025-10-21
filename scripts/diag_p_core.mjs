#!/usr/bin/env node
/**
 * P-CORE · Daily Diagnostics (read-only)
 * Reads meta/docs files, prints Markdown summary to GITHUB_STEP_SUMMARY,
 * and emits a JSON snapshot as artifact. No writes into repo.
 */

import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

const GITHUB_SUMMARY = process.env.GITHUB_STEP_SUMMARY;
const RUNNER_TEMP = process.env.RUNNER_TEMP || os.tmpdir();

const exists = async (p) => {
  try { await stat(p); return true; } catch { return false; }
};
const readJson = async (p) => JSON.parse(await readFile(p, "utf8"));
const readText = async (p) => await readFile(p, "utf8");

// ---- helpers ---------------------------------------------------------------
const safeNumber = (s) => {
  const m = String(s ?? "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const lastCycleFromReport = (md) => {
  // find last '## Cycle N' heading
  const matches = [...md.matchAll(/^\s*##\s*Cycle\s+(\d+)/gim)];
  if (matches.length === 0) return null;
  return Number(matches.at(-1)[1]);
};
const lastCycleFromData = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return Number(arr.at(-1).cycle ?? arr.at(-1).week ?? null);
};
const ageInDays = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / (24*3600*1000));
};

async function main() {
  const snapshot = {
    meta: {
      repo: process.env.GITHUB_REPOSITORY || null,
      sha: process.env.GITHUB_SHA || null,
      run_id: process.env.GITHUB_RUN_ID || null,
      timestamp: new Date().toISOString(),
      version: null,
      cycle: null
    },
    governance: {
      policy_valid_pct: null,
      harmony_score: null,
      model_cards: [],
    },
    signals: {
      drift_score: null,
      delta_mape_last: null,
      context_adoption_last: null,
      data_freshness_days: null,
    },
    inventory: {
      lessons_docs: 0,
      prompts: 0,
      runbooks: 0,
      diagrams: 0
    },
    warnings: [],
  };

  // ---- version detection
  if (await exists("meta/system_version.json")) {
    try {
      const sv = await readJson("meta/system_version.json");
      snapshot.meta.version = sv?.target_version || sv?.version || null;
    } catch {}
  }
  if (!snapshot.meta.version && await exists("meta/AI_First_System_Architecture.md")) {
    const md = await readText("meta/AI_First_System_Architecture.md");
    snapshot.meta.version = (md.match(/version:\s*v?([0-9.]+)/i)?.[1]) || null;
  }

  // ---- cycle detection (prefer reports, fallback to data)
  const cycleReportPath = "docs/reports/business_loop_cycles_v2.4.md";
  if (await exists(cycleReportPath)) {
    const md = await readText(cycleReportPath);
    snapshot.meta.cycle = lastCycleFromReport(md);
  }
  if (snapshot.meta.cycle == null && await exists("docs/data/context_adoption_history.json")) {
    const arr = await readJson("docs/data/context_adoption_history.json");
    snapshot.meta.cycle = lastCycleFromData(arr);
  }

  // ---- governance from reflection report & compliance register
  const reflPath = "docs/reports/reflection_cycles_v2.4.md";
  if (await exists(reflPath)) {
    const md = await readText(reflPath);
    snapshot.governance.policy_valid_pct = safeNumber(md.match(/Policy\s*Valid\s*%[:\s]*([0-9.]+)/i)?.[1] ?? md);
    snapshot.governance.harmony_score = safeNumber(md.match(/Harmony.*?≈?\s*([0-9.]+)/i)?.[1] ?? md);
  }
  if (await exists("meta/AI_Compliance_Register_v2.4.json")) {
    try {
      const reg = await readJson("meta/AI_Compliance_Register_v2.4.json");
      snapshot.governance.model_cards = (reg.models||[]).map(m => ({
        id: m.id, risk_tier: m.risk_tier, validated: !!m.model_card_validated, updated: m.validation_date || null
      }));
    } catch {}
  }

  // ---- signals from findings + data mirrors
  const findPath = "docs/reports/forecast_drift_findings_v2.4.md";
  if (await exists(findPath)) {
    const md = await readText(findPath);
    snapshot.signals.drift_score = safeNumber(md.match(/Drift\s*Score.*?:\s*([0-9.]+)/i)?.[1] ?? md);
  }
  if (await exists("docs/data/forecast_mape_history.json")) {
    const arr = await readJson("docs/data/forecast_mape_history.json");
    const last = Array.isArray(arr) && arr.at(-1);
    snapshot.signals.delta_mape_last = last?.delta_mape ?? null;
    snapshot.signals.data_freshness_days = ageInDays(last?.timestamp) ?? null;
  }
  if (await exists("docs/data/context_adoption_history.json")) {
    const arr = await readJson("docs/data/context_adoption_history.json");
    snapshot.signals.context_adoption_last = Array.isArray(arr) ? arr.at(-1)?.context_adoption_rate ?? null : null;
  }

  // ---- light inventory
  const countFiles = async (dir) => (await exists(dir)) ? (await readdir(dir)).filter(f=>f.endsWith(".md")||f.endsWith(".mjs")).length : 0;
  snapshot.inventory.lessons_docs = await countFiles("docs/lessons");
  snapshot.inventory.prompts      = await countFiles("docs/prompts");
  snapshot.inventory.runbooks     = await countFiles("docs/ops");
  snapshot.inventory.diagrams     = await countFiles("docs/diagrams");

  // ---- warnings
  if (snapshot.signals.data_freshness_days != null && snapshot.signals.data_freshness_days > 14) {
    snapshot.warnings.push(`Data freshness ${snapshot.signals.data_freshness_days}d (>14).`);
  }
  if (!snapshot.meta.version) snapshot.warnings.push("Version not detected.");
  if (snapshot.meta.cycle == null) snapshot.warnings.push("Cycle not detected.");

  // ---- JSON artifact (runner temp)
  const jsonPath = path.join(RUNNER_TEMP, `diag_p_core_snapshot_${Date.now()}.json`);
  await writeFile(jsonPath, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`JSON snapshot → ${jsonPath}`);
  // expose path for GH Action
  console.log(`::set-output name=json_path::${jsonPath}`);
  // also set env var for ease
  console.log(`JSON_PATH=${jsonPath}`);

  // ---- Markdown summary
  const md = [
    `# 🌅 Daily Snapshot · AI-First Core`,
    `**Version:** ${snapshot.meta.version ?? "n/a"} · **Cycle:** ${snapshot.meta.cycle ?? "n/a"}  `,
    `**Policy Valid:** ${snapshot.governance.policy_valid_pct ?? "n/a"} · **Harmony:** ${snapshot.governance.harmony_score ?? "n/a"}`,
    ``,
    `## Signals`,
    `- Drift Score: **${snapshot.signals.drift_score ?? "n/a"}**`,
    `- ΔMAPE (last): **${snapshot.signals.delta_mape_last ?? "n/a"}**`,
    `- Context Adoption (last): **${snapshot.signals.context_adoption_last ?? "n/a"}**`,
    `- Data Freshness: **${snapshot.signals.data_freshness_days ?? "n/a"}d**`,
    ``,
    `## Compliance`,
    ...(snapshot.governance.model_cards||[]).map(m => `- ${m.id} · tier:${m.risk_tier} · validated:${m.validated ? "✅" : "❌"}${m.updated ? ` · ${m.updated}`:""}`),
    ``,
    `## Inventory`,
    `- Lessons (docs): ${snapshot.inventory.lessons_docs} · Prompts: ${snapshot.inventory.prompts} · Runbooks: ${snapshot.inventory.runbooks} · Diagrams: ${snapshot.inventory.diagrams}`,
    ``,
    snapshot.warnings.length ? `## ⚠️ Warnings\n- ${snapshot.warnings.join("\n- ")}` : `## ✅ No warnings`,
    ``,
    `> Next: Copy the following into ChatGPT — **"Continue P-013 · Cycle n+1 Execution & Archive Planning"**`
  ].join("\n");

  if (GITHUB_SUMMARY) {
    await writeFile(GITHUB_SUMMARY, md, "utf8");
  } else {
    console.log(md);
  }
}

main().catch(err => {
  console.error("Diagnostics failed:", err);
  process.exit(1);
});
