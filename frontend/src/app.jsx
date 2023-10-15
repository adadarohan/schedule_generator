import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
  
import { useState } from "react";
import Home from "./pages/home";
import NotFound from "./pages/404";
import Step1 from "./pages/step1";
import Step2 from "./pages/step2"
import Step3 from "./pages/step3";


export default function App () {

    let [userPrefs, setUserPrefs] = useState({})

    const router = createBrowserRouter([
        {
          path: "/",
          element: <Home/>,
          errorElement: <NotFound />,
        },
        {
          path : "/form/1",
          element: <Step1 setUserPrefs={setUserPrefs}/>,
          loader : async () => {
            const response = await fetch("https://mkgfanuvq2vklflixl2nxqxlyy0mjpfv.lambda-url.us-east-2.on.aws/")
            return await response.json()
          }
        },
        {
          path: "/form/2",
          element: <Step2 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/3",
            element: <Step3 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
            loader : async () => {
              const response = await fetch("https://mkgfanuvq2vklflixl2nxqxlyy0mjpfv.lambda-url.us-east-2.on.aws/")
              return await response.json()
            }
        }
      ]);

    return (
        <RouterProvider router={router} />
    )
}