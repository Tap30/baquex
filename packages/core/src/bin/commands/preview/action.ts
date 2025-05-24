import { preview, type InlineConfig } from "vite";
import { DEFAULT_CONFIG } from "../../../config/constants.ts";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { type PreviewCommandOptions } from "./types.ts";

export const previewAction: CliAction = async (ctx, subcmd) => {
  const { cwd, logger } = ctx;

  const {
    config: configFile,
    host,
    open,
    port,
    strictPort,
  } = subcmd.opts<PreviewCommandOptions>();

  const { config } = await resolveConfig(cwd, configFile);

  const previewConfig: InlineConfig = {
    ...DEFAULT_CONFIG,
    root: cwd,
    preview: {
      port,
      host,
      open,
      strictPort,
    },
    ...config,
  };

  try {
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
