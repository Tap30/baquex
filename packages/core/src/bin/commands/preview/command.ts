import { createCommand } from "commander";
import { runAction } from "../../run.ts";
import type { CliCommand } from "../../types.ts";
import { previewAction } from "./action.ts";

const COMMAND_NAME = "preview";

export const previewCommand: CliCommand = ctx => {
  const subcmd = createCommand(COMMAND_NAME)
    .description("Baquex application preview")
    .addHelpText(
      "after",
      "\nStarts a preview server for the production application.",
    )
    .option("-c, --config <file>", `[string] use specified config file`)
    .option("--host [host]", `[string] specify hostname`)
    .option("--port <port>", `[number] specify port`)
    .option(
      "--strictPort",
      `[boolean] exit if specified port is already in use`,
    )
    .option("--open [path]", `[boolean | string] open browser on startup`)
    .action(() => runAction(COMMAND_NAME, previewAction)(ctx, subcmd));

  return subcmd;
};
