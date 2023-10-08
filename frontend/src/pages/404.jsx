import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="font-serif">
        <div className="pl-10 pt-32">
          <h2 className="text-7xl">Oopsie Daisy</h2>
          <h1 className="font-display text-[84px] pt-2">Page not found</h1>
        </div>

        <Link to={`/`} className="pl-10 pt-20 transition hover:-translate-y-2 flex flex-row justify-start duration-300 max-w-max">
          <h5 className="text-4xl">go home</h5>
          <span className="material-symbols-outlined text-5xl">chevron_right</span>
        </Link>
    </div>
  );
}