import {Link, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import Searchbox from "./components/searchbox";
import ClassPill from "./components/class_pill";

function Step1(props) {
    let classList = useLoaderData()
    let searchboxRef = useState(null)

    const [chosen_classes, setChosenClasses] = useState([])
    const [showPlus, setShowPlus] = useState(false)

    const handleHidePlus = () => {
      setShowPlus(false)
      searchboxRef.current.focus()
    }

    useEffect(() => {
      props.setUserPrefs({
        ...props.userPrefs,
        classes_1: chosen_classes,
        classes : []
      })
    }, [chosen_classes])

    return (
      <div className="font-serif">
        <div className="pl-5 sm:pl-10 pt-12">
          <h2 className="text-3xl sm:text-5xl">Step 1</h2>
          <h1 className="font-display text-3xl sm:text-5xl pt-2">choose your classes</h1>
        </div>

        <div className="flex flex-row flex-wrap pt-10 sm:pt-20 pl-5 sm:pl-10">
          {chosen_classes.map((item, index) => (
            <ClassPill name={item} key={index} chosen_classes={chosen_classes} setChosenClasses={setChosenClasses} setShowPlus={setShowPlus}/>
          ))}

          {showPlus ? 

            <div className="flex flex-row rounded-full bg-transparent border-black border-2 p-2 sm:p-3 mr-3 self-start mb-5 cursor-pointer aspect-square" onClick={handleHidePlus}>
              <span className="material-symbols-outlined text-4xl leading-9" >add</span>
            </div>

            :

            <Searchbox ref={searchboxRef} chosen_classes={chosen_classes} setChosenClasses={setChosenClasses} showPlus={showPlus} setShowPlus={setShowPlus} classList={classList}/>
          }
        </div>
  
        { (chosen_classes.length == 0 ? 
        ""
        :
        <Link to="/form/2" className="fixed bottom-0 right-0 pb-8 sm:pb-10 pr-10 sm:pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max cursor-pointer">
          <h5 className="text-3xl sm:text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </Link>
        )}
        
      </div>
    )
  }
  
  export default Step1
  