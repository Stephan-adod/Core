#!/usr/bin/env node
/**
 * Appends a new reflection block to L-016 Adaptive Lesson.
 * Usage: node scripts/append_phase_reflection.mjs "v2.9 Predictive Governance" "Kurze Notiz"
 */
import fs from "fs";

const file = "artefacts/logs/lessons/L-016_adaptive_baseline.md";
const phase = process.argv[2];
const note = process.argv[3] || "";

if (!phase) {
  console.error("Usage: node scripts/append_phase_reflection.mjs <phase> <note>");
  process.exit(1);
}

const block = `
---

## Phase ${phase}
**Summary:**  
${note || "TBD"}

**Reflection:**  
> [Your Reflection Here]
`;

fs.appendFileSync(file, block);
console.log(`✅ Added reflection block for ${phase}`);

