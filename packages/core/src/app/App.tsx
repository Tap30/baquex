import { RouterProvider, type RouterProviderProps } from "react-router";

type Props = {
  browserRouter: RouterProviderProps["router"];
};

const App: React.FC<Props> = props => {
  const { browserRouter } = props;

  return <RouterProvider router={browserRouter} />;
};

export default App;
