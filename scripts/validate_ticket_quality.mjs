import fs from "fs";

const file = process.argv[2];
if (!file) { console.error("usage: node scripts/validate_ticket_quality.mjs <idea.md>"); process.exit(2); }
const s = fs.readFileSync(file, "utf8");

// sehr einfache Abschnitts-Checks
function has(h) { return new RegExp(`^##\\s*${h}\\b`, "im").test(s); }
function section(h) {
  const m = s.match(new RegExp(`^##\\s*${h}\\b[\\s\\S]*?(?=^##\\s|$)`, "im"));
  return m ? m[0] : "";
}

const clarity = (has("Summary") && section("Summary").trim().split(/\n/).filter(Boolean).length >= 2) ? 1 : 0;
const goal    = (has("Goal") && /KPI|Target|Outcome/i.test(section("Goal"))) ? 1 : 0;
const impact  = (has("Impact") && section("Impact").trim().split(/\n/).length >= 2) ? 1 : 0;
const dorSec  = section("Definition of Ready");
const dor     = (has("Definition of Ready") && (dorSec.match(/\[x\]/gi)||[]).length >= 3) ? 1 : 0;
const owner   = /Owner\s*:\s*\S+/i.test(s) || /Verantwortlich\s*:\s*\S+/i.test(s) ? 1 : 0;
const step    = (has("Next Step") && /- |\d\)/.test(section("Next Step"))) ? 1 : 0;

const score = Math.round(
  clarity*30 + goal*15 + impact*20 + dor*20 + owner*10 + step*5
);

const result = { file, score, pass: score>=70, checks: {clarity,goal,impact,dor,owner,step} };
console.log(JSON.stringify(result, null, 2));
process.exit(result.pass ? 0 : 1);
