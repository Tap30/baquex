import { createBuilder, createLogger, type InlineConfig } from "vite";

type ProductionBuildOptions = Pick<InlineConfig, "base">;

/**
 * Builds a Vite production application.
 *
 * @param root - Project root directory.
 * Can be an absolute path, or a path relative from the location of the config file itself.
 * @param options - Optional configuration for the build.
 */
export const buildProductionApp = async (
  root: string,
  options?: ProductionBuildOptions,
): Promise<void> => {
  const { base } = options ?? {};

  const builderConfig: InlineConfig = {
    root,
    base,
    mode: "production",
  };

  try {
    const builder = await createBuilder(builderConfig);

    await builder.buildApp();
  } catch (err) {
    const logger = createLogger();

    logger.error(`error during build:\n${(err as Error).stack}`, {
      error: err as Error,
    });

    process.exit(1);
  }
};
