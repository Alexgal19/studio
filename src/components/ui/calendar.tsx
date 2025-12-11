
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "space-y-4",
        month: "space-y-4",
        
        table: 'border-collapse w-full',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Months: ({ ...monthsProps }) => {
            const { goToMonth, nextMonth, previousMonth } = useNavigation();
            const { currentMonth } = useDayPicker();

            const weekdays = ["pon", "wto", "śro", "czw", "pią", "sob", "nie"];

            return (
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                    {/* Left Column for Navigation */}
                    <div className="flex flex-col justify-center items-center gap-4">
                         <button
                            type="button"
                            disabled={!previousMonth}
                            onClick={() => previousMonth && goToMonth(previousMonth)}
                            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-7 w-7")}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            disabled={!nextMonth}
                            onClick={() => nextMonth && goToMonth(nextMonth)}
                             className={cn(buttonVariants({ variant: "outline", size: "icon" }), "h-7 w-7")}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Right Column for Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        <div className="col-span-7 text-lg font-bold">
                            {currentMonth && format(currentMonth, "LLLL yyyy", { locale: pl })}
                        </div>

                        {/* Custom Weekday Headers */}
                        <div className="font-bold text-center">{weekdays[0]}</div>
                        <div className="col-span-6 grid grid-cols-6 text-center font-bold">
                            {weekdays.slice(1).map((day, i) => <div key={i}>{day}</div>)}
                        </div>

                        {/* Days rendered by DayPicker's internal logic */}
                        {monthsProps.children}
                    </div>
                </div>
            );
        },
      }}
      locale={pl}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
