import type { PreviewOptions } from "vite";
import type { GlobalCliOptions } from "../../types.ts";

export type PreviewCommandOptions = GlobalCliOptions &
  Pick<PreviewOptions, "host" | "open" | "port" | "strictPort"> & {
    config?: string;
  };
