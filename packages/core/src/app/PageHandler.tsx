import type { PageRouteHandler } from "../engine/Router.ts";

type Props = {
  handler: PageRouteHandler;
};

const PageHandler: React.FC<Props> = props => {
  const { handler } = props;

  // eslint-disable-next-line no-console
  console.log(handler);

  return <h1>PageHandler</h1>;
};

export default PageHandler;
