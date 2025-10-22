#!/usr/bin/env node
import fs from "fs";

const out = process.env.GITHUB_OUTPUT || process.env.OUT_FILE || null;
const eventPath = process.env.GITHUB_EVENT_PATH;
const inputMode = (process.env.INPUT_MODE || "").toLowerCase();
const refName   = process.env.GITHUB_REF_NAME || "";
const headRef   = process.env.GITHUB_HEAD_REF || "";

let mode   = "strict";
let reason = "default";

function set(k, v){
  if (out) fs.appendFileSync(out, `${k}=${v}\n`);
  console.log(`${k}: ${v}`);
}

try {
  const ev = eventPath && fs.existsSync(eventPath)
    ? JSON.parse(fs.readFileSync(eventPath, "utf8"))
    : {};
  const labels = (ev.pull_request?.labels || []).map(l => (l.name || "").toLowerCase());
  const byLabel  = labels.includes("lean-ok");
  const byInput  = inputMode === "lean";
  const isHotfix = /^hotfix\//i.test(headRef || refName);

  if (byLabel)    { mode = "lean"; reason = "label:lean-ok"; }
  else if (byInput){ mode = "lean"; reason = "input:mode=lean"; }
  else if (isHotfix){ mode = "lean"; reason = "branch:hotfix/*"; }

} catch (e) {
  console.warn("Resolver fallback (strict).", e?.message || "");
}

set("mode", mode);
set("reason", reason);
