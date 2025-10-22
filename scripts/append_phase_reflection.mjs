#!/usr/bin/env node
/**
 * v2.8→v2.9 · Append Reflection Script (refined)
 * Appends a new reflection block to L-016 Adaptive Lesson.
 * Usage:
 *   node scripts/append_phase_reflection.mjs "v2.9 Predictive Governance" "Kurznotiz"
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.resolve(__dirname, "..", "artefacts", "logs", "lessons", "L-016_adaptive_baseline.md");
const phase = process.argv[2];
const note = process.argv[3] || "";

if (!phase) {
  console.error("❌  Usage: node scripts/append_phase_reflection.mjs <phase> <note>");
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`❌  Lesson file not found: ${file}`);
  process.exit(1);
}

const now = new Date().toISOString().split("T")[0];
const block = `
---

## Phase ${phase}
📅 Date: ${now}

**Summary**  
${note || "TBD"}

**Findings**  
- Context recorded
- Confidence baseline stable
- Ready for next phase inputs

**Reflection**  
> [Add qualitative insight or observation here]
`;

fs.appendFileSync(file, block);
console.log(`✅ Reflection appended for ${phase}`);
