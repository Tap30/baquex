import type { Config } from "./types.ts";

/**
 * A utility function to define the configuration object with type safety.
 * It is primarily used to provide better type inference for the configuration.
 *
 * @param config - The configuration object.
 */
export const defineConfig = (config: Config): Config => config;
