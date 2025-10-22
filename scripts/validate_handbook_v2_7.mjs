#!/usr/bin/env node
import fs from "fs";

const TPL = ".github/pull_request_template.md";
const required = [
  /^# AI-First Handbook Compliance/m,
  /^## Intent/m,
  /^## Logging Reference/m,
  /^## Policy Source/m,
  /^## Policy Version/m,
  /^## Ticket/m
];

function die(msg){ console.error(msg); process.exit(1); }
function ok(msg){ console.log(`OK ${msg}`); }

let body = "";
const ev = process.env.GITHUB_EVENT_PATH;
if (ev && fs.existsSync(ev)) {
  try {
    const payload = JSON.parse(fs.readFileSync(ev, "utf8"));
    body = payload.pull_request?.body || "";
  } catch {}
}
if (!body) {
  if (!fs.existsSync(TPL)) die(`Missing ${TPL} and no PR body available`);
  body = fs.readFileSync(TPL, "utf8");
}

for (const re of required) {
  if (!re.test(body)) die(`Missing required section: ${re}`);
  ok(re);
}

// Semantic checks
if (!/artefacts\/logs\//.test(body)) die("Logging Reference must point to artefacts/logs/…");
if (!/Policy Version\s*\n?v\d+\.\d+(\.\d+)?/i.test(body)) die("Policy Version must be semantic (vX.Y[.Z])");
// Ticket is recommended to be hard fail here for strict; adapt if you prefer warn:
if (!/(AT|GOV|CI|OPS|META)-(?:[A-Z]+-)?\d{3,}/.test(body)) die("Ticket reference (AT-/GOV-/CI-/OPS-/META-####) is required in strict mode.");

console.log("Handbook compliance OK (v2.7 strict).");

