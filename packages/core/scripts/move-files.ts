import { globby } from "globby";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moveFiles = async () => {
  const rootDir = path.resolve(__dirname, "..");
  const srcDir = path.join(rootDir, "src");
  const distDir = path.join(rootDir, "dist");

  const files = await globby(`${srcDir}/**/*.{html,css}`);

  const promises: Promise<void>[] = [];

  for (const file of files) {
    const innerDir = path.relative(srcDir, file);
    const fileDist = path.join(distDir, innerDir);

    promises.push(fs.copyFile(file, fileDist));
  }

  return Promise.all(promises);
};

void (async () => {
  await moveFiles();
})();
