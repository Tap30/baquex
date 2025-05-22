import type { InlineConfig } from "vite";
import { resolveAppInput } from "../../utils/resolve-app-input.ts";

export const setupAppInput = (viteConfig: InlineConfig) => {
  const rollupOptions = viteConfig.build?.rollupOptions;
  const input = resolveAppInput();

  if (rollupOptions) {
    rollupOptions.input = input;
  } else {
    viteConfig.build = {
      ...(viteConfig.build ?? {}),
      rollupOptions: {
        input,
      },
    };
  }
};
