import { Command } from "commander";
import { createLogger } from "../logger.ts";
import { resolveCwd } from "../utils/resolve-cwd.ts";
import { resolvePkg } from "../utils/resolve-pkg.ts";
import { buildCommand } from "./commands/build/command.ts";
import { devCommand } from "./commands/dev/command.ts";
import { previewCommand } from "./commands/preview/command.ts";
import type { CliContext } from "./types.ts";

const attachGlobalOptions = (cmd: Command) => {
  cmd.option("--debug", `[boolean] show debug logs`);
};

export const loadCommands = async (argv: string[]): Promise<Command> => {
  const cmd = new Command();

  const pkg = await resolvePkg();
  const version = pkg.version ?? "0.0.0";

  cmd
    .storeOptionsAsProperties(false)
    .allowUnknownOption(false)
    .helpOption("-h, --help", "Display help for command")
    .helpCommand("help [command]", "Display help for command")
    .version(version, "-v, --version", "Display the current version");

  attachGlobalOptions(cmd);

  const cwd = resolveCwd();
  const hasDebug = argv.includes("--debug");

  const logger = createLogger({ debug: hasDebug, timestamp: false });

  const ctx: CliContext = {
    cwd,
    argv,
    cmd,
    logger,
  };

  const subcommands = await Promise.all([
    buildCommand(ctx),
    devCommand(ctx),
    previewCommand(ctx),
  ]);

  subcommands.forEach(subcommand => {
    cmd.addCommand(subcommand);
  });

  return cmd;
};
