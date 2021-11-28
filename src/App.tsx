import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import NavBar from "@/components/nav/NavBar";
import routes from "@/services/routes";
import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import PerfectScrollbar from "react-perfect-scrollbar";
import Footer from "@/components/footer/Footer";

const Router: React.FunctionComponent<{}> = () => {
  const mappedRoute = routes.map((route: any) => {
    return { ...route, element: <route.element /> };
  });
  let element = useRoutes(mappedRoute);
  return element;
};

const App: React.FunctionComponent<{}> = () => {
  return (
    <PerfectScrollbar
      options={{ minScrollbarLength: 80, maxScrollbarLength: 120 }}
    >
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Router />
          <Footer />
        </BrowserRouter>
      </Provider>
    </PerfectScrollbar>
  );
};
export default App;
