import fs from 'fs';

const matrixPath = 'artefacts/logs/backlog_matrix_v1.1.md';
const rows = fs.readFileSync(matrixPath, 'utf8').split('\n').filter(l => l.startsWith('| AT-'));
const invalid = [];

rows.forEach(r => {
  const cols = r
    .split('|')
    .map(c => c.trim())
    .filter(Boolean);
  const [id, layer, title, focus, clarity, consistency, feasibility, impact, aiSupport, score, status, owner] = cols;
  const numeric = [focus, clarity, consistency, feasibility, impact, aiSupport].map(Number);
  const avg = numeric.reduce((a,b)=>a+b,0)/numeric.length;
  if (avg < 7 || status.includes('draft')) invalid.push(id);
});

if (invalid.length) {
  console.error('❌ Failed Quality Gate for tickets:', invalid);
  process.exit(1);
} else {
  console.log('✅ All tickets pass Quality Gate');
}
