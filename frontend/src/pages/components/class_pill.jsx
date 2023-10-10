
function ClassPill(props) {
    return (
        <div className="flex flex-row rounded-full bg-transparent border-black border-2 py-3 px-3">
            <p  className="text-3xl bg-transparent outline-none placeholder:text-slate-600 w-36">{props.name}</p>
        </div>
    )
    }


export default ClassPill