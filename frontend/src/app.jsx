import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import ReactGA from "react-ga4";
import { useState } from "react";
import Home from "./pages/home";
import NotFound from "./pages/404";
import Step1 from "./pages/step1";
import Step2 from "./pages/step2"
import Step3 from "./pages/step3";
import Step4 from "./pages/step4";
import Step5 from "./pages/step5";
import Step6 from "./pages/step6";
import Step7 from "./pages/step7";
import Submit from "./pages/submit";
import Results from "./pages/results";
import Export from "./pages/export";
import Error from "./pages/error";

export default function App () {
  
  ReactGA.initialize("G-ZVFH4MVCZ8");

  let [userPrefs, setUserPrefs] = useState({
    'classes' : [],
    'pref_sections' : [],
  })

  let [schedules, setSchedules] = useState([])
  let [chosenSchedule, setChosenSchedule] = useState(0)

  const router = createBrowserRouter([
      {
        path: "/",
        element: <Home/>,
        errorElement: <NotFound />,
      },
      {
        path : "/form/1",
        element: <Step1 setUserPrefs={setUserPrefs} userPrefs={userPrefs} />,
        loader : async () => {
          const response = await fetch("https://mkgfanuvq2vklflixl2nxqxlyy0mjpfv.lambda-url.us-east-2.on.aws/")
          return await response.json()
        },
        errorElement: <Error/>
      },
      {
        path: "/form/2",
        element: <Step2 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
        errorElement: <Error/>

      },
      {
          path: "/form/3",
          element: <Step3 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
          errorElement: <Error/>
      },
      {
          path: "/form/4",
          element: <Step4 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
          errorElement: <Error/>
      },
      {
          path: "/form/5",
          element: <Step5 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
          errorElement: <Error/>

      },
      {
          path: "/form/6",
          element: <Step6 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
          errorElement: <Error/>
      },
      {
          path: "/form/7",
          element: <Step7 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>,
          errorElement: <Error/>
      },
      {
          path: "/submit",
          element: <Submit userPrefs={userPrefs} schedules={schedules} setSchedules={setSchedules}/>,
          errorElement: <Error/>

      },
      {
          path: "/results",
          element: <Results schedules={schedules} chosenSchedule={chosenSchedule} setChosenSchedule={setChosenSchedule}/>,
          errorElement: <Error/>
      }, 
      {
          path: "/error",
          element: <Error/>
      },
      {
          path: "/export",
          element: <Export schedules={schedules} chosenSchedule={chosenSchedule}/>,
          errorElement: <Error/>
      }
    ]);

  return (
      <RouterProvider router={router} />
  )
}