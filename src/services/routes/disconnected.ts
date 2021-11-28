import DemoVideo from "@/views/DemoVideo";
import { RouteObject } from "react-router";
import Home from "@/views/Home";

const disconnectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: Home,
  },
  {
    path: "/demovideo",
    element: DemoVideo,
  },
];

export default disconnectedRoutes;
