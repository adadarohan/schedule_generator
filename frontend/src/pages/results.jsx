import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Results(props) {

  const navigate = useNavigate()

  function handleNext() {
    console.log(props.chosenSchedule)
  }


  let schedule_options = [0, 1, 2, 3, 4]
  let currentSchedule = props.schedules[props.chosenSchedule]

  const timesOfDay = {
    7 : '7 am',
    8 : '8 am',
    9 : '9 am',
    10 : '10 am',
    11 : '11 am',
    12 : '12 pm',
    13 : '1 pm',
    14 : '2 pm',
    15 : '3 pm',
    16 : '4 pm',
    17 : '5 pm',
    18 : '6 pm',
    19 : '7 pm',
    20 : '8 pm',
    21 : '9 pm',
    22 : '10 pm',
    23 : '11 pm'
  }

  let earliestClass = 24
  let latestClass = 0

  for (const prop in currentSchedule.time_schedule) {
    const hours = currentSchedule.time_schedule[prop]
    
    hours.forEach((hour, index) => {
      if (hour !== null) {
        if (index  < earliestClass) {
          earliestClass = index 
        }
        if (index > latestClass) {
          latestClass = index 
        }
      }
    })
  }

  const hourList = Array.from(new Array(latestClass - earliestClass + 2), (x, i) => i + earliestClass);
  const dayList = [
    {'code' : 'M', 'name' : 'Monday'},
    {'code' : 'T', 'name' : 'Tuesday'},
    {'code' : 'W', 'name' : 'Wednesday'},
    {'code' : 'R', 'name' : 'Thursday'},
    {'code' : 'F', 'name' : 'Friday'}
  ]

  console.log(currentSchedule)

  
  function createColumn(day, index ) {
    let i = earliestClass
    let jsx = []
    while (i <= latestClass + 1) {
      let class_ = currentSchedule.time_schedule[day.code][i]
      if (class_ !== null) {
        let length = 1
        
        while (currentSchedule.time_schedule[day.code][i + length] !== null && class_['crn'] == currentSchedule.time_schedule[day.code][i + length]['crn']) {
          length += 1
        }

        jsx.push(
          <div key={i} className="h-full flex flex-col justify-center items-center rounded-2xl bg-transparent border-black border-2 mx-4"  style={{"gridRow":"span " + length + " / span " + length}}>
            <p className="text-2xl text-center">{class_.class.code} {class_.class.number}</p>
            <p className="text-xl text-center">{class_.meetings[0].type}</p>
          </div>
        )

        i += length
        
      } else {
        jsx.push(
          <p key={i}></p>
        )
        i += 1
      }

    }
    return jsx
  }

  return (
    <div className="font-serif">
      <div className="pl-10 pt-12 pb-10">
        <h2 className="text-5xl">Step 8</h2>
        <h1 className="font-display text-5xl pt-2">choose a schedule!</h1>
      </div>

      <div style={{"gridTemplateRows":"auto repeat(" + String(hourList.length) +  " , 1fr)"}} className="grid grid-flow-col grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-x-2 gap-y-3 px-10 max-h-[50vh] overflow-auto">
        <div className="contents">
          <p></p>
          {
          hourList.map((hour, index) => (
            <p key={index} className="text-2xl pb-5 text-right">{timesOfDay[hour]}</p>
          ))
          }     
        </div>
          
        { 
          dayList.map((day, index) => {
            return [<p key={index} className="text-2xl pb-5 text-center">{day.name}</p> , createColumn(day, index)]
          })
        }
    

      </div>

      <div onClick={handleNext} className="fixed bottom-0 right-0 pb-8 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max cursor-pointer">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </div>

      <div className="fixed bottom-0 left-0 pl-10 pb-8 flex flex-row">
        {schedule_options.map((number, index) => (
            (number == props.chosenSchedule) ?
              <div key={index} className="rounded-full bg-black border-black border-2 py-2 px-3 mr-4">
                < p className="text-3xl text-white text-center px-4">option {number + 1}</p>
              </div>
            :
              <div key={index} className="rounded-full  border-black border-2 py-2 px-3 mr-4 cursor-pointer" onClick={() => {props.setChosenSchedule(number)}}>
                < p className="text-3xl text-center px-4">option {number + 1}</p>
              </div>
          ))
        }
      </div>
      
    </div>
  )
}
  
export default Results