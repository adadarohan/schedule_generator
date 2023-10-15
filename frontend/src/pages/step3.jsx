import {Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Step3(props) {

  let [classNumber, setClassNumber] = useState(0)
  let [currentClassSections, setCurrentClassSections] = useState([])

  console.log(props.userPrefs.classes_1)
  let number_of_classes = props.userPrefs.classes_1.length
  
  const handlenext = () => {
    let class_code = props.userPrefs.classes_1[classNumber].split(" ")[0]
    let class_number = props.userPrefs.classes_1[classNumber].split(" ")[1]
    console.log(class_code, class_number)
    setClassNumber(classNumber + 1)
  }

  return (
    <div className="font-serif">
      <div className="pl-10 pt-12">
        <h2 className="text-5xl">Step 3</h2>
        <h1 className="font-display text-5xl pt-2">select your sections ({classNumber + 1}/{number_of_classes})</h1>
      </div>

      <div className="flex flex-col pt-20 pl-10">
      </div>

      <div onClick={handlenext} className="fixed bottom-0 right-0 pb-10 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </div>
    </div>
  )
}
  
export default Step3