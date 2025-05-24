#!/usr/bin/env node

import { argv } from "node:process";
import { runCommands } from "./run.ts";

await runCommands(argv);
