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
import Step4 from "./pages/step4";
import Step5 from "./pages/step5";
import Step6 from "./pages/step6";
import Step7 from "./pages/step7";
import Submit from "./pages/submit";
/*
{
    'classes' : [{'code': 'ECE', 'number': '110', 'crn_list': ['36785', '36788', '36780', '36801', '36794', '55569', '36798', '55155', '36781', '55156', '36778', '36800', '36792', '36783', '36796', '62483', '55568', '36790', '36789', '62844', '59864', '59865', '59866', '59867', '59868', '59869', '59870', '59871', '59872', '59873', '59875', '59876', '59878', '59879', '59880', '62509']}, {'code': 'ECE', 'number': '120', 'crn_list': ['64596', '64597', '64598', '64599', '65253', '65254', '65255', '65256', '65257', '65258', '65260', '65261', '66763', '64595', '65733', '65734', '75613']}, {'code': 'PHYS', 'number': '211', 'crn_list': ['55650', '34564', '34566', '59136', '59140', '34590', '34569', '34598', '54863', '34592', '34624', '47717', '34595', '60539', '34601', '54864', '60540', '34608', '34611', '60541', '47577', '34630', '34709', '34604', '34613', '34616', '34619', '34586', '34621', '59137', '55008', '34625', '34727', '52599', '56971', '60543', '60544', '55801', '60546', '60545', '56990', '55007', '55802', '34657', '52600', '52601', '47578', '59143', '34706', '56981', '34659', '34661', '55800', '34665', '34667', '34670', '34673', '59144', '34693', '34689', '34700', '34703', '34698', '55006', '55118', '60535', '60536']}],
    'start_time' : 8,
    'end_time': 17,
    'open_sections_only' : False,
    'max_distance' : 500,
    'back_to_back' : True,
    'pref_time' : 12,
    'pref_sections': ['36785', '36788', '36780', '36801'],
    'lunch':  {
        "start" : 11,
        "end" : 14,
        "duration" : 1
    }
}
*/


export default function App () {

    let [userPrefs, setUserPrefs] = useState({
      'classes' : [],
      'pref_sections' : [],
    })

    let [schedules, setSchedules] = useState([])

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
          }
        },
        {
          path: "/form/2",
          element: <Step2 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/3",
            element: <Step3 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/4",
            element: <Step4 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/5",
            element: <Step5 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/6",
            element: <Step6 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/form/7",
            element: <Step7 userPrefs={userPrefs} setUserPrefs={setUserPrefs}/>
        },
        {
            path: "/submit",
            element: <Submit userPrefs={userPrefs} schedules={schedules} setSchedules={setSchedules}/>
        }
        
      ]);

    return (
        <RouterProvider router={router} />
    )
}