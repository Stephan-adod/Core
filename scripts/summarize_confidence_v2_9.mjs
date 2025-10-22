#!/usr/bin/env node
import fs from "fs";

const resPath = "artefacts/logs/confidence_result_v2_9.json";
const outMd   = "artefacts/logs/confidence_summary_v2_9.md";

if (!fs.existsSync(resPath)) { console.error("❌ No confidence result"); process.exit(1); }
const r = JSON.parse(fs.readFileSync(resPath, "utf8"));

const md = `# Confidence Summary v2.9
- Timestamp: ${r.timestamp}
- Score: **${r.confidence_score}** (${r.confidence_level})
- Branch: \`${r.context.branch}\`
- Changed Files: ${r.context.changed_files} | +${r.context.additions} / -${r.context.deletions}
- Labels: ${r.context.labels.join(", ") || "—"}

## Reasons
${(r.reasons||[]).map(x=>`- ${x}`).join("\n") || "- —"}

`;
fs.writeFileSync(outMd, md);
console.log("📝 Summary written →", outMd);
