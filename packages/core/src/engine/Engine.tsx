import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../app/App.tsx";
import { Router } from "./Router.ts";
import { createRouter } from "./utils/create-router.ts";

export class AppEngine {
  private readonly _router: Router;

  constructor() {
    this._router = new Router();
  }

  public get router(): Router {
    return this._router;
  }

  public renderApp(): void {
    const reactRootElement = document.getElementById("react-root");

    if (!reactRootElement) throw new Error("There is no `#root` element.");

    const router = createRouter(this._router);

    createRoot(reactRootElement).render(
      <StrictMode>
        <App browserRouter={router} />
      </StrictMode>,
    );
  }
}
