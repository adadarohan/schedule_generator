import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Step5(props) {

  const [startTime, setStartTime] = useState(11)
  const [endTime, setEndTime] = useState(14)
  const [lunchDuration, setLunchDuration] = useState(1)

  const startTimes = [
    {time: 11, text : "11 AM"},
    {time: 12, text : "noon"},
    {time: 13, text : "1 PM"},
    {time: 14, text : "2 PM"},
    {time: 15, text : "3 PM"},
  ]

  const endTimes = [
    {time: 12, text : "noon"},
    {time: 13, text : "1 PM"},
    {time: 14, text : "2 PM"},
    {time: 15, text : "3 PM"},
    {time: 16, text : "4 PM"}
  ]

  const navigate = useNavigate()

  function handleNext() {
    if (lunchDuration > 3) {
      alert("Lunch duration must be 3 hours at most")
      return
    }

    if (startTime >= endTime) {
      alert("Start time must be before end time")
      return
    }

    if ( startTime + parseInt(lunchDuration) > endTime) {
      alert("Lunch duration + Start time is greater than end time.")
      return
    }

    props.setUserPrefs({
      ...props.userPrefs,
      lunch: {
        start: startTime,
        end: endTime,
        duration: lunchDuration
      }
    })

    navigate("/form/6")
  }
    

  return (
    <div className="font-serif">
      <div className="px-5 sm:pl-10 pt-12">
        <h2 className="text-3xl sm:text-5xl">Step 5</h2>
        <h1 className="font-display text-3xl sm:text-5xl pt-2">select your lunch break</h1>
      </div>

      <div className="flex flex-row flex-wrap pt-10 sm:pt-20 px-5 sm:pl-10">
        <p className="text-3xl sm:text-4xl pr-4">I would like a </p>
        <div className="rounded-full border-black border-2 sm:py-1 px-3 mr-4 max-w-min">
          <input type="number" className="w-12 sm:w-16 text-3xl sm:text-4xl bg-transparent text-center leading-8 sm:leading-9" value={lunchDuration} onChange={(e) => setLunchDuration(parseInt(e.target.value))}></input>
        </div>
        <p className="text-3xl sm:text-4xl">hour lunch break</p>
      </div>

      <div className="pt-10 sm:pt-6 px-5 sm:pl-10 flex flex-row flex-wrap">
        <p className="text-3xl sm:text-4xl mr-4">between </p>
        {startTimes.map((time, index) => (
          (time.time == startTime) ?
            <div key={index} className="rounded-full bg-black border-black border-2 py-1 sm:py-2 px-3 mr-2 sm:mr-4 mb-2">
              < p className="text-3xl text-white text-center px-2 sm:px-4">{time.text}</p>
            </div>
          :
            <div key={index} className="rounded-full  border-black border-2 py-1 sm:py-2 px-3 mr-2 sm:mr-4 cursor-pointer mb-2" onClick={() => {setStartTime(time.time)}}>
              < p className="text-3xl text-center px-2 sm:px-4">{time.text}</p>
            </div>
        ))
      }
      </div>

      <div className="pt-10 sm:pt-6 px-5 sm:pl-10 flex flex-row flex-wrap">
        <p className="text-3xl sm:text-4xl pr-4">and </p>
        {endTimes.map((time, index) => (
          (time.time == endTime) ?
            <div key={index} className="rounded-full bg-black border-black border-2 py-1 sm:py-2 px-3 mr-2 sm:mr-4 mb-2">
              < p className="text-3xl text-white text-center px-2 sm:px-4">{time.text}</p>
            </div>
          :
            <div key={index} className="rounded-full  border-black border-2 py-1 sm:py-2 px-3 mr-2 sm:mr-4 cursor-pointer mb-2" onClick={() => {setEndTime(time.time)}}>
              < p className="text-3xl text-center px-2 sm:px-4">{time.text}</p>
            </div>
        ))
        }
      </div>

      <p className="text-3xl sm:text-4xl pt-10 sm:pt-6 px-5 sm:pl-10">every day in my class schedule.</p>


      <div onClick={handleNext} className="fixed bottom-0 right-0 pb-8 pr-10 sm:pr-16 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max cursor-pointer">
          <h5 className="text-3xl sm:text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </div>
      
    </div>
  )
}
  
export default Step5