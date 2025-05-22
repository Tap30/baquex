import * as path from "node:path";
import { cwd as defaultCwd } from "node:process";

export const resolveCwd = (customCwd?: string) => {
  let cwd: string;

  if (!customCwd) {
    cwd = defaultCwd();
  } else {
    cwd = customCwd;

    if (!path.isAbsolute(cwd)) {
      cwd = path.resolve(defaultCwd(), cwd);
    }
  }

  return cwd;
};
