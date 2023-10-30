import { Link } from "react-router-dom";

function Export(props) {

  console.log(props.schedules[props.chosenSchedule])


  return (
    <div className="font-serif max-h-screen flex flex-col">
      <div className="px-5 sm:pl-10 pt-12">
        <h2 className="text-3xl sm:text-5xl">Step 9</h2>
        <h1 className="font-display text-3xl sm:text-5xl pt-2">register and save</h1>
      </div>

      <div className="flex flex-col pt-10 sm:pt-12 px-5 sm:pl-10 max-h-[70vh]">
        <p className="text-xl sm:text-2xl">Add the following sections to your course explorer</p>
        <hr className="mr-10 mt-3 border-black border-[1.5px] mb-5"></hr>

        <div className="overflow-auto mb-5">
          <div className="w-[70%] grid grid-cols-[repeat(_4,_auto)] gap-x-5 gap-y-5 pt-1">

            <div className="contents text-2xl font-bold mb-3">
              <p className="min-w-max">CRN</p>
              <p className="min-w-max" >Class</p>
              <p className="min-w-max">Section Number</p>
              <p className="min-w-max">Section Type</p>
            </div> 

            {props.schedules[props.chosenSchedule]['schedule'].map((section, index) => (
            <div key={index} className="contents text-2xl">
              <p className="min-w-max">{section.crn}</p>
              <p className="min-w-max">{section.class.code} {section.class.number}</p>
              <p className="min-w-max">{section.section_number}</p>
              <p className="min-w-max">{section.meetings[0].type}</p>

            </div> 
            ))}
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 px-5 sm:pl-10 pb-8 flex flex-row flex-wrap">
        <Link className="rounded-full bg-black border-black border-2 py-2 px-3 mr-6 cursor-pointer mb-5" to="https://forms.gle/ZF2ABDbhEJBWPDqr8">
          <p className="text-2xl sm:text-3xl text-white text-center px-4">leave some feedback!</p>
        </Link>

        <Link  className="rounded-full  border-black border-2 py-2 px-3 cursor-pointer" to="mailto:rohankapur2005@gmail.com">
          <p className="text-2xl sm:text-3xl text-center px-4">contact us</p>
        </Link>
      </div>

    </div>
  )
}
  
export default Export