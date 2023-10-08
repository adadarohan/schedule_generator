import { useState } from "react";

export default function Searchbox() {
    const [value, setValue] = useState("");

    return (
        <div className="flex flex-row rounded-full bg-transparent border-black border-2 py-3 px-3">
            <span className="material-symbols-outlined text-4xl pr-3">search</span>
            <input
            className="text-3xl bg-transparent outline-none placeholder:text-slate-600 w-36"
            type="text"
            placeholder="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}