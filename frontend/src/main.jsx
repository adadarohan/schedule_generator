import React from 'react'
import * as ReactDOM from "react-dom/client";
import 'material-symbols';
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/home";
import NotFound from "./pages/404";
import Step1 from "./pages/step1";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
    errorElement: <NotFound />,
  },
  {
    path : "/form/1",
    element: <Step1/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
