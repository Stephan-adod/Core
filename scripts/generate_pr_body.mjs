#!/usr/bin/env node
/**
 * Generate/patch a PR body using the repo template if the Compliance block is missing.
 * Inputs via env:
 *   PR_NUMBER, REPO, OWNER, BASE_REF (optional)
 * Output to STDOUT: final body string (UTF-8).
 */
import { readFileSync } from 'fs';

function hasCompliance(body='') {
  return /##\s*AI-First Handbook Compliance/i.test(body);
}

function loadLocalTemplate() {
  // Use the repo file checked out by actions/checkout
  try {
    return readFileSync('.github/pull_request_template.md','utf8');
  } catch {
    return '';
  }
}

function synthesizeBody(existing='') {
  const tpl = loadLocalTemplate();
  if (!tpl) {
    // fallback minimal scaffold
    return [
      '## AI-First Handbook Compliance',
      '- [ ] One PR = One Intent',
      '- [ ] Clarity over Coverage',
      '- [ ] Logged (artefacts/logs/**)',
      '- [ ] Bounded Mini-Prompt',
      '',
      '### Intent',
      '(Kurz & präzise, max. ~1200 Zeichen.)',
      '',
      '### Logging Reference',
      'artefacts/logs/transition_xxx.md',
      '',
      'Policy Source: meta/AI_First_Handbook.md',
      'Policy Version: v2.4.7',
      '',
      '### Ticket (empfohlen)',
      'AT-#### / GOV-#### / CI-#### / OPS-#### / META-####',
      ''
    ].join('\n');
  }
  // Append the template after any existing summary if no compliance present
  const trimmed = (existing || '').trim();
  return trimmed ? `${trimmed}\n\n${tpl}` : tpl;
}

// Read PR body from file/stdin if present (Actions will pass it via env/github-script)
let input = '';
try { input = readFileSync(0,'utf8'); } catch {}
const out = hasCompliance(input) ? input : synthesizeBody(input);
process.stdout.write(out);
