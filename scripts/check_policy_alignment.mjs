import fs from 'fs';
const content = fs.readFileSync('artefacts/logs/backlog_matrix_v1.1.md','utf8');
if(!content.includes('Governance')) {
  console.error('❌ Policy Reference missing in backlog matrix header');
  process.exit(1);
}
console.log('✅ Policy Alignment confirmed');
