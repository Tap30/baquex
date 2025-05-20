import * as fs from "fs/promises";
import * as path from "node:path";
import { cwd as resolveCwd } from "node:process";
import { LIB_NAME, MODULE_NAME } from "../constants.ts";
import type { Config } from "./types.ts";

/**
 * Options for initializing the configuration file.
 */
export type InitConfigOptions = {
  /**
   * The directory where the configuration file should be created.
   * Defaults to the process's current working directory.
   */
  cwd: string;
};

/**
 * Asynchronously initializes a new configuration file with default content,
 * automatically determining the best format based on the project structure.
 *
 * @param defaultConfig - The initial configuration to write to the file.
 * @param options - Options for initializing the configuration file.
 *
 * @throws {Error} If an error occurs during the file creation process or if the
 * target file already exists.
 */
export const initConfig = async (
  defaultConfig: Config,
  options: Partial<InitConfigOptions> = {},
): Promise<void> => {
  const { cwd: cwdOption } = options;

  let cwd: string;

  if (!cwdOption) {
    cwd = resolveCwd();
  } else {
    cwd = cwdOption;

    if (!path.isAbsolute(cwd)) {
      cwd = path.resolve(resolveCwd(), cwd);
    }
  }

  let format: "js" | "cjs" | "mjs" | "ts" | "cts" | "mts" = "js";
  let isESM = false;

  try {
    const packageJsonPath = path.join(cwd, "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent) as object;

    if ("type" in packageJson && packageJson.type === "module") {
      isESM = true;
    } else {
      isESM = false;
    }
  } catch (err) {
    let message = "Failed to determine module type from package.json.";

    if (
      "code" in (err as object) &&
      (err as { code: string }).code === "ENOENT"
    ) {
      message += " No package.json file found.";
    } else if (err instanceof SyntaxError) {
      message += " Error parsing package.json.";
    } else if (err instanceof Error) {
      message += ` Details: ${err.message}`;
    }

    throw new Error(message);
  }

  try {
    const tsconfigJsonPath = path.join(cwd, "tsconfig.json");

    await fs.lstat(tsconfigJsonPath);

    format = "ts";
  } catch {
    format = "js";
  }

  const configFileName = `${MODULE_NAME}.config.${format}`;
  const configFilePath = path.join(cwd, configFileName);

  try {
    await fs.lstat(configFilePath);

    throw new Error(`Configuration file already exists at: ${configFilePath}`);
  } catch (err) {
    if (
      "code" in (err as object) &&
      (err as { code: string }).code === "ENOENT"
    ) {
      let content = "";

      switch (format) {
        case "ts":
          {
            content = [
              `import { defineConfig } from "${LIB_NAME}";`,
              "\n\n",
              `export default defineConfig(${JSON.stringify(defaultConfig, null, 2)});`,
              "\n",
            ].join("");
          }

          break;
        default: {
          if (isESM) {
            content = [
              `import { defineConfig } from "${LIB_NAME}";`,
              "\n\n",
              `export default defineConfig(${JSON.stringify(defaultConfig, null, 2)});`,
              "\n",
            ].join("");
          } else {
            content = [
              `const { defineConfig } = require("${LIB_NAME}");`,
              "\n\n",
              `module.exports = defineConfig(${JSON.stringify(defaultConfig, null, 2)});`,
              "\n",
            ].join("");
          }
        }
      }

      return fs.writeFile(configFilePath, content, "utf-8");
    }

    throw err;
  }
};
