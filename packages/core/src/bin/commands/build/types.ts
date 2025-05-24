import type { GlobalCliOptions } from "../../types.ts";

export type BuildCommandOptions = GlobalCliOptions & {
  config?: string;
};
