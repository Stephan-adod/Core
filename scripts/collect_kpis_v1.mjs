import fs from "fs";
import path from "path";

const exists = (p) => fs.existsSync(p);
const read = (p) => fs.readFileSync(p, "utf8");
const list = (dir) => exists(dir) ? fs.readdirSync(dir) : [];

function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const block = m[1];
  const obj = {};
  block.split("\n").forEach(line => {
    const mm = line.match(/^\s*([A-Za-z_][\w-]*):\s*(.*)\s*$/);
    if (mm) {
      let val = mm[2].trim();
      val = val.replace(/^"(.*)"$/,'$1').replace(/^'(.*)'$/,'$1');
      if (/^\[.*\]$/.test(val)) {
        obj[mm[1]] = val.slice(1,-1).split(",").map(s=>s.trim().replace(/^"(.*)"$/,'$1'));
      } else {
        obj[mm[1]] = val;
      }
    }
  });
  return obj;
}

function isoWeek(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "unknown";
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1)/7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2,"0")}`;
}

const sys = exists("meta/system_version.json") ? JSON.parse(read("meta/system_version.json")) : { target_version: "v2.2" };
const LOG = "artefacts/logs/lesson_log.csv";
const LESSON_DIR = "artefacts/lessons/lesson_snippets";
const SYN_DIR = "artefacts/syntheses";

if (!exists(LOG)) {
  console.error(`Missing ${LOG}.`);
  process.exit(1);
}

const rows = read(LOG).trim().split(/\r?\n/).slice(1).filter(Boolean);
const log = rows.map(line => {
  const parts = line.split(",");
  const id = (parts[0]||"").trim().replace(/^['"]|['"]$/g, "");
  const date = (parts[7]||"").trim().replace(/^['"]|['"]$/g, "");
  const impact = (parts[4]||"").trim().replace(/^['"]|['"]$/g, "");
  const rawCats = (parts[3]||"").replace(/^['"]|['"]$/g, "");
  const cats = rawCats.split(";")
    .map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
  const rawRel = (parts[6]||"");
  const relatedDocs = rawRel.split(";")
    .map(s => s.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
  return { id, date, relatedDocs, impact, categories: cats };
});

const lessonsPerWeek = {};
log.forEach(r => {
  const wk = isoWeek(r.date);
  lessonsPerWeek[wk] = (lessonsPerWeek[wk]||0)+1;
});

const categoryCoverage = {};
const impactMix = {};
let relatedDocsTotal = 0;
log.forEach(r=>{
  r.categories.forEach(c=> categoryCoverage[c] = (categoryCoverage[c]||0)+1);
  impactMix[r.impact] = (impactMix[r.impact]||0)+1;
  relatedDocsTotal += r.relatedDocs.length;
});
const avgRelatedDocs = log.length ? +(relatedDocsTotal / log.length).toFixed(2) : 0;

const included = new Set();
list(SYN_DIR).filter(f=>/^S-\d+/.test(f)).forEach(f=>{
  const meta = parseFrontmatter(read(path.join(SYN_DIR,f)));
  const src = Array.isArray(meta.source) ? meta.source : [];
  src.forEach(x=>included.add(String(x).trim()));
});
const aggregatedCount = log.reduce((acc,r)=> acc + (included.has(r.id)?1:0), 0);
const integrationRate = log.length ? +(aggregatedCount / log.length).toFixed(2) : 0;

const KPIS = {
  generated_at: new Date().toISOString(),
  target_version: sys.target_version || "v2.2",
  totals: {
    total_lessons: log.length,
    aggregated_in_synthesis: aggregatedCount
  },
  velocity: { lessons_per_week: lessonsPerWeek },
  integration: { rate: integrationRate },
  coverage: { category_coverage: categoryCoverage, impact_mix: impactMix },
  reflection: { avg_related_docs: avgRelatedDocs },
  notes: [
    "integration.rate = lessons referenced by any S-### / total lessons",
    "velocity uses ISO week from lesson_log.csv date"
  ]
};

const OUT_DIR = "artefacts/reports";
if (!exists(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR,"governance_kpis.json"), JSON.stringify(KPIS, null, 2), "utf8");

const md = [
  "---",
  `title: Governance KPIs (v2.2)`,
  `generated: ${KPIS.generated_at}`,
  "---",
  "",
  "# Governance KPI Report (v2.2)",
  "",
  `**Target Version:** ${KPIS.target_version}`,
  "",
  "## Totals",
  `- total_lessons: ${KPIS.totals.total_lessons}`,
  `- aggregated_in_synthesis: ${KPIS.totals.aggregated_in_synthesis}`,
  "",
  "## Velocity (lessons per ISO week)",
  "```json",
  JSON.stringify(KPIS.velocity.lessons_per_week, null, 2),
  "```",
  "",
  "## Integration",
  `- integration_rate: ${KPIS.integration.rate}`,
  "",
  "## Coverage",
  "```json",
  JSON.stringify({ category_coverage: KPIS.coverage.category_coverage, impact_mix: KPIS.coverage.impact_mix }, null, 2),
  "```",
  "",
  "## Reflection",
  `- avg_related_docs: ${KPIS.reflection.avg_related_docs}`,
  "",
  "_Notes_: " + KPIS.notes.join(" · ")
].join("\n");

fs.writeFileSync(path.join(OUT_DIR,"governance_kpis.md"), md, "utf8");
console.log("KPIs generated → artefacts/reports/governance_kpis.(json|md)");
