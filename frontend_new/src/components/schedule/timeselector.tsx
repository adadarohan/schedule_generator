import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TimeSelector({className, onChange, label}) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={label}/>
      </SelectTrigger>
      <SelectContent className="max-h-56">
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
            <SelectItem value="7">7 am</SelectItem>
            <SelectItem value="8">8 am</SelectItem>
            <SelectItem value="9">9 am</SelectItem>
            <SelectItem value="10">10 am</SelectItem>
            <SelectItem value="11">11 am</SelectItem>
            <SelectItem value="12">12 pm</SelectItem>
            <SelectItem value="13">1 pm</SelectItem>
            <SelectItem value="14">2 pm</SelectItem>
            <SelectItem value="15">3 pm</SelectItem>
            <SelectItem value="16">4 pm</SelectItem>
            <SelectItem value="17">5 pm</SelectItem>
            <SelectItem value="18">6 pm</SelectItem>
            <SelectItem value="19">7 pm</SelectItem>
            <SelectItem value="20">8 pm</SelectItem>
            <SelectItem value="21">9 pm</SelectItem>
            <SelectItem value="22">10 pm</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
