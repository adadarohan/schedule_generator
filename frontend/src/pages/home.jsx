import {Link } from "react-router-dom";

function Home() {

    return (
      <div className="font-serif">
        <div className="pl-10 pt-32">
          <h2 className="text-7xl">The better</h2>
          <h1 className="font-display text-[84px] pt-2">Schedule Generator.</h1>
        </div>
  
        <Link to={`form/1`} className="pl-10 pt-20 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">get started</h5>
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </Link>
      </div>
    )
  }
  
  export default Home
  