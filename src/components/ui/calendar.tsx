"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
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

function CalendarDropdown({ ...props }) {
  const { fromYear, toYear, fromMonth, toMonth } = useDayPicker();
  const { goToMonth, month } = useNavigation();

  const handleMonthChange = (value: string) => {
    const newMonth = new Date(month || new Date());
    newMonth.setMonth(parseInt(value, 10));
    goToMonth(newMonth);
  };

  const handleYearChange = (value: string) => {
    const newYear = new Date(month || new Date());
    newYear.setFullYear(parseInt(value, 10));
    goToMonth(newYear);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2024, i), "LLLL", { locale: pl }),
  }));

  const currentYear = getYear(month || new Date());
  const startYear = fromYear || currentYear - 100;
  const endYear = toYear || currentYear + 10;
  
  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    years.push({ value: i, label: i.toString() });
  }

  return (
    <div {...props} className="flex justify-center gap-2">
      <Select
        value={month ? month.getMonth().toString() : ""}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[120px] h-9 text-sm focus:ring-0">
          <SelectValue placeholder="Miesiąc">
            {month ? format(month, "LLLL", { locale: pl }) : "Miesiąc"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value.toString()}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={month ? getYear(month).toString() : ""}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[80px] h-9 text-sm focus:ring-0">
          <SelectValue placeholder="Rok">
            {month ? getYear(month) : "Rok"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y.value} value={y.value.toString()}>
              {y.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden", 
        caption_dropdowns: "flex justify-center gap-2",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: CalendarDropdown,
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
