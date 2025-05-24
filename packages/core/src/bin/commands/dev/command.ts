import { createCommand } from "commander";
import { runAction } from "../../run.ts";
import type { CliCommand } from "../../types.ts";
import { devAction } from "./action.ts";

const COMMAND_NAME = "dev";

export const devCommand: CliCommand = ctx => {
  return createCommand(COMMAND_NAME)
    .description("Baquex development server")
    .addHelpText("after", "\nStarts a development server for the application.")
    .option("-c, --config <file>", `[string] use specified config file`)
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .option("--open [path]", `[boolean | string] open browser on startup`)
    .option("--cors", `[boolean] enable CORS`)
    .option(
      "--strictPort",
      `[boolean] exit if specified port is already in use`,
    )
    .action(() => runAction(COMMAND_NAME, devAction)(ctx));
};
