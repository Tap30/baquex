import { type RouteObject } from "react-router";

type ClientRoute = Omit<
  RouteObject,
  | "Component"
  | "ErrorBoundary"
  | "HydrateFallback"
  | "hydrateFallbackElement"
  | "hasErrorBoundary"
  | "shouldRevalidate"
  | "action"
  | "unstable_middleware"
  | "handle"
>;

export type Route = Omit<
  ClientRoute,
  "children" | "element" | "errorElement"
> & {
  subRoutes: ClientRoute["children"];
  handler: ClientRoute["element"];
  errorHandler: ClientRoute["errorElement"];
};

export class Router {
  private _routes: Set<Route>;

  constructor() {
    this._routes = new Set();
  }

  public setup(routes: Route[]): void {
    this._routes = new Set(routes);
  }

  public addRoute(route: Route): void {
    this._routes.add(route);
  }
}
