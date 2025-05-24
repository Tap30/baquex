import { loadConfig, type LoadConfigResult } from "../config/load.ts";

export const resolveConfig = async (
  cwd: string,
  configFilePath?: string,
): Promise<LoadConfigResult> => {
  const loadResult = await loadConfig(cwd, { configFilePath });

  if (!loadResult) {
    return {
      path: "",
      config: {},
    };
  }

  return loadResult;
};
