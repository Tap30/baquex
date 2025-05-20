import {
  createLogger,
  preview,
  type InlineConfig,
  type PreviewOptions,
} from "vite";

type ProductionPreviewOptions = Pick<InlineConfig, "base"> &
  Pick<PreviewOptions, "host" | "open" | "port" | "strictPort">;

/**
 * Starts a preview server for a production application.
 *
 * @param root - Project root directory.
 * Can be an absolute path, or a path relative from the location of the config file itself.
 * @param options - Optional configuration for the preview.
 */
export const previewProductionApp = async (
  root: string,
  options?: ProductionPreviewOptions,
): Promise<void> => {
  const { base, host, open, port, strictPort } = options ?? {};

  const previewConfig: InlineConfig = {
    root,
    base,
    preview: {
      port,
      host,
      open,
      strictPort,
    },
  };

  try {
    const server = await preview(previewConfig);

    server.printUrls();
    server.bindCLIShortcuts({ print: true });
  } catch (err) {
    const logger = createLogger();

    logger.error(
      `error when starting preview server:\n${(err as Error).stack}`,
      {
        error: err as Error,
      },
    );

    process.exit(1);
  }
};
