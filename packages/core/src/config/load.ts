import { cosmiconfig } from "cosmiconfig";
import * as path from "node:path";
import { MODULE_NAME } from "../constants.ts";
import type { Config } from "./types.ts";

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
   * An explicit path to the configuration file. If provided, the loader will
   * directly attempt to load this file, bypassing the search process.
   */
  configFilePath: string;
};

/**
 * Asynchronously loads the module's configuration file.
 * It searches for configuration files with predefined names in the specified
 * directory and its ancestors, or directly loads the file if a `configFilePath`
 * is provided.
 *
 * @param cwd The current working directory to start searching for the configuration file. Defaults to the process's current working directory if not provided.
 * @param options Optional parameters to control the loading process.
 *
 * @throws {Error} If an error occurs during the configuration file resolution or loading process.
 */
export const loadConfig = async (
  cwd: string,
  options: Partial<LoadConfigOptions> = {},
): Promise<LoadConfigResult | null> => {
  const { configFilePath: configFilePathOption } = options;

  const configFilePath = configFilePathOption
    ? path.resolve(cwd, configFilePathOption)
    : undefined;

  const configExplorer = cosmiconfig(MODULE_NAME, {
    // TODO: determine whether we need this cache or our own caching system.
    cache: false,
    stopDir: path.dirname(cwd),
    searchStrategy: "global",
    searchPlaces: [`${MODULE_NAME}.config.js`, `${MODULE_NAME}.config.ts`],
  });

  const searchPath = configFilePath ?? cwd;

  try {
    const searchResult = await configExplorer.search(searchPath);

    if (!searchResult) return null;

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
