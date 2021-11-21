import React from "react";
import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
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
      <NavBar />
      <Router />
    </BrowserRouter>
  );
};
export default App;
