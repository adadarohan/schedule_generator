import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Schedule from "@/components/schedule/schedule"

export default function Menu() {

    return (
        <Tabs defaultValue="account" className="w-full">
            <TabsList>
                <TabsTrigger value="schedule">Schedule Generator</TabsTrigger>
                <TabsTrigger value="classes">Class Explorer</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <Separator className="mt-3 mb-5"></Separator>
            <TabsContent value="schedule" className="px-32"><Schedule></Schedule></TabsContent>
            <TabsContent value="classes" >Change your password here.</TabsContent>
            <TabsContent value="about" >Change your password here.</TabsContent>
        </Tabs>
    )
}
