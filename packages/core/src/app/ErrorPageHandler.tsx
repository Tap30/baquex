import type { PageRouteErrorHandler } from "../engine/Router.ts";

type Props = {
  errorHandler?: PageRouteErrorHandler;
};

const ErrorPageHandler: React.FC<Props> = props => {
  const { errorHandler } = props;

  // eslint-disable-next-line no-console
  console.log(errorHandler);

  return <h1>ErrorPageHandler</h1>;
};

export default ErrorPageHandler;
