// === Lessons Validator v2.4.7 ===
import fs from "fs";
import path from "path";

const TARGET = process.env.LESSONS_TARGET_VERSION || "v2.4.7";
const ROOTS = ["docs/lessons"];

const listMarkdown = (dir) => {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    if (!fs.existsSync(current)) continue;
    for (const entry of fs.readdirSync(current)) {
      const full = path.join(current, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        stack.push(full);
      } else if (full.endsWith(".md")) {
        out.push(full.replace(/\\/g, "/"));
      }
    }
  }
  return out;
};

const readFrontMatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const lines = match[1].split("\n");
  return Object.fromEntries(
    lines
      .map((line) => {
        const idx = line.indexOf(":");
        if (idx < 0) return null;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        return key ? [key, value] : null;
      })
      .filter(Boolean)
  );
};

const files = ROOTS.flatMap((root) => listMarkdown(root));

console.log(
  `\n[lessons-validator] target=${TARGET} roots=${ROOTS.join(",")} files=${files.length}\n`
);

const errors = [];
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const frontMatter = readFrontMatter(content);
  const version = (frontMatter.version || "").trim();
  const status = (frontMatter.status || "").trim();

  if (!version) {
    errors.push(`${file}: missing version in YAML front matter (target ${TARGET})`);
  } else if (version !== TARGET) {
    errors.push(`${file}: has version ${version} but target is ${TARGET}`);
  }

  if (!status) {
    errors.push(`${file}: status missing (expected active)`);
  } else if (status !== "active") {
    errors.push(`${file}: status=${status} (expected active)`);
  }
}

if (errors.length) {
  console.error(`Lessons validation failed (${errors.length} issues):\n` + errors.join("\n"));
  process.exit(1);
}

console.log(`✅ lessons ok (${files.length}) @ target ${TARGET}`);
