import {Link } from "react-router-dom";
import { useState } from "react";
import Searchbox from "./components/searchbox";
import ClassPill from "./components/class_pill";

function Step1() {

    const [chosen_classes, setChosenClasses] = useState([])
    return (
      <div className="font-serif">
        <div className="pl-10 pt-12">
          <h2 className="text-5xl">Step 1</h2>
          <h1 className="font-display text-5xl pt-2">choose your classes</h1>
        </div>

        <div className="flex flex-row flex-wrap pt-20 pl-10">
          {chosen_classes.map((item, index) => (
            <ClassPill name={item} key={index}/>
          ))}
          <Searchbox chosen_classes={chosen_classes} setChosenClasses={setChosenClasses}/>
        </div>
  
        <Link to={`form/1`} className="fixed bottom-0 right-0 pb-10 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </Link>
      </div>
    )
  }
  
  export default Step1
  