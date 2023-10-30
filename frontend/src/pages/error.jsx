import { Link } from "react-router-dom";

export default function Error() {
  const queryParameters = new URLSearchParams(window.location.search)
  const error = queryParameters.get("error")
  
  return (
    <div className="font-serif">
        <div className="px-5 sm:pl-10 pt-32">
          <h2 className="text-5xl sm:text-7xl">Oopsie Daisy</h2>
          <h1 className="font-display text-5xl sm:text-[84px] pt-2">Something went wrong :(</h1>

          { (error !== null) ? <h3 className="text-4xl pt-8">Error: {error}</h3> : <></>}
        </div>

        <Link to={`/`} className="px-5 sm:pl-10 pt-20 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-3xl sm:text-4xl">go home</h5>
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </Link>
    </div>
  );
}