import { preview, type InlineConfig } from "vite";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { createAppPayload } from "../../utils/create-app-payload.ts";
import { setupAppInput } from "../../utils/setup-app-input.ts";
import { type PreviewCommandOptions } from "./types.ts";

export const previewAction: CliAction = async ctx => {
  const { cwd, logger, cmd } = ctx;

  const {
    config: configFile,
    host,
    open,
    port,
    strictPort,
  } = cmd.opts<PreviewCommandOptions>();

  const { config } = await resolveConfig(cwd, configFile);
  const { main, ...viteConfig } = config;

  const previewConfig: InlineConfig = {
    root: cwd,
    preview: {
      port,
      host,
      open,
      strictPort,
    },
    ...viteConfig,
  };

  setupAppInput(previewConfig);

  try {
    await createAppPayload({ main });
    const server = await preview(previewConfig);

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (err) {
    logger.error(
      `error when starting preview server:\n${(err as Error).stack}`,
      err,
    );

    process.exit(1);
  }
};
