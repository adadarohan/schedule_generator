import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Step4(props) {

  const [earliestTime, setEarliestTime] = useState(8)
  const [latestTime, setLatestTime] = useState(17)
  const [prefTime, setPrefTime] = useState(10)

  const earlyTimes = [
    {time: 8, text : "8 AM"},
    {time: 9, text : "9 AM"},
    {time: 10, text : "10 AM"},
    {time: 11, text : "11 AM"},
    {time: 12, text : "noon"}
  ]

  const lateTimes = [
    {time: 14, text : "2 PM"},
    {time: 15, text : "3 PM"},
    {time: 16, text : "4 PM"},
    {time: 17, text : "5 PM"},
    {time: 18, text : "6 PM"},
    {time: 19, text : "7 PM"},
    {time: 20, text : "8 PM"},
    {time: 21, text : "9 PM"}
  ]

  const prefTimes = [
    {time: 10, text: "morning"},
    {time: 12, text: "noon"},
    {time: 14, text: "afternoon"},
    {time: 16, text: "evening"}
  ]

  const navigate = useNavigate()

  function handleNext() {
    props.setUserPrefs({
      ...props.userPrefs,
      start_time: earliestTime,
      end_time: latestTime,
      pref_time: prefTime
    })
    navigate("/form/5")
  }
    

  return (
    <div className="font-serif">
      <div className="pl-10 pt-12">
        <h2 className="text-5xl">Step 4</h2>
        <h1 className="font-display text-5xl pt-2">select class times</h1>
      </div>

      <div className="pt-10 pl-10">
        <p className="text-4xl">earliest class time:</p>
        <div className="flex flex-row pt-3">
          {earlyTimes.map((time, index) => (
            (time.time == earliestTime) ?
              <div key={index} className="rounded-full bg-black border-black border-2 py-2 px-3 mr-4">
                < p className="text-3xl text-white text-center px-4">{time.text}</p>
              </div>
            :
              <div key={index} className="rounded-full  border-black border-2 py-2 px-3 mr-4 cursor-pointer" onClick={() => {setEarliestTime(time.time)}}>
                < p className="text-3xl text-center px-4">{time.text}</p>
              </div>
          ))
        }
        </div>
      </div>

      <div className="pt-10 pl-10">
        <p className="text-4xl">latest class time:</p>
        <div className="flex flex-row pt-3">
          {lateTimes.map((time, index) => (
            (time.time == latestTime) ?
              <div key={index} className="rounded-full bg-black border-black border-2 py-2 px-3 mr-4">
                < p className="text-3xl text-white text-center px-4">{time.text}</p>
              </div>
            :
              <div key={index} className="rounded-full  border-black border-2 py-2 px-3 mr-4 cursor-pointer" onClick={() => {setLatestTime(time.time)}}>
                < p className="text-3xl text-center px-4">{time.text}</p>
              </div>
          ))
        }
        </div>
      </div>

      <div className="pt-10 pl-10">
        <p className="text-4xl">preferred class time:</p>
        <div className="flex flex-row pt-3">
          {prefTimes.map((time, index) => (
            (time.time == prefTime) ?
              <div key={index} className="rounded-full bg-black border-black border-2 py-2 px-3 mr-4">
                < p className="text-3xl text-white text-center px-4">{time.text}</p>
              </div>
            :
              <div key={index} className="rounded-full  border-black border-2 py-2 px-3 mr-4 cursor-pointer" onClick={() => {setPrefTime(time.time)}}>
                < p className="text-3xl text-center px-4">{time.text}</p>
              </div>
          ))
        }
        </div>
      </div>

      <div onClick={handleNext} className="fixed bottom-0 right-0 pb-8 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max cursor-pointer">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </div>
      
    </div>
  )
}
  
export default Step4