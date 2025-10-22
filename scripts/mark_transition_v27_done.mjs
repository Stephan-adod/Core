#!/usr/bin/env node
/**
 * Setzt in artefacts/logs/transition_v2.7_strict_activation.md:
 * completed: true + lessons: ["L-015"]  (idempotent)
 */
import fs from "fs"; import path from "path";
const file = "artefacts/logs/transition_v2.7_strict_activation.md";

function ensure(){ if(!fs.existsSync(file)){ fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, "# Transition — Phase 2.7 Strict Activation\n"); } }

function upsert(){
  let t = fs.readFileSync(file, "utf8");
  if(!/^# Transition/m.test(t)) t = "# Transition — Phase 2.7 Strict Activation\n" + t;

  if(!/completed:\s*(true|false)/.test(t)){
    t += "\ncompleted: true\n";
  } else {
    t = t.replace(/completed:\s*false/g, "completed: true");
  }

  if(!/lessons:\s*\[/.test(t)){
    t += `lessons: ["L-015"]\n`;
  } else if(!/L-015/.test(t)){
    t = t.replace(/lessons:\s*\[([^\]]*)\]/, (m, inner) => `lessons: [${inner ? inner.trim()+", " : ""}"L-015"]`);
  }

  fs.writeFileSync(file, t);
  console.log("Transition v2.7 marked as completed with lessons [L-015].");
}

ensure(); upsert();
