import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Step3(props) {

  let [classNumber, setClassNumber] = useState(0)
  let [currentClassSections, setCurrentClassSections] = useState([])
  let [isLoading, setIsLoading] = useState(true)

  let number_of_classes = props.userPrefs.classes_1.length
  
  let class_code = props.userPrefs.classes_1[classNumber].split(" ")[0]
  let class_number = props.userPrefs.classes_1[classNumber].split(" ")[1]

  let navigate = useNavigate()

  useEffect(() => {
    getSections(class_code, class_number)
  } , [])

  function getSections(code, number) {
    console.log("Getting sections for " + code + " " + number)
    setIsLoading(true)
    fetch("https://cdb4rxbcs5qwph6x3oju4nkjrq0xzupa.lambda-url.us-east-2.on.aws/?code=" + code + "&number=" + number)
    .then(response => response.json())
    .then(data => {
      setIsLoading(false)
      setCurrentClassSections(data)
    })
  }

  function handleRemoveSection(crn) {
    let new_sections = currentClassSections.filter((section) => section.crn != crn)
    setCurrentClassSections(new_sections)
  }

  function handleFavouriteSection(crn) {
    props.setUserPrefs({
      ...props.userPrefs,
      pref_sections: props.userPrefs.pref_sections.concat([crn])
    })
  }

  function handleUnFavouriteSection(crn) {
    let new_sections = props.userPrefs.pref_sections.filter((section) => section != crn)
    props.setUserPrefs({
      ...props.userPrefs,
      pref_sections: new_sections
    })
  }

  const handlenext = () => {

    let crn_list = []
    currentClassSections.forEach((section) => {
      crn_list.push(section.crn)
    })

    let existing_class = props.userPrefs.classes
    props.setUserPrefs({
      ...props.userPrefs,
      classes: existing_class.concat([{'code': class_code, 'number': class_number, 'crn_list': crn_list}])
    })

    if (classNumber == number_of_classes - 1) {
      navigate("/form/4")
    } else {
      let class_code_next = props.userPrefs.classes_1[classNumber + 1].split(" ")[0]
      let class_number_next = props.userPrefs.classes_1[classNumber + 1].split(" ")[1]
      getSections(class_code_next, class_number_next)
      setClassNumber(classNumber + 1)
    }
  }

  function resetSections() {
    getSections(class_code, class_number)
  }

  return (
    <div className="font-serif max-h-screen flex flex-col">
      <div className="pl-10 pt-12">
        <h2 className="text-5xl">Step 3</h2>
        <h1 className="font-display text-5xl pt-2">select your sections ({classNumber + 1}/{number_of_classes})</h1>
      </div>

      <div className="flex flex-col pt-12 pl-10 max-h-[70vh]">
        <div className="flex flex-row justify-between mr-20">
          <p className="text-4xl">{class_code} {class_number}</p>
          <p className="material-symbols-rounded text-4xl cursor-pointer" onClick={resetSections}>refresh</p>

        </div>
        <hr className="mr-10 mt-3 border-black border-[1.5px] mb-5"></hr>
        <div className="overflow-auto mb-5">

          {isLoading ?
          <div className="flex flex-row justify-center items-center pt-16">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
          </div>
          :
          <div className=" grid grid-cols-12 gap-x-2 gap-y-4">
              {currentClassSections.map((section, index) => (
              <div key={index} className="contents hover:font-medium">
                <p >{section.section_number}</p>
                <p>{section.crn}</p>
                <p className="col-span-2" >{section.meetings[0].type}</p>
                <p className="col-span-2">{section.meetings[0].instructors[0]}</p>
                <p className="col-span-4">{section.section_text}</p>
                
                {
                  (props.userPrefs.pref_sections.includes(section.crn) ?
                  <p className="material-symbols-rounded text-2xl cursor-pointer" style={{"fontVariationSettings":"'FILL' 1"}} onClick={()=> handleUnFavouriteSection(section.crn)}>grade</p>
                  :
                  <p className="material-symbols-rounded text-2xl cursor-pointer" onClick={()=> handleFavouriteSection(section.crn)}>grade</p>

                )}
                <p className="material-symbols-rounded text-2xl cursor-pointer" onClick={()=> handleRemoveSection(section.crn)}>close</p>
              </div> 
              ))}
          </div>
          }
        </div>
      </div>

      <div onClick={handlenext} className="fixed bottom-0 right-0 pb-8 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max cursor-pointer">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </div>

      <p className="fixed bottom-0 left-0 pb-2 pl-10 text-lg">Don’t worry about timings or locations, we’ll take care of that later. Starred sections are preferred. </p>
    </div>
  )
}
  
export default Step3