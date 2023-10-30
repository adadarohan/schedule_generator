import { useNavigate } from "react-router-dom";

function Step6(props) {


  const navigate = useNavigate()

  function handleNext(distance) {
    props.setUserPrefs({
      ...props.userPrefs,
      max_distance: distance
    })

    navigate("/form/7")
  }
    

  return (
    <div className="font-serif">
      <div className="px-5 sm:pl-10 pt-12">
        <h2 className="text-3xl sm:text-5xl">Step 6</h2>
        <h1 className="font-display text-3xl sm:text-5xl pt-2">distance between classes</h1>
      </div>

      <div className="flex flex-col pt-10 sm:pt-20 px-5 sm:pl-10 overflow-auto">
        <div to="/form/3" onClick={() => handleNext(800)} className="cursor-pointer flex flex-row rounded-full bg-transparent border-black border-2 py-2 sm:py-3 px-3 mr-4 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="min-w-max text-3xl text-center pl-4">0 to 0.5 mile</p>
          
          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_walk</p>
          <p className="min-w-max text-3xl pl-1">10 min</p>

          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_bike</p>
          <p className="min-w-max text-3xl pl-2 pr-4">2 min</p>

        </div>

        <div to="/form/3" onClick={() => handleNext(1600)} className="cursor-pointer flex flex-row rounded-full bg-transparent border-black border-2 py-2 sm:py-3 px-3 mr-4 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="min-w-max text-3xl text-center pl-4">0 to 1 mile</p>
          
          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_walk</p>
          <p className="min-w-max text-3xl pl-1">20 min</p>

          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_bike</p>
          <p className="min-w-max text-3xl pl-2 pr-4">4 min</p>

        </div>

        <div to="/form/3" onClick={() => handleNext(3200)} className="cursor-pointer flex flex-row rounded-full bg-transparent border-black border-2 py-2 sm:py-3 px-3 mr-4 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="min-w-max text-3xl text-center pl-4">0 to 2 miles</p>
          
          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_walk</p>
          <p className="min-w-max text-3xl pl-1">40 min</p>

          <p className="px-3 text-3xl font-medium">|</p>

          <p className="material-symbols-rounded text-3xl" style={{"fontVariationSettings":"'FILL' 1"}}>directions_bike</p>
          <p className="min-w-max text-3xl pl-2 pr-4">8 min</p>

        </div>

        
        <div to="/form/3" onClick={() => handleNext(10000000)} className="cursor-pointer flex flex-row rounded-full bg-transparent border-black border-2 py-3 px-3 mr-4 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="text-3xl text-center px-4">no limit</p>
        </div>

      </div>
      
    </div>
  )
}
  
export default Step6