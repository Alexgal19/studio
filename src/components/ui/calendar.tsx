"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { format, isValid } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"

function CustomDay(props: { date: Date }) {
  if (!props.date || !isValid(props.date)) {
    return <></>;
  }
    
  const { currentMonth } = useDayPicker()
  const isOutside = currentMonth && isValid(currentMonth) ? props.date.getMonth() !== currentMonth.getMonth() : false

  return (
    <div
      className={cn(
        "flex items-center justify-center h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:opacity-100 rounded-md",
        "hover:bg-accent",
        isOutside && "text-muted-foreground opacity-50"
      )}
    >
      {format(props.date, "d")}
    </div>
  )
}

function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      locale={pl}
      className={cn("p-3 bg-card text-card-foreground rounded-lg border", className)}
      classNames={{
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_disabled: "text-muted-foreground opacity-50",
      }}
      components={{
        Toolbar: () => null, // Hide default toolbar
        Day: ({ date }) => <CustomDay date={date} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
