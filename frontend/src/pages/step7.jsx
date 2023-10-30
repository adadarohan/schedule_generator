import { useNavigate } from "react-router-dom";

function Step7(props) {

  const navigate = useNavigate()
  function  handleBack2Back () {
    props.setUserPrefs({...props.userPrefs, back_to_back: true})
    navigate('/submit')
  }

  function handleSpaced () {
    props.setUserPrefs({...props.userPrefs, back_to_back: false})
    navigate('/submit') 
  }


  return (
    <div className="font-serif">
      <div className="px-5 sm:pl-10 pt-12">
        <h2 className="text-3xl sm:text-5xl">Step 7</h2>
        <h1 className="font-display text-3xl sm:text-5xl pt-2">class frequency</h1>
      </div>

      <div className="flex flex-col pt-12 sm:pt-20 px-5 sm:pl-10">
        <div onClick={handleBack2Back} className="cursor-pointer rounded-full bg-transparent border-black border-2 py-3 px-3 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="text-3xl bg-transparent outline-none text-center px-4">I prefer back-to-back classes</p>
        </div>

        <div onClick={handleSpaced} className="cursor-pointer rounded-full bg-transparent border-black border-2 py-3 px-3 mb-5 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="text-3xl bg-transparent outline-none text-center px-4">I prefer my classes to be spaced out</p>
        </div>

      </div>

      
    </div>
  )
}
  
export default Step7