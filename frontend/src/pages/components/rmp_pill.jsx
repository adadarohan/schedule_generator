export function RMPPill({rating, link}) {

    if (rating > 4.0) {
        return (
            <a href={link} target="_blank" rel="noreferrer" className="ml-2 text-xs sm:text-sm bg-green-600 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md">
            {rating}
            </a>
        )
    } else if (rating > 2.0) {
        return (
            <a href={link} target="_blank" rel="noreferrer" className="ml-2 text-xs sm:text-sm bg-yellow-600 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md">
            {rating}
            </a>
        )
    } else {
        return (
            <a href={link} target="_blank" rel="noreferrer" className="ml-2 text-xs sm:text-sm bg-red-600 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-md">
            {rating}
            </a>
        )
    }

}
