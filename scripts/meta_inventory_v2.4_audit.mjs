import fs from "fs";
import path from "path";

const TARGET = "v2.4.7";
const SCAN = ["meta", "docs"]; // read-only scan

function walk(dir) {
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out.filter(p => p.endsWith(".md") || p.endsWith(".json"));
}

function readFM(md) {
  const m = md.match(/---([\s\S]*?)---/);
  if (!m) return {};
  const head = m[1];
  const kv = {};
  head.split("\n").forEach(line => {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) kv[mm[1]] = mm[2].trim();
  });
  return kv;
}

const items = [];
for (const root of SCAN) {
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root)) {
    if (!f.endsWith(".md")) continue;
    const raw = fs.readFileSync(f, "utf8");
    const fm = readFM(raw);
    const version = fm.version || null;
    const status = fm.status || "unknown";
    const updated = fm.updated || null;
    const layer = fm.layer || null;
    const owner = fm.owner || null;

    items.push({ path: f, version, status, updated, layer, owner });
  }
}

const json = JSON.stringify(items, null, 2);
const outDir = "docs/reports";
if (!process.argv.includes("--readonly-local")) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/meta_inventory_v2.4.json`, json);
  fs.writeFileSync(
    `${outDir}/meta_inventory_v2.4.md`,
    `# Meta Inventory v2.4 (Sanity)\n_target: ${TARGET}_\n\n| path | version | status | updated | layer | owner |\n| --- | --- | --- | --- | --- | --- |\n${items
      .map(
        i => `| \`${i.path}\` | ${i.version || ""} | ${i.status} | ${i.updated || ""} | ${i.layer || ""} | ${i.owner || ""} |`
      )
      .join("\n")}\n`
  );
  console.log(`[inventory] wrote docs/reports/meta_inventory_v2.4.(json|md)`);
} else {
  console.log(json);
}
