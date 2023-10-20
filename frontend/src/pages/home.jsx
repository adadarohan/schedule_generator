import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {

  let [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function handleNext() {
    setIsLoading(true)
    navigate(`form/1`)
  }

  if (!isLoading) {
    return (
      <div className="font-serif">
        <div className="pl-10 pt-32">
          <h2 className="text-7xl">The better</h2>
          <h1 className="font-display text-[84px] pt-2">Schedule Generator.</h1>
        </div>

        <div onClick={handleNext} className="cursor-pointer pl-10 pt-20 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">get started</h5>
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </div>

        <p className="text-xl fixed bottom-0 left-0 pb-7 pl-10">Created by <b>Rohan Kapur</b> using React & Python </p>
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
  