// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import stringify from "fast-json-stable-stringify";
import colors from "yoctocolors";

import * as cliProgress from "cli-progress";
import ora, { type Ora } from "ora";

export type LoggerOptions = {
  debug?: boolean;
  timestamp?: boolean;
};

const stringifyArg = (arg: unknown) => {
  return typeof arg === "object" ? stringify(arg) : arg;
};

class Logger {
  private readonly _debug: boolean;
  private readonly _timestamp: boolean;

  private _state: { errors: number; warnings: number };

  constructor(options?: LoggerOptions) {
    const { debug = false, timestamp = true } = options ?? {};

    this._debug = debug;
    this._timestamp = timestamp;

    this._state = { errors: 0, warnings: 0 };
  }

  public get warnings(): number {
    return this._state.warnings;
  }

  public get errors(): number {
    return this._state.errors;
  }

  public debug(...args: unknown[]): void {
    if (!this._debug) return;

    console.log(
      colors.cyan(
        `[DEBUG]${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public info(...args: unknown[]): void {
    console.info(
      colors.blue(
        `[INFO]${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public log(...args: unknown[]): void {
    console.info(
      colors.blue(
        `${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public success(...args: unknown[]): void {
    console.info(
      colors.green(
        `[SUCCESS]${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public warn(...args: unknown[]): void {
    this._state.warnings += 1;

    console.warn(
      colors.yellow(
        `[WARN]${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public error(...args: unknown[]): void {
    this._state.errors += 1;

    console.error(
      colors.red(
        `[ERROR]${this._timestamp ? `\t[${new Date().toISOString()}]` : ""}`,
      ),
      ...args.map(stringifyArg),
    );
  }

  public spinner(text: string): Ora {
    return ora(text);
  }

  public progressBar(totalSize: number, text: string): cliProgress.SingleBar {
    const progressBar = new cliProgress.SingleBar({
      format: `${text ? `${text} |` : ""}${colors.green("{bar}")}| {percentage}%`,
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
      forceRedraw: true,
    });

    progressBar.start(totalSize, 0);

    return progressBar;
  }
}

export const createLogger = (options?: LoggerOptions) => {
  return new Logger(options);
};

export { type Logger };
