import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReactGA from 'react-ga4';

function Home() {

  let [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function handleNext() {

    ReactGA.event({
      category: "generate_lead",
      action: "form_started"
    });

    setIsLoading(true)
    navigate(`form/1`)
  }

  if (!isLoading) {
    return (
      <div className="font-serif">
        <div className="sm:pl-10 pt-40 sm:pt-32">
          <h2 className="text-4xl text-center sm:text-7xl sm:text-left">The better</h2>
          <h1 className="font-display text-5xl text-center sm:text-[84px] pt-4 sm:text-left sm:pt-2">Schedule Generator.</h1>
        </div>

        <div onClick={handleNext} className="cursor-pointer sm:pl-10 pt-20 transition hover:-translate-y-2 flex flex-row sm:justify-start duration-300 justify-center">
          <p className="text-3xl sm:text-4xl">get started</p>
          <span className="material-symbols-outlined text-4xl sm:text-5xl">chevron_right</span>
        </div>

        <p className=" text-lg sm:text-xl fixed bottom-0 left-0 pb-7 px-10 sm:pl-10 text-center sm:text-left">Created by <b>Rohan Kapur</b> </p>
      </div>
    )
  } else {
    return (
      <div className="flex flex-row justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
      </div>
    )
  }
}
  
  export default Home
  