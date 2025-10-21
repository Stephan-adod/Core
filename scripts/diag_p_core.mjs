import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '..');
  const reportsDir = path.join(repoRoot, 'docs', 'reports');

  const jsonPath = path.join(reportsDir, 'meta_inventory_v2.4.json');
  const mdPath = path.join(reportsDir, 'meta_inventory_v2.4.md');

  const timestamp = new Date().toISOString();
  const placeholder = {
    status: 'pending',
    message: 'diag_p_core placeholder output',
    generatedAt: timestamp,
  };

  const jsonPayload = `${JSON.stringify(placeholder, null, 2)}\n`;
  const markdownPayload = `# diag_p_core placeholder\n\nGenerated at ${timestamp}.\n`;

  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(jsonPath, jsonPayload, 'utf8');
  await fs.writeFile(mdPath, markdownPayload, 'utf8');

  console.log('diag_p_core stub completed.');
}

main().catch((error) => {
  console.error('diag_p_core stub failed:', error);
  process.exitCode = 1;
});
