import * as fs from "node:fs/promises";
import colors from "yoctocolors";
import { LIB_NAME } from "../constants.ts";
import type { PackageJson } from "../types.ts";
import { loadCommands } from "./load.ts";
import type { CliAction, CliContext } from "./types.ts";

const assertCwdContainsBaquexProject = async (name: string, cwd: string) => {
  const logErrorAndExit = () => {
    // eslint-disable-next-line no-console
    console.log(
      `You need to run ${colors.yellow(
        `strapi ${name}`,
      )} in a Strapi project. Make sure you are in the right directory.`,
    );

    process.exit(1);
  };

  try {
    const pkgJsonContent = await fs.readFile(`${cwd}/package.json`, "utf-8");

    const pkgJson = JSON.parse(pkgJsonContent) as PackageJson;

    if (
      !(LIB_NAME in (pkgJson.dependencies ?? {})) &&
      !(LIB_NAME in (pkgJson.devDependencies ?? {}))
    ) {
      logErrorAndExit();
    }
  } catch {
    logErrorAndExit();
  }
};

export const runAction =
  (name: string, action: CliAction) => async (ctx: CliContext) => {
    await assertCwdContainsBaquexProject(name, ctx.cwd);

    try {
      await action(ctx);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      process.exit(1);
    }
  };

export const runCommands = async (argv: string[]) => {
  (await loadCommands(argv)).parse(argv);
};
