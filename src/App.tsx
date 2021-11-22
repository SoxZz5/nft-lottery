import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import NavBar from "./components/nav/NavBar";
import routes from "./services/routes";
import { Provider } from "react-redux";
import { store, persistor } from "./services/redux/store";
//import { PersistGate } from "redux-persist/integration/react";

const Router: React.FunctionComponent<{}> = () => {
  const mappedRoute = routes.map((route: any) => {
    return { ...route, element: <route.element /> };
  });
  let element = useRoutes(mappedRoute);
  return element;
};

const App: React.FunctionComponent<{}> = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <NavBar className="main-menu" />
        <Router />
      </BrowserRouter>
    </Provider>
  );
};
export default App;
