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
   * The main entrypoint of the application. Can be an absolute path, or a path relative from
   * the location of the config file itself.
   *
   * By default will look for a main file in the src directory.
   */
  main?: string;
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
