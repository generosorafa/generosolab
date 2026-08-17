import { copyFile, cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const projectRoot = resolve(".");
const buildRoot = resolve("pages-dist");
const directories = ["assets", "metodologia", "privacidade", "termos"];
const files = ["404.html", "index.html", "favicon.svg", "og-generoso-lab.png", "market.json"];

function safeTarget(relativePath) {
  const target = resolve(projectRoot, relativePath);
  if (!target.startsWith(`${projectRoot}${sep}`)) throw new Error(`Destino inválido: ${relativePath}`);
  return target;
}

async function normalizeGeneratedText(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await normalizeGeneratedText(path);
    if (entry.isFile() && /\.(?:css|html|js)$/.test(entry.name)) {
      const source = await readFile(path, "utf8");
      await writeFile(path, source.replace(/[ \t]+$/gm, "").replace(/^ +\t/gm, "\t"));
    }
  }
}

for (const directory of directories) {
  const target = safeTarget(directory);
  await rm(target, { recursive: true, force: true });
  await cp(resolve(buildRoot, directory), target, { recursive: true });
}

for (const file of files) {
  await copyFile(resolve(buildRoot, file), safeTarget(file));
}

await normalizeGeneratedText(safeTarget("assets"));
await writeFile(safeTarget(".nojekyll"), "");
