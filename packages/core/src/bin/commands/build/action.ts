import { createBuilder, type InlineConfig } from "vite";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { createAppPayload } from "../../utils/create-app-payload.ts";
import { setupAppInput } from "../../utils/setup-app-input.ts";
import { type BuildCommandOptions } from "./types.ts";

export const buildAction: CliAction = async ctx => {
  const { cwd, logger, cmd } = ctx;

  const { config: configFile } = cmd.opts<BuildCommandOptions>();
  const { config } = await resolveConfig(cwd, configFile);
  const { main, ...viteConfig } = config;

  const builderConfig: InlineConfig = {
    root: cwd,
    mode: "production",
    ...viteConfig,
  };

  setupAppInput(builderConfig);

  try {
    const builder = await createBuilder(builderConfig);

    await createAppPayload({ main });
    await builder.buildApp();
  } catch (err) {
    logger.error(`error during build:\n${(err as Error).stack}`, err);

    process.exit(1);
  }
};
