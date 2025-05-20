import {
  createLogger,
  createServer,
  type InlineConfig,
  type PreviewOptions,
} from "vite";

type DevelopmentPreviewOptions = Pick<InlineConfig, "base"> &
  Pick<PreviewOptions, "host" | "open" | "port" | "strictPort" | "cors">;

/**
 * Starts a development server for an application.
 *
 * @param root - Project root directory.
 * Can be an absolute path, or a path relative from the location of the config file itself.
 * @param options - Optional configuration for the preview.
 */
export const previewDevelopmentApp = async (
  root: string,
  options?: DevelopmentPreviewOptions,
): Promise<void> => {
  const { base, host, open, port, strictPort, cors } = options ?? {};

  const serverConfig: InlineConfig = {
    root,
    base,
    mode: "development",
    server: {
      port,
      host,
      open,
      cors,
      strictPort,
    },
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
    const logger = createLogger();

    logger.error(`error when starting dev server:\n${(err as Error).stack}`, {
      error: err as Error,
    });

    process.exit(1);
  }
};
