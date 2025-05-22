import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { PackageJson } from "../types.ts";
import { getFileMeta } from "./get-file-meta.ts";

export const resolvePkg = async (): Promise<PackageJson> => {
  const { dirname } = getFileMeta(import.meta.url);

  const packageDir = path.resolve(dirname, "..");
  const pkgJsonPath = path.join(packageDir, "package.json");

  const pkgJsonContent = await fs.readFile(pkgJsonPath, "utf-8");
  const pkgJson = JSON.parse(pkgJsonContent) as PackageJson;

  return pkgJson;
};
