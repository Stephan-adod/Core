#!/usr/bin/env node
/**
 * v2.8 · Context Feature Extractor (refined)
 * Liest PR-Event oder lokale Repo-Daten, erzeugt context_features_v2_8.json.
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUTPUT = "artefacts/logs/context_features_v2_8.json";
const eventPath = process.env.GITHUB_EVENT_PATH;

const features = {
  timestamp: new Date().toISOString(),
  branch: null,
  changed_files: 0,
  additions: 0,
  deletions: 0,
  labels: [],
  actor: process.env.GITHUB_ACTOR || "local-run",
  source: eventPath || "manual"
};

try {
  if (eventPath && fs.existsSync(eventPath)) {
    const ev = JSON.parse(fs.readFileSync(eventPath, "utf8"));
    const pr = ev.pull_request;
    if (pr) {
      features.branch = pr.head.ref;
      features.changed_files = pr.changed_files || 0;
      features.additions = pr.additions || 0;
      features.deletions = pr.deletions || 0;
      features.labels = (pr.labels || []).map(l => l.name);
      features.user = pr.user?.login;
    }
  } else {
    // Fallback bei lokalem Run
    features.branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    features.changed_files = execSync("git diff --name-only HEAD~1")
      .toString()
      .split("\n")
      .filter(Boolean).length;
  }
} catch (e) {
  console.warn("Context extraction warning:", e.message);
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, `${JSON.stringify(features, null, 2)}\n`);
console.log(`✅ Context features written → ${OUTPUT}`);
