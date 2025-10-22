#!/usr/bin/env node
import fs from "fs"; import path from "path";

const OUT_MD = "artefacts/logs/diagnostic_report_v2_9.md";
const OUT_JSON = "artefacts/logs/meta_sync_status_v2_9.json";

function exists(p){ try { fs.accessSync(p); return true; } catch { return false; } }

const report = {
  timestamp: new Date().toISOString(),
  phase: "v2.9",
  docs_present: exists("README.md") && exists("docs"),
  lessons_log: exists("artefacts/logs/lessons_log.csv"),
  confidence: {
    result_json: exists("artefacts/logs/confidence_result_v2_9.json"),
    trend_csv: exists("artefacts/logs/confidence_trend_v2_9.csv")
  },
  hygiene_report: exists("artefacts/logs/doc_hygiene_report_v2_9.json")
};

fs.mkdirSync(path.dirname(OUT_MD),{recursive:true});
fs.writeFileSync(OUT_MD, `# Diagnostic Report v2.9

```json
${JSON.stringify(report,null,2)}
```
`);
fs.writeFileSync(OUT_JSON, JSON.stringify(report,null,2));
console.log("✅ v2.9 diagnostic written.");
