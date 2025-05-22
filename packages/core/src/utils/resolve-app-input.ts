import * as path from "node:path";
import { getFileMeta } from "./get-file-meta.ts";

export const resolveAppInput = (): string => {
  const { dirname } = getFileMeta(import.meta.url);

  const rootDir = path.resolve(dirname, "..");
  const appDir = path.join(rootDir, "app");
  const appInput = path.join(appDir, "index.html");

  return appInput;
};
