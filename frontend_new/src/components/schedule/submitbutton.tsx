import { ChevronRight } from "lucide-react"
 
import { Button } from "@/components/ui/button"
 
export function SubmitButton({className, searchParams}) {

    if (searchParams.classes.length === 0 || searchParams.start_time === 0 || searchParams.end_time === 0) {
        return (
            <Button className={className} size="icon" variant="outline" disabled>
                <ChevronRight />
            </Button>
        )
    }
    return (
        <Button className={className} size="icon">
        <ChevronRight />
        </Button>
    )
}