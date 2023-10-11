import {Link } from "react-router-dom";

function Step2(props) {

  let handleOpen = () => props.setUserPrefs({...props.userPrefs, open_sections_only: true} )
  let handleClosed = () => props.setUserPrefs({...props.userPrefs, open_sections_only: false} )

  return (
    <div className="font-serif">
      <div className="pl-10 pt-12">
        <h2 className="text-5xl">Step 2</h2>
        <h1 className="font-display text-5xl pt-2">select your section type</h1>
      </div>

      <div className="flex flex-col pt-20 pl-10">
        <Link to="/form/3" onClick={handleOpen} className="rounded-full bg-transparent border-black border-2 py-3 px-3 mr-4 mb-8 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="text-3xl bg-transparent outline-none text-center px-4">open sections only</p>
        </Link>

        <Link to="/form/3" onClick={handleClosed} className="rounded-full bg-transparent border-black border-2 py-3 px-3 mr-4 mb-5 self-start hover:bg-black hover:text-white transition-all delay-100 ease-in-out">
          <p className="text-3xl bg-transparent outline-none text-center px-4">both closed and open sections</p>
        </Link>

      </div>

      
    </div>
  )
}
  
export default Step2