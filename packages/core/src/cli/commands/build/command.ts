import { createCommand } from "commander";
import { runAction } from "../../run.ts";
import type { CliCommand } from "../../types.ts";
import { buildAction } from "./action.ts";

const COMMAND_NAME = "build";

export const buildCommand: CliCommand = ctx => {
  return createCommand(COMMAND_NAME)
    .description("Baquex application build")
    .addHelpText("after", "\nBuilds the production-ready application.")
    .option("-c, --config <file>", `[string] use specified config file`)
    .action(() => runAction(COMMAND_NAME, buildAction)(ctx));
};
