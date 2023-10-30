import { Link } from "react-router-dom";

export default function Overflow() {  
  return (
    <div className="font-serif">
        <div className="px-5 sm:pl-10 pt-32">
          <h1 className="font-display text-5xl sm:text-[84px] pt-2">Class limit exceeded</h1>
          <p className="text-xl sm:text-2xl pt-10">Your classes have over a million possible schedules. You have 3 options: </p>
          <ol className="text-xl pt-5">
            <li >1. Remove some sections from your classes </li>
            <li >2. Set a later earliest class time, or an earlier latest class time</li>
            <li >3. Wait until next semester for me to fix this </li>
          </ol>
        </div>

        <Link to={`/`} className="px-5 sm:pl-10 pt-20 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-3xl sm:text-4xl">go home</h5>
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </Link>
    </div>
  );
}