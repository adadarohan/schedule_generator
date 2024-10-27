import { Checkbox } from "../ui/checkbox";

export default function TopBar({searchParams, setSearchParams}) {

    // Function to checkbox
    function handleCheckboxChange(checked) {
        setSearchParams({
            ...searchParams,
            open_sections_only: checked
        });
    }

    return (
        <div className="flex flex-row text-slate-400 text-sm space-x-6">
            <div className="flex flex-row ">
                <span className="material-symbols-rounded icon_thin_sm mr-1">calendar_month</span>
                <p className="align-bottom pt-1">Spring '25</p>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="only-open-sections" onCheckedChange={handleCheckboxChange} checked={ searchParams.open_sections_only} /> 
                <label
                    htmlFor="only-open-sections"
                    className="align-bottom pt-1"
                >
                    Only Open Sections
                </label>
            </div>

        </div>
    )
}