import { createBuilder, type InlineConfig } from "vite";
import { DEFAULT_CONFIG } from "../../../config/constants.ts";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { type BuildCommandOptions } from "./types.ts";

export const buildAction: CliAction = async (ctx, subcmd) => {
  const { cwd, logger } = ctx;

  const { config: configFile } = subcmd.opts<BuildCommandOptions>();
  const { config } = await resolveConfig(cwd, configFile);

  const builderConfig: InlineConfig = {
    ...DEFAULT_CONFIG,
    root: cwd,
    mode: "production",
    ...config,
  };

  try {
    const builder = await createBuilder(builderConfig);

    await builder.buildApp();
  } catch (err) {
    logger.error(`error during build:\n${(err as Error).stack}`, err);

    process.exit(1);
  }
};
