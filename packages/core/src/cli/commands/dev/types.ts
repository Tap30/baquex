import type { ServerOptions } from "vite";
import type { GlobalCliOptions } from "../../types.ts";

export type DevCommandOptions = GlobalCliOptions &
  Pick<ServerOptions, "host" | "open" | "port" | "strictPort" | "cors"> & {
    config?: string;
  };
