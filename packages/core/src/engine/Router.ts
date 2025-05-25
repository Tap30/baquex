import {
  type Location,
  type NavigateFunction,
  type RouteObject,
  type SetURLSearchParams,
  type useParams,
} from "react-router";

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

export type PageRouteHandlerContext<
  Data,
  Params extends string | Record<string, string | undefined>,
> = {
  navigate: NavigateFunction;
  location: Location;
  params: ReturnType<typeof useParams<Params>>;
  data: Data;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export type PageRouteHandler<
  Data = unknown,
  Params extends string | Record<string, string | undefined> = string,
> = (ctx: PageRouteHandlerContext<Data, Params>) => void;
export type PageRouteErrorHandler = () => void;

export type PageRoute = Omit<
  ClientRoute,
  "children" | "element" | "errorElement" | "lazy" | "path"
> & {
  path: string;
  handler: PageRouteHandler<unknown, string>;
  errorHandler?: PageRouteErrorHandler;
};

export class Router {
  private _pages: Set<PageRoute>;

  constructor() {
    this._pages = new Set();
  }

  public setup(routes: PageRoute[]): void {
    this._pages = new Set(routes);
  }

  public addPage(route: PageRoute): void {
    this._pages.add(route);
  }

  public get pages(): PageRoute[] {
    return Array.from(this._pages);
  }
}
