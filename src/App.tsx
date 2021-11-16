import React from "react";
import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";
import routes from "./services/routes";

const Router: React.FunctionComponent<{}> = () => {
  const mappedRoute = routes.map((route: any) => {
    return { ...route, element: <route.element /> };
  });
  let element = useRoutes(mappedRoute);
  return element;
};

const App: React.FunctionComponent<{}> = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
export default App;
