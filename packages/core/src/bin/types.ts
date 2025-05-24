import type { Command } from "commander";
import type { Logger } from "../logger.ts";

export type CliContext = {
  cmd: Command;
  argv: string[];
  cwd: string;
  logger: Logger;
};

export type GlobalCliOptions = {
  debug?: boolean;
};

export type CliCommand = (ctx: CliContext) => Command | Promise<Command>;

export type CliAction = (ctx: CliContext) => Promise<void>;
