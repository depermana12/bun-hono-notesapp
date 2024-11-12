import Home from "@/pages/home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <div>signup</div>,
  },
  {
    path: "/signin",
    element: <div>signin</div>,
  },
]);
