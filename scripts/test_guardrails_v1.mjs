import fs from "fs";

// Load registry or fallback
const regPath = "meta/validation_registry.json";
const REG = fs.existsSync(regPath)
  ? JSON.parse(fs.readFileSync(regPath, "utf8"))
  : { related_docs_allowed_prefixes: ["meta/", "docs/"] };

const allow = (p) => REG.related_docs_allowed_prefixes.some((pref) => p.startsWith(pref));

const GOOD = [
  "meta/_fixtures/ok.md",
  "docs/_fixtures/ok.md",
];

const BAD = [
  "artefacts/snapshots/system_state_v2.2.5.json",
  "artefacts/reports/governance_kpis.json",
  "logs/lesson_log.csv",
  "tmp/something.md",
  "README-no-prefix.md"
];

const errors = [];

// Existence check for GOOD fixtures
GOOD.forEach((p) => {
  if (!fs.existsSync(p)) errors.push(`Fixture missing: ${p}`);
  if (!allow(p)) errors.push(`Should be allowed but is not: ${p}`);
});

// BAD must not be allowed (existence egal)
BAD.forEach((p) => {
  if (allow(p)) errors.push(`Should NOT be allowed but is: ${p}`);
});

const ok = errors.length === 0;

console.log(ok ? "✅ guardrails: registry allow/deny logic OK"
               : "❌ guardrails: issues found");
errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
process.exit(ok ? 0 : 1);
