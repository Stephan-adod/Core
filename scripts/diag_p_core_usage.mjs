import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const repoRoot = path.resolve(__dirname, '..');
  const jsonPath = path.join(repoRoot, 'docs', 'reports', 'meta_inventory_v2.4.json');

  try {
    const raw = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(raw);
    console.log('diag_p_core summary');
    console.log('-------------------');
    console.log(`status: ${data.status ?? 'unknown'}`);
    console.log(`message: ${data.message ?? 'n/a'}`);
    console.log(`generatedAt: ${data.generatedAt ?? 'n/a'}`);
  } catch (error) {
    console.warn('Unable to load meta inventory snapshot:', error.message);
  }
}

main().catch((error) => {
  console.error('diag_p_core_usage failed:', error);
  process.exitCode = 1;
});
