import {Link } from "react-router-dom";

function Step3(props) {

  return (
    <div className="font-serif">
      <div className="pl-10 pt-12">
        <h2 className="text-5xl">Step 3</h2>
        <h1 className="font-display text-5xl pt-2">select your sections</h1>
      </div>

      <div className="flex flex-col pt-20 pl-10">
      </div>

      <Link to="/form/2" className="fixed bottom-0 right-0 pb-10 pr-16  transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">next</h5>
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
      </Link>
    </div>
  )
}
  
export default Step3