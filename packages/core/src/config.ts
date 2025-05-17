import { cosmiconfig } from "cosmiconfig";
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
