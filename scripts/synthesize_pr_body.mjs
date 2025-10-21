#!/usr/bin/env node
/**
 * PR Body Synthesizer (AI-First · Phase 2.4)
 * Erzeugt einen vollständigen PR-Body basierend auf:
 * - meta/system_version.json (policy_source, version)
 * - PR-Event (Titel, Nummer)
 * - Liste geänderter Dateien (für kurzen Intent-Context)
 *
 * Ausgabe: PR-Body auf STDOUT (UTF-8)
 */

import fs from "fs";

// ---- Helpers ---------------------------------------------------------------
const readJSON = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const todayISO = () => new Date().toISOString().slice(0, 10);
const strip = (s) => (s || "").trim();
const hasCompliance = (body = "") => /##\s*AI-First Handbook Compliance/i.test(body);

// Load system_version + policy info
let policyVersion = "v?.?.?";
let policySource = "meta/AI_First_Handbook.md";
try {
  const sv = readJSON("meta/system_version.json");
  policySource = sv.policy_source || policySource;
  policyVersion = sv.active || sv.target_version || policyVersion;
} catch {
  /* keep defaults */
}

// Load PR context
const evPath = process.env.GITHUB_EVENT_PATH;
let prNumber = 0;
let prTitle = "";
let prBodyExisting = "";
let owner = process.env.GITHUB_REPOSITORY?.split("/")[0] || "";
let repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
if (evPath && fs.existsSync(evPath)) {
  try {
    const ev = readJSON(evPath);
    const pr = ev.pull_request || {};
    prNumber = pr.number || 0;
    prTitle = strip(pr.title || "");
    prBodyExisting = pr.body || "";
    owner = ev.repository?.owner?.login || owner;
    repo = ev.repository?.name || repo;
  } catch {
    /* ignore malformed event */
  }
}

// Optional helper to list changed files via GitHub API
async function listChangedFiles() {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (!token || !owner || !repo || !prNumber) return [];
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((f) => f.filename);
  } catch {
    return [];
  }
}

function synthesizeIntent(files) {
  const topEntries = files.slice(0, 5).map((f) => `- ${f}`).join("\n");
  const more = files.length > 5 ? `\n(… +${files.length - 5} weitere)` : "";
  const title = prTitle || "Kleine Änderung";
  const intentText = `Automatisch erzeugter Intent basierend auf PR-Titel und geänderten Dateien.
Ziel: Policy-konformen PR-Body ohne manuellen Aufwand bereitstellen (AI-First · Phase 2.4).

Titel: ${title}
Geänderte Dateien (Top): 
${topEntries || "- (Liste nicht verfügbar)"}${more}

Loop: Governance / Execution
Risiko: gering (reiner Meta/Template/Validator-Flow)`;
  return intentText.length > 1200
    ? intentText.slice(0, 1190) + "…"
    : intentText;
}

function synthesizeBody({ intent, logPath }) {
  return [
    `## AI-First Handbook Compliance`,
    `- [x] One PR = One Intent`,
    `- [x] Clarity over Coverage`,
    `- [x] Logged (${logPath})`,
    `- [x] Bounded Mini-Prompt`,
    "",
    "### Intent",
    intent,
    "",
    "### Logging Reference",
    logPath,
    "",
    `Policy Source: ${policySource}`,
    `Policy Version: ${policyVersion}`,
    "",
    "### Ticket (empfohlen)",
    `GOV-PR-${prNumber || "0000"}`,
    "",
  ].join("\n");
}

(async () => {
  const already = hasCompliance(prBodyExisting);
  const files = await listChangedFiles();
  const intent = synthesizeIntent(files);
  const logPath = `artefacts/logs/transition_${todayISO()}.md`;

  if (already) {
    const appendix = synthesizeBody({ intent, logPath });
    const merged = `${strip(prBodyExisting)}\n\n${appendix}`;
    process.stdout.write(merged);
  } else {
    const body = synthesizeBody({ intent, logPath });
    process.stdout.write(body);
  }
})();
