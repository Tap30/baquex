import { type BuildEnvironmentOptions, type UserConfig } from "vite";

type RollupOptions = NonNullable<BuildEnvironmentOptions["rollupOptions"]>;

/**
 * Represents the configuration object for the module.
 */
export type Config = Pick<
  UserConfig,
  "root" | "plugins" | "worker" | "dev" | "define" | "resolve"
> & {
  /**
   * Build specific options.
   */
  build?: Omit<BuildEnvironmentOptions, "rollupOptions"> & {
    /**
     * Will be merged with internal rollup options.
     * https://rollupjs.org/configuration-options/
     */
    rollupOptions?: Omit<RollupOptions, "input" | "output">;
  };
};
