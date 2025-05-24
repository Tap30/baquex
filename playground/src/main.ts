import { AppEngine } from "@tapsioss/baquex";
import { homePageHandler } from "./pages/home.ts";

const appEngine = new AppEngine();

appEngine.router.setup([
  {
    path: "/",
    handler: homePageHandler,
  },
]);

appEngine.renderApp();
