import { RouteObject } from "react-router";
import connectedRoutes from "./connected";
import disconnectedRoutes from "./disconnected";

const routes: RouteObject[] = [...disconnectedRoutes, ...connectedRoutes];

export default routes;
