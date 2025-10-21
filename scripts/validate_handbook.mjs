#!/usr/bin/env node
/**
 * AI-First Handbook Validator · Phase 2 (Safe Start, Refined)
 *
 * Checks (lightweight, robust):
 *  0) Dry-Run Unterstützung via ENV: VALIDATOR_MODE=dry (nur Warnings)
 *  1) policy_source verankert (meta/system_version.json)
 *  2) PR Body geladen (aus GITHUB_EVENT_PATH / input / Datei / STDIN)
 *  3) Compliance-Block vorhanden + mind. 3 Häkchen innerhalb des Blocks
 *  4) Intent-Sektion vorhanden, <= 1200 Zeichen (Bounded Mini-Prompt)
 *  5) Logging-Verweis auf artefacts/logs/ vorhanden
 *  6) (Soft) Ticket-Referenz empfohlen: AT-|GOV-|CI-|OPS-|META- (Warning)
 *  7) (Soft) Policy-Version referenziert: "Policy Version: vX.Y.Z" (Warning)
 *
 * Exitcodes:
 *  - 0: Passed (oder Dry-Run nur Warnings)
 *  - 1: Failed (Blocking errors)
 */

import fs from 'fs';

const isDry = (process.env.VALIDATOR_MODE || '').toLowerCase() === 'dry';
const FAIL = (msg) => {
  console.error(`::error::${msg}`);
  if (!isDry) {
    process.exitCode = 1;
  } else {
    console.warn(`(dry) ${msg}`);
  }
};
const WARN = (msg) => console.warn(`::warning::${msg}`);
const OK = (msg) => console.log(`✅ ${msg}`);

function readJSON(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function readFileSafe(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// 1) policy_source
try {
  const sv = readJSON('meta/system_version.json');
  if (sv.policy_source !== 'meta/AI_First_Handbook.md') {
    FAIL('policy_source in meta/system_version.json ist NICHT "meta/AI_First_Handbook.md". Bitte Phase 1 prüfen.');
  } else {
    OK('policy_source anchored (meta/system_version.json)');
  }
} catch (error) {
  FAIL('meta/system_version.json fehlt oder ist ungültig JSON.');
}

// 2) PR Body laden
let prTitle = '';
let prBody = '';
const evPath = process.env.GITHUB_EVENT_PATH;
if (evPath && fs.existsSync(evPath)) {
  try {
    const ev = readJSON(evPath);
    if (ev.pull_request) {
      prTitle = ev.pull_request.title || '';
      prBody = ev.pull_request.body || '';
    } else if (ev.inputs && typeof ev.inputs.body === 'string') {
      prBody = ev.inputs.body;
    }
  } catch (error) {
    WARN('GITHUB_EVENT_PATH konnte nicht geparst werden. Fallbacks werden genutzt.');
  }
}
if (!prBody.trim()) {
  const maybePath = process.argv[2];
  if (maybePath && fs.existsSync(maybePath)) {
    prBody = readFileSafe(maybePath);
  }
}
if (!prBody.trim()) {
  try {
    prBody = fs.readFileSync(0, 'utf8');
  } catch (error) {
    // ignore
  }
}
if (!prBody || prBody.trim().length < 10) {
  FAIL('PR Body nicht gefunden/zu kurz. Bitte PR-Template nutzen (Compliance, Intent, Logging).');
} else {
  OK('PR Body geladen.');
}

// Hilfsfunktionen
const getSection = (body, header) => {
  // Greife Text von "## header" bis zum nächsten "##" (oder Ende)
  const re = new RegExp(`(^|\\n)#{1,3}\\s*${header}\\b([\\s\\S]*?)(?=\\n#{1,3}\\s|$)`, 'i');
  const match = body.match(re);
  return match ? match[0] : '';
};
const stripMd = (text) =>
  text
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, '')
    .replace(/\[[^\]]*\]\([^\)]+\)/g, '')
    .replace(/[*_>#-]/g, '')
    .trim();

// 3) Compliance-Block + flexible Erfüllungslogik
let complianceBlock = getSection(prBody, 'AI-First Handbook Compliance');
if (!complianceBlock) {
  FAIL('Compliance-Block "AI-First Handbook Compliance" fehlt im PR-Body.');
} else {
  OK('Compliance-Block gefunden.');
  const hasMarker = /<!--\s*AI-SYNTH\b/i.test(prBody);
  const ticks = (complianceBlock.match(/\[(x|X)\]/g) || []).length;
  const bullets = (complianceBlock.match(/^\s*-\s+/gm) || []).length;

  if (hasMarker) {
    OK('AI-Synthesis Marker erkannt – Compliance akzeptiert.');
  } else if (ticks >= 3) {
    OK(`Compliance-Häkchen ok (>=3).`);
  } else if (bullets >= 3) {
    OK(`Compliance-Liste ok (>=3 Einträge ohne Checkboxen).`);
  } else {
    FAIL(`Zu wenige Nachweise im Compliance-Block (Häkchen=${ticks}, Einträge=${bullets}).`);
  }
}

// 4) Intent-Section
const intentMatch =
  getSection(prBody, 'Intent') ||
  getSection(prBody, '## Intent') ||
  getSection(prBody, '### Intent');
if (intentMatch) {
  OK('Intent-Section gefunden.');
  const intentLength = stripMd(intentMatch).length;
  if (intentLength > 1200) {
    FAIL(`Intent zu lang (${intentLength} Zeichen, max 1200). Bitte schärfen (Clarity over Coverage).`);
  } else if (intentLength < 50) {
    WARN(`Intent sehr kurz (${intentLength} Zeichen). Prüfe, ob die Zielsetzung klar genug ist.`);
  } else {
    OK('Intent gebunden (<=1200 Zeichen).');
  }
} else {
  FAIL('Intent-Section fehlt (Überschrift „Intent“).');
}

// 5) Logging-Referenz
const logMatch =
  getSection(prBody, 'Logging Reference') ||
  getSection(prBody, '## Logging Reference') ||
  getSection(prBody, '### Logging Reference');
if (logMatch) {
  OK('Logging-Referenz gefunden.');
} else {
  FAIL('Logging-Referenz fehlt (erwarte Verweis auf „artefacts/logs/…“).');
}

// 6) Policy-Version
const policyMatch = /Policy[- ]Version\s*:\s*([\w.\-]+)/i.exec(prBody);
if (policyMatch) {
  OK(`Policy-Version erkannt: ${policyMatch[1]}`);
} else {
  WARN('Policy-Version im PR-Body fehlt. Empfohlenes Feld: „Policy-Version: vX.Y.Z“.');
}

// 7) (Soft) Ticket-Referenz
if (!/(^|\b)(AT-|GOV-|CI-|OPS-|META-)\d{1,4}\b/i.test(prBody)) {
  WARN('Keine Ticket-Referenz (AT-/GOV-/CI-/OPS-/META-####) gefunden. Empfohlen, aber nicht zwingend.');
} else {
  OK('Ticket-Referenz gefunden.');
}

if (process.exitCode) {
  console.error('❌ Handbook Validation: BLOCKING Fehler vorhanden. Bitte PR-Body nachbessern.');
} else if (isDry) {
  console.log('🟨 Dry-Run abgeschlossen (Warnings möglich, keine Blocker).');
} else {
  console.log('🎉 Handbook Validation PASSED.');
}
