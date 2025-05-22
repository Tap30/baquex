import { DEFAULT_CONFIG } from "../config/constants.ts";
import { loadConfig, type LoadConfigResult } from "../config/load.ts";

export const resolveConfig = async (
  cwd: string,
  configFilePath?: string,
): Promise<LoadConfigResult> => {
  const loadResult = await loadConfig(cwd, { configFilePath });

  if (!loadResult) {
    return {
      path: "",
      config: DEFAULT_CONFIG,
    };
  }

  return loadResult;
};
