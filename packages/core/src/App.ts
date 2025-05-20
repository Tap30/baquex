import type { Runtime } from "@tapsioss/baquex-runtime";
import { Router } from "./Router.js";
import { BrowserRuntime } from "./runtimes/BrowserRuntime.ts";

export class App {
  private _runtime: Runtime | null = null;
  private _router: Router | null = null;

  public get runtime(): Runtime {
    if (!this._runtime) this._runtime = new BrowserRuntime();

    return this._runtime;
  }

  public get router(): Router {
    if (!this._router) this._router = new Router();

    return this._router;
  }
}
