import { createServer, type InlineConfig } from "vite";
import { DEFAULT_CONFIG } from "../../../config/constants.ts";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { type DevCommandOptions } from "./types.ts";

export const devAction: CliAction = async (ctx, subcmd) => {
  const { cwd, logger } = ctx;

  const {
    config: configFile,
    host,
    open,
    port,
    strictPort,
    cors,
  } = subcmd.opts<DevCommandOptions>();

  const { config } = await resolveConfig(cwd, configFile);

  const serverConfig: InlineConfig = {
    ...DEFAULT_CONFIG,
    root: cwd,
    mode: "development",
    server: {
      port,
      host,
      open,
      cors,
      strictPort,
    },
    ...config,
  };

  try {
    const server = await createServer(serverConfig);

    if (!server.httpServer) {
      throw new Error("HTTP server not available");
    }

    await server.listen();

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (err) {
    logger.error(
      `error when starting dev server:\n${(err as Error).stack}`,
      err,
    );

    process.exit(1);
  }
};
