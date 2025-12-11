"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation, type DropdownProps } from "react-day-picker"
import { format, getYear } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CalendarDropdown(props: DropdownProps) {
  const { fromYear, toYear } = useDayPicker()
  const { goToMonth, month } = useNavigation()
  
  const currentMonth = month || new Date()

  if (props.name === "months") {
    const months = Array.from({ length: 12 }, (_, i) => 
      new Date(currentMonth.getFullYear(), i, 1)
    )

    return (
      <Select
        value={currentMonth.getMonth().toString()}
        onValueChange={(value) => {
          const newDate = new Date(currentMonth.getFullYear(), parseInt(value))
          goToMonth(newDate)
        }}
      >
        <SelectTrigger className="h-8 w-[130px] text-sm font-medium capitalize">
          <SelectValue>{format(currentMonth, "LLLL", { locale: pl })}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((m, i) => (
            <SelectItem key={i} value={i.toString()} className="capitalize">
              {format(m, "LLLL", { locale: pl })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  if (props.name === "years") {
    const earliestYear = fromYear || getYear(new Date()) - 10
    const latestYear = toYear || getYear(new Date()) + 10
    
    const years = Array.from(
      { length: latestYear - earliestYear + 1 },
      (_, i) => earliestYear + i
    )

    return (
      <Select
        value={currentMonth.getFullYear().toString()}
        onValueChange={(value) => {
          const newDate = new Date(parseInt(value), currentMonth.getMonth())
          goToMonth(newDate)
        }}
      >
        <SelectTrigger className="h-8 w-[80px] text-sm font-medium">
          <SelectValue>{currentMonth.getFullYear()}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return null
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={pl}
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-background rounded-xl border shadow-sm", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-2",
        caption_label: "hidden",
        caption_dropdowns: "flex justify-center gap-2 w-full",
        nav: "hidden", 
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-medium text-[0.75rem] uppercase tracking-wider",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
        day_today: "bg-accent text-accent-foreground font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
