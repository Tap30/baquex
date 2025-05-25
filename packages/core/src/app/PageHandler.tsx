import { useMemo } from "react";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import type {
  PageRouteHandler,
  PageRouteHandlerContext,
} from "../engine/Router.ts";

type Props<Data, Params extends string | Record<string, string | undefined>> = {
  handler: PageRouteHandler<Data, Params>;
};

const PageHandler = <
  Data,
  Params extends string | Record<string, string | undefined>,
>(
  props: Props<Data, Params>,
) => {
  const { handler } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<Params>();
  const [searchParams, setSearchParams] = useSearchParams();
  const data = useLoaderData() as Data;

  const ctx = useMemo<PageRouteHandlerContext<Data, Params>>(
    () => ({
      navigate,
      location,
      params,
      data,
      searchParams,
      setSearchParams,
    }),
    [navigate, location, params, data, searchParams, setSearchParams],
  );

  handler(ctx);

  return <h1>PageHandler</h1>;
};

export default PageHandler;
