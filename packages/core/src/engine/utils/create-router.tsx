import { createBrowserRouter, type RouteObject } from "react-router";
import ErrorPageHandler from "../../ErrorPageHandler.tsx";
import PageHandler from "../../PageHandler.tsx";
import type { Router } from "../Router.ts";

export const createRouter = (router: Router) => {
  const pages = router.pages;
  const routes: RouteObject[] = [];

  for (const page of pages) {
    const { handler, path, errorHandler, ...otherOpts } = page;

    routes.push({
      path,
      element: <PageHandler handler={handler} />,
      errorElement: <ErrorPageHandler errorHandler={errorHandler} />,
      ...otherOpts,
    });
  }

  return createBrowserRouter(routes);
};
