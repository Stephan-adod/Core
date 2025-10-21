import fs from "fs";
import path from "path";

const deny = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stat = fs.statSync(entryPath);
    if (stat.isDirectory()) {
      if (entryPath.startsWith("docs" + path.sep + "archive")) continue;
      if (entryPath.startsWith("meta" + path.sep + "snapshots")) continue;
      walk(entryPath);
    } else if (entryPath.endsWith(".md")) {
      const text = fs.readFileSync(entryPath, "utf8");
      if (/version:\s*v2\.2\./.test(text)) {
        deny.push(entryPath);
      }
    }
  }
}

["meta", "docs"].forEach((dir) => {
  if (fs.existsSync(dir)) {
    walk(dir);
  }
});

if (deny.length) {
  console.error("❌ legacy v2.2 files in active scope:", deny);
  process.exit(1);
}

console.log("✅ no legacy v2.2 in active scope");
