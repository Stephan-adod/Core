#!/usr/bin/env node
/**
 * DIAG-P-CORE · Adaptive Read-Only Repository Diagnosis
 * - Stateless (NO WRITES). Pure console output.
 * - Version/Cycle adaptive (reads meta/system_version.json if present).
 * - Scans: meta/, docs/, artefacts/, scripts/, .github/workflows
 * - Output: Markdown (default) or JSON (--json).
 *
 * Usage:
 *   node scripts/DIAG-P-CORE.mjs
 *   node scripts/DIAG-P-CORE.mjs --json
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CWD = process.cwd();
const args = new Set(process.argv.slice(2));
const WANT_JSON = args.has("--json");

// optional future gate: --min-score=4 (won't be used in read-only workflow)
const argMap = Object.fromEntries(
  process.argv.slice(2).map(a => a.startsWith("--min-score") ? ["minScore", Number(a.split("=")[1])] : [a,true])
);
const MIN_SCORE = Number.isFinite(argMap.minScore) ? argMap.minScore : null;

const safeRead = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const safeJSON = (p) => { try { const s = safeRead(p); return s ? JSON.parse(s) : null; } catch { return null; } };
const exists = (p) => fs.existsSync(p);
const git = (cmd) => { try { return execSync(`git ${cmd}`, { stdio: ["ignore","pipe","ignore"] }).toString().trim(); } catch { return ""; } };
const listTracked = (globLike) => { try { return git(`ls-files "${globLike}"`).split("\n").filter(Boolean); } catch { return []; } };
const listTrackedDir = (dir) => listTracked(`${dir}/**`).filter(f => f.startsWith(dir + "/"));
const uniq = (arr) => [...new Set(arr)];
const md = { h:(n,s)=>`${"#".repeat(n)} ${s}`, li:(s)=>`- ${s}`, code:(lang,s)=>"```"+lang+"\n"+s+"\n```" };
const green = (b) => b ? "GREEN" : "RED";

// git snapshot
const gitTop = git("rev-parse --show-toplevel") || CWD;
const gitHead = git("rev-parse --short HEAD");
const gitLast = git(`--no-pager log -1 --pretty='format:%h • %ad • %s' --date=iso`);
const wdCount = (()=>{ const s=git("status --porcelain=v1"); return s ? s.split("\n").filter(Boolean).length : 0; })();

// meta
const meta = {
  systemVersionPath: "meta/system_version.json",
  validationRegistryPath: "meta/validation_registry.json",
  promptInventoryPath: "meta/Prompt_Inventory.md",
};
const metaBlueprints = listTracked("meta/*blueprint*").sort();
const metaHorizons  = listTracked("meta/*horizon*").sort();
const metaDrift     = listTracked("meta/*drift*").sort();

const sys = safeJSON(meta.systemVersionPath) || {};
const versionRaw = sys.version || sys.current || "";
const freeze = sys.freeze || sys.freezestate || "";
const cycle = sys.cycle || sys.current_cycle || "";
const versionMinor = (() => { const m=String(versionRaw).match(/^v?(\d+)\.(\d+)/i); return m ? `v${m[1]}.${m[2]}` : ""; })();

// docs
const docs = {
  lessonsDir: "docs/lessons",
  reportsDir: "docs/reports",
};
const lessons = exists(docs.lessonsDir) ? listTrackedDir(docs.lessonsDir) : [];
const reports = exists(docs.reportsDir) ? listTrackedDir(docs.reportsDir) : [];

// artefacts
const arteRoot = "artefacts/reports";
const weeklyCandidates = uniq(
  listTracked(`${arteRoot}/**`).map(p => {
    const segs = p.split("/");
    const i = segs.indexOf("reports");
    if (i>=0 && segs[i+1]?.startsWith("weekly_")) return segs.slice(0, i+2).join("/");
    return null;
  }).filter(Boolean)
).sort();
const expectedWeeklyName = versionMinor ? `weekly_${versionMinor}` : null;
const expectedWeeklyPath = expectedWeeklyName ? path.join(arteRoot, expectedWeeklyName) : null;
const hasExpectedWeekly  = expectedWeeklyPath ? exists(expectedWeeklyPath) : false;
const findingsPattern = (() => {
  const base="forecast_drift_findings";
  if (versionMinor) return `${base}_${versionMinor}.md`;
  if (versionRaw)  return `${base}_${versionRaw}.md`;
  return `${base}_*.md`;
})();
const findingsFiles = listTracked(`**/${findingsPattern}`);

// scripts/workflows
const scriptsDir = "scripts";
const scriptsTracked = exists(scriptsDir) ? listTrackedDir(scriptsDir) : [];
const expectedScripts = [
  "scripts/sanity_check.mjs",
  "scripts/sanity_v2_4_check.mjs",
  "scripts/computeDriftScore.mjs",
  "scripts/log_session.mjs"
];
const expectedPresence = Object.fromEntries(expectedScripts.map(p => [p, exists(p)]));

const wfDir = ".github/workflows";
const wfFiles = exists(wfDir) ? listTrackedDir(wfDir) : [];

// health
const health = {
  metaCore: exists(meta.systemVersionPath) && exists(meta.validationRegistryPath),
  hasDriftSpec: metaDrift.length > 0,
  docsCore: exists(docs.lessonsDir) && exists(docs.reportsDir),
  weeklyOk: hasExpectedWeekly || weeklyCandidates.length > 0,
  scriptsOk: scriptsTracked.length > 0,
  workflowsOk: wfFiles.length > 0,
};
const score5 = (health.metaCore?1:0)+(health.docsCore?1:0)+(health.weeklyOk?1:0)+(health.scriptsOk?1:0)+(health.workflowsOk?1:0);

const summary = {
  startedAt: new Date().toISOString(),
  cwd: CWD,
  git: { top: gitTop, head: gitHead, workingTreeChanges: wdCount, lastCommit: gitLast },
  meta: {
    versionRaw, versionMinor, freeze, cycle,
    driftSpecs: metaDrift,
    blueprints: metaBlueprints, horizons: metaHorizons,
    systemVersionPath: meta.systemVersionPath,
    validationRegistryPath: meta.validationRegistryPath
  },
  docs: { lessonsDir: docs.lessonsDir, lessonsCount: lessons.length, reportsDir: docs.reportsDir, reportsCount: reports.length },
  artefacts: { reportsRoot: arteRoot, weeklyDirs: weeklyCandidates, expectedWeeklyPath, hasExpectedWeekly, findingsFiles },
  scripts: { count: scriptsTracked.length, expectedPresence },
  workflows: { count: wfFiles.length, files: wfFiles },
  health: { ...health, score5 }
};

if (WANT_JSON) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

const lines=[];
lines.push(md.h(1,"DIAG-P-CORE · Adaptive Read-Only Diagnosis"));
lines.push("");
lines.push(md.h(2,"System Snapshot"));
lines.push(md.li(`Start: \`${summary.startedAt}\``));
lines.push(md.li(`Git HEAD: \`${gitHead||"n/a"}\` • WD changes: ${wdCount}`));
lines.push(md.li(`Last commit: ${gitLast||"n/a"}`));
lines.push("");
lines.push(md.h(2,"Meta"));
lines.push(md.li(`system_version.json: ${exists(meta.systemVersionPath)?"present":"missing"}`));
lines.push(md.li(`validation_registry.json: ${exists(meta.validationRegistryPath)?"present":"missing"}`));
lines.push(md.li(`drift spec(s): ${summary.meta.driftSpecs.length?summary.meta.driftSpecs.join(", "):"none"}`));
lines.push(md.li(`version: \`${versionRaw||"n/a"}\` → minor: \`${versionMinor||"n/a"}\` • cycle: \`${cycle||"n/a"}\` • freeze: \`${freeze||"n/a"}\``));
lines.push("");
lines.push(md.h(2,"Docs & Reports"));
lines.push(md.li(`Lessons: ${summary.docs.lessonsCount} • dir: \`${docs.lessonsDir}\``));
lines.push(md.li(`Reports: ${summary.docs.reportsCount} • dir: \`${docs.reportsDir}\``));
lines.push("");
lines.push(md.h(2,"Artefacts"));
lines.push(md.li(`Weekly dirs: ${summary.artefacts.weeklyDirs.length?summary.artefacts.weeklyDirs.join(", "):"none"}`));
if (expectedWeeklyPath) lines.push(md.li(`Expected weekly for version: \`${expectedWeeklyPath}\` → ${hasExpectedWeekly?"present":"missing"}`));
lines.push(md.li(`Findings file(s): ${summary.artefacts.findingsFiles.length?summary.artefacts.findingsFiles.join(", "):"none"}`));
lines.push("");
lines.push(md.h(2,"Scripts & Workflows"));
lines.push(md.li(`Scripts tracked: ${summary.scripts.count}`));
lines.push(md.li(`Key scripts presence:`));
Object.entries(summary.scripts.expectedPresence).forEach(([k,v])=>lines.push(`  - ${k}: ${v?"present":"missing"}`));
lines.push(md.li(`Workflows: ${summary.workflows.count}`));
if (summary.workflows.count) lines.push(md.code("", summary.workflows.files.map(f=>` - ${f}`).join("\n")));
lines.push("");
lines.push(md.h(2,"Health Summary"));
const greenTxt=(b,msg,tip="")=>`${green(b)}${tip?" — "+tip:""}`;
lines.push(md.li(`Meta core: ${greenTxt(health.metaCore, "", health.metaCore?"":"add system_version.json + validation_registry.json")}`));
lines.push(md.li(`Drift spec present: ${greenTxt(health.hasDriftSpec, "", health.hasDriftSpec?"":"add meta/drift_spec_*.md")}`));
lines.push(md.li(`Docs core: ${greenTxt(health.docsCore)}`));
lines.push(md.li(`Weekly artefacts: ${greenTxt(health.weeklyOk, "", (!health.weeklyOk&&expectedWeeklyPath)?`create ${expectedWeeklyPath}`:"")}`));
lines.push(md.li(`Scripts available: ${greenTxt(health.scriptsOk)}`));
lines.push(md.li(`Workflows available: ${greenTxt(health.workflowsOk)}`));
lines.push(md.li(`Score (0–5): **${score5}**`));
console.log(lines.join("\n"));

if (MIN_SCORE !== null && score5 < MIN_SCORE) { process.exitCode = 1; }
