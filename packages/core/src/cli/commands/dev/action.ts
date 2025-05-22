import { createServer, type InlineConfig } from "vite";
import { resolveConfig } from "../../../utils/resolve-config.ts";
import type { CliAction } from "../../types.ts";
import { createAppPayload } from "../../utils/create-app-payload.ts";
import { setupAppInput } from "../../utils/setup-app-input.ts";
import { type DevCommandOptions } from "./types.ts";

export const devAction: CliAction = async ctx => {
  const { cwd, logger, cmd } = ctx;

  const {
    config: configFile,
    host,
    open,
    port,
    strictPort,
    cors,
  } = cmd.opts<DevCommandOptions>();

  const { config } = await resolveConfig(cwd, configFile);
  const { main, ...viteConfig } = config;

  const serverConfig: InlineConfig = {
    root: cwd,
    mode: "development",
    server: {
      port,
      host,
      open,
      cors,
      strictPort,
    },
    ...viteConfig,
  };

  setupAppInput(serverConfig);

  try {
    const server = await createServer(serverConfig);

    await createAppPayload({ main });

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
