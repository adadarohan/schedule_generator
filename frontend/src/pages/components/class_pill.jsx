// Desc: This component is used to display the classes that the user has chosen

function ItemRemoved (props) {
    console.log("Item removed", props)
    props.setChosenClasses(props.chosen_classes.filter(item => item !== props.name))
    if (props.chosen_classes.length === 1) {
        console.log("Hide PLus")
        props.setShowPlus(false)
    }
}

function ClassPill(props) {
    return (
        <div className="flex flex-row rounded-full bg-transparent border-black border-2 py-3 px-3 mr-4 self-start mb-5 ">
            <p  className="text-3xl bg-transparent outline-none placeholder:text-slate-600 text-center px-4">{props.name}</p>
            <span className="material-symbols-outlined text-4xl pr-3 cursor-pointer" onClick={() => ItemRemoved(props)}>close</span>
        </div>
    )
}


export default ClassPill