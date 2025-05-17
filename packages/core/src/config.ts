import { cosmiconfig } from "cosmiconfig";
import * as fs from "fs/promises";
import * as path from "node:path";
import { cwd as resolveCwd } from "node:process";
import { MODULE_NAME } from "./constants.ts";

// TODO: define the config contract
/**
 * Represents the configuration object for the module.
 */
export type Config = object;

/**
 * Represents the result of loading the configuration file.
 */
export type LoadConfigResult = {
  /**
   * The absolute path to the loaded configuration file.
   */
  path: string;
  /**
   * The configuration object loaded from the file.
   */
  config: Config;
};

/**
 * Options for loading the configuration.
 */
export type LoadConfigOptions = {
  /**
   * The current working directory to start searching for the configuration file.
   * Defaults to the process's current working directory if not provided.
   */
  cwd: string;
  /**
   * An explicit path to the configuration file. If provided, the loader will
   * directly attempt to load this file, bypassing the search process.
   */
  configFilePath: string;
};

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
 * A utility function to define the configuration object with type safety.
 * It is primarily used to provide better type inference for the configuration.
 *
 * @param config - The configuration object.
 */
export const defineConfig = (config: Config): Config => config;

/**
 * Asynchronously loads the module's configuration file.
 * It searches for configuration files with predefined names in the specified
 * directory and its ancestors, or directly loads the file if a `configFilePath`
 * is provided.
 *
 * @param options - Optional parameters to control the loading process.
 * @throws {Error} If an error occurs during the configuration file resolution or loading process.
 */
export const loadConfig = async (
  options: Partial<LoadConfigOptions> = {},
): Promise<LoadConfigResult | null> => {
  const { cwd: cwdOption, configFilePath: configFilePathOption } = options;

  let cwd: string;

  if (!cwdOption) {
    cwd = resolveCwd();
  } else {
    cwd = cwdOption;

    if (!path.isAbsolute(cwd)) {
      cwd = path.resolve(resolveCwd(), cwd);
    }
  }

  const configFilePath = configFilePathOption
    ? path.resolve(cwd, configFilePathOption)
    : undefined;

  const configExplorer = cosmiconfig(MODULE_NAME, {
    cache: true,
    stopDir: path.dirname(cwd),
    searchStrategy: "global",
    searchPlaces: [
      `${MODULE_NAME}.config.js`,
      `${MODULE_NAME}.config.cjs`,
      `${MODULE_NAME}.config.mjs`,
      `${MODULE_NAME}.config.ts`,
      `${MODULE_NAME}.config.cts`,
      `${MODULE_NAME}.config.mts`,
    ],
  });

  const searchPath = configFilePath ?? cwd;

  try {
    const searchResult = await configExplorer.search(searchPath);

    if (!searchResult) {
      return null;
    }

    return {
      path: searchResult.filepath,
      config: searchResult.config as Config,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);

    throw new Error(`Error resolving \`${MODULE_NAME}.config\` file.`);
  }
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
              `import { defineConfig } from "@tapsioss/${MODULE_NAME}";`,
              "\n\n",
              `export default defineConfig(${JSON.stringify(defaultConfig, null, 2)});`,
              "\n",
            ].join("");
          }

          break;
        default: {
          if (isESM) {
            content = [
              `import { defineConfig } from "@tapsioss/${MODULE_NAME}";`,
              "\n\n",
              `export default defineConfig(${JSON.stringify(defaultConfig, null, 2)});`,
              "\n",
            ].join("");
          } else {
            content = [
              `const { defineConfig } = require("@tapsioss/${MODULE_NAME}");`,
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
