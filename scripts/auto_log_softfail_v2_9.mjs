#!/usr/bin/env node
/**
 * P-016C · Soft-Fail → Lesson Auto-Logging (refined)
 * - Filter: min_score, levels, min_triggers
 * - Dedup: window-days + hash(branch+date+triggers)
 * - Artefakte: Lesson-Snippet, lessons_log.csv, L-016 append, summary MD
 * - Exit: 0 (nie blockierend)
 */
import fs from "fs"; import path from "path"; import crypto from "crypto";

const ADAPTIVE = "artefacts/logs/adaptive_result_v2_8.json";
const CONFJSON = "artefacts/logs/confidence_result_v2_9.json";
const POLICY   = "artefacts/policies/softfail_policy_v2_9.json";
const L016     = "artefacts/logs/lessons/L-016_adaptive_baseline.md";
const LDIR     = "artefacts/logs/lessons/snippets";
const LCSV     = "artefacts/logs/lessons_log.csv";
const SUMMD    = "artefacts/logs/softfail_summary_v2_9.md";
const DEDUPDB  = "artefacts/logs/softfail_dedup_index_v2_9.json";

const nowISO = new Date().toISOString();
const today  = nowISO.slice(0,10);

const exists = p => { try { fs.statSync(p); return true; } catch { return false; } };
const ensureDir = p => fs.mkdirSync(p, { recursive:true });
const readJSON = p => JSON.parse(fs.readFileSync(p, "utf8"));
const sha1 = s => crypto.createHash("sha1").update(s).digest("hex");

function loadPolicy(){
  if (!exists(POLICY)) return { log_levels:["low","medium"], min_score:0.75, min_triggers:1, dedup_window_days:2, owner:"owner", version:"v2.9", tags:["soft-fail"] };
  return readJSON(POLICY);
}
function detectSoftFail(){
  let reason = [], mode=null, level=null, score=null, ctx={};
  if (exists(ADAPTIVE)) {
    try { const a = readJSON(ADAPTIVE);
      mode = a.decision || a.mode;
      if (mode === "soft-fail" || mode === "warn") reason.push("adaptive:soft-fail");
      ctx = a.context || a.ctx || ctx;
    } catch {}
  }
  if (exists(CONFJSON)) {
    try { const c = readJSON(CONFJSON);
      level = c.confidence_level || null;
      score = typeof c.confidence_score === "number" ? c.confidence_score : Number(c.confidence_score);
      const trig = c.triggers || [];
      if (level) reason.push(`confidence:${level}`);
      ctx = { ...(c.context||{}), ...ctx };
      return { level, score, triggers: trig, ctx, reasons: reason };
    } catch {}
  }
  return { level:null, score:null, triggers:[], ctx, reasons:reason };
}
function ensureCsvHeader(){
  const header = "timestamp,id,scope,phase,lesson,source,owner";
  ensureDir(path.dirname(LCSV));
  if (!exists(LCSV)) { fs.writeFileSync(LCSV, header + "\n"); return; }
  const t = fs.readFileSync(LCSV, "utf8"); if (!t.startsWith(header)) fs.writeFileSync(LCSV, header + "\n" + t);
}
function loadDedup(){
  if (!exists(DEDUPDB)) return { items: [] };
  try { return readJSON(DEDUPDB); } catch { return { items: [] }; }
}
function saveDedup(db){ ensureDir(path.dirname(DEDUPDB)); fs.writeFileSync(DEDUPDB, JSON.stringify(db,null,2)); }

(function main(){
  const policy = loadPolicy();
  const det = detectSoftFail();
  const L = det.level, S = det.score, T = det.triggers || [], ctx = det.ctx || {}, reasons = det.reasons || [];

  // Filter (nur relevante Fälle loggen)
  const levelOk = policy.log_levels.includes(String(L||"").toLowerCase());
  const scoreOk = (typeof S === "number") ? (S <= policy.min_score) : true; // loggen wenn Score <= min_score
  const triggersOk = (T.length >= (policy.min_triggers || 1));
  const shouldLog = levelOk && triggersOk && scoreOk;

  if (!shouldLog) {
    const md = `# Soft-Fail Auto-Log (skipped)\n- timestamp: ${nowISO}\n- level: ${L}\n- score: ${S}\n- triggers: ${T.length}\n- reason: filtered by policy\n`;
    fs.writeFileSync(SUMMD, md);
    console.log("ℹ️ Soft-fail present but filtered by policy. Summary written.");
    process.exit(0);
  }

  // Dedup innerhalb des Fensters
  const dedupKey = sha1([today, ctx.branch||"-", (T.join("|")||"-"), L].join("::"));
  const db = loadDedup();
  const horizon = Date.now() - (policy.dedup_window_days * 24 * 60 * 60 * 1000);
  db.items = db.items.filter(x => new Date(x.ts).getTime() >= horizon);
  if (db.items.find(x => x.key === dedupKey)) {
    fs.writeFileSync(SUMMD, `# Soft-Fail Auto-Log (dedup)\n- timestamp: ${nowISO}\n- key: ${dedupKey}\n- status: duplicate within window\n`);
    console.log("ℹ️ Soft-fail duplicate within window → skipped.");
    saveDedup(db);
    process.exit(0);
  }

  // 1) Lesson-Snippet
  ensureDir(LDIR);
  const owner = policy.owner || "owner";
  const id = `L-017-${today.replace(/-/g,"")}-${(ctx.branch||"main").toString().replace(/[^\w.-]/g,"_")}`;
  const snippetPath = path.join(LDIR, `${id}.md`);
  const tags = policy.tags || ["governance","soft-fail"];
  const yaml = `---\nid: ${id}\ntitle: Soft-Fail Snapshot (v2.9)\nversion: v2.4.7\nphase: v2.9\ndate: ${nowISO}\nowner: ${owner}\nsource: ${exists(CONFJSON) ? CONFJSON : ADAPTIVE}\ntags: ${JSON.stringify(tags, null, 2).replace(/\n/g,"")}\n---\n`;
  const body = `# ${id} · Soft-Fail Snapshot\n\n**When:** ${nowISO}  \n**Branch:** \`${ctx.branch || "-"}\`  \n**Changed Files:** ${ctx.changed_files ?? "-"} | **+${ctx.additions ?? 0} / -${ctx.deletions ?? 0}**  \n**Labels:** ${(ctx.labels || []).join(", ") || "—"}  \n\n**Triggers:** ${(T.length?T.join(", "):"—")}  \n**Confidence:** ${typeof S === "number" ? S.toFixed(2) : "n/a"} (${L || "-"})  \n\n## Notes\n- Auto-logged due to policy thresholds (min_score=${policy.min_score}, min_triggers=${policy.min_triggers}).\n- Review context, consider calibration or rule update if pattern repeats.\n`;
  fs.writeFileSync(snippetPath, yaml + body);

  // 2) L-016 Append (falls vorhanden)
  if (exists(L016)) {
    const append = `\n\n---\n\n## Phase v2.9 – Soft-Fail Snapshot\n📅 Date: ${today}\n\n**Branch:** \`${ctx.branch || "-"}\`  \n**Confidence:** ${typeof S === "number" ? S.toFixed(2) : "n/a"} (${L || "-"})  \n**Triggers:** ${(T.length?T.join(", "):"—")}\n\n**Reflection**\n> Auto-logged (${id}). Review pattern; decide on calibration or policy tweak.\n`;
    fs.appendFileSync(L016, append);
  }

  // 3) CSV Log
  ensureCsvHeader();
  const lessonText = `Soft-fail auto-logged (level=${L}, score=${typeof S==="number"?S.toFixed(2):S}); triggers=${T.join("|")||"-"}`;
  const row = [nowISO, id, "governance", "v2.9", JSON.stringify(lessonText), snippetPath, owner].join(",") + "\n";
  fs.appendFileSync(LCSV, row);

  // 4) Summary + Dedup index update
  const sum = `# Soft-Fail Summary v2.9\n- timestamp: ${nowISO}\n- id: ${id}\n- level: ${L}\n- score: ${typeof S === "number" ? S.toFixed(2) : "n/a"}\n- triggers: ${T.join(", ") || "—"}\n- snippet: ${snippetPath}\n`;
  fs.writeFileSync(SUMMD, sum);

  db.items.push({ key: dedupKey, ts: nowISO, id });
  saveDedup(db);

  console.log(`✅ Soft-Fail logged → ${snippetPath}`);
})();
