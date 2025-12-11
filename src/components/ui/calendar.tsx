
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, HeadProps, RowProps } from "react-day-picker"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Custom component to render the weekday names in the desired grid layout
function CustomHead({ classNames, ...props }: HeadProps) {
  // Assuming weekStartsOn is set to 1 (Monday) via locale={pl}
  const weekdays = props.locale?.weekdaysShort || ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'];
  
  // Reorder for display: Sunday first, then Mon-Sat
  const displayOrder = [
    weekdays[6], // Sunday
    ...weekdays.slice(0, 6) // Monday to Saturday
  ];

  return (
    <div className={cn("grid grid-cols-7 gap-x-2", classNames?.head_row)}>
      {displayOrder.map((weekday, i) => (
        <div key={i} className={cn("text-center text-sm font-normal text-muted-foreground", classNames?.head_cell)}>
          {weekday}
        </div>
      ))}
    </div>
  );
}


// Custom component to render the date cells in the desired grid layout
function CustomRow({ classNames, ...props }: RowProps) {
  return (
    <div className="grid grid-cols-7 gap-x-2 mt-2">
      {props.dates.map((date, i) => (
        <div key={i} className={cn("h-9 w-9 text-center text-sm p-0 relative", classNames?.cell)}>
          {props.children[i]}
        </div>
      ))}
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <DayPicker
      locale={pl}
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown-buttons"
      fromYear={currentYear - 100}
      toYear={currentYear}
      className={cn("p-3 bg-card rounded-lg border shadow-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between items-center mb-4",
        caption_label: "text-sm font-medium",
        caption_dropdowns: "flex gap-2",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse space-y-1",
        head: "w-full",
        head_row: "hidden", // We hide the default head row
        row: "hidden", // We hide the default row
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-blue-600 text-primary-foreground hover:bg-blue-600 hover:text-primary-foreground focus:bg-blue-600 focus:text-primary-foreground",
        day_today: "bg-blue-100 text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Head: CustomHead,
        Row: CustomRow,
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
