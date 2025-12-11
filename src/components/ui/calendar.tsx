
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker"
import { pl } from "date-fns/locale"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

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
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
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
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
        ...(props.components || {}),
      }}
      locale={pl}
      {...props}
    >
      <CustomCalendarLayout />
    </DayPicker>
  )
}
Calendar.displayName = "Calendar"


function CustomCaption(props: React.ComponentProps<typeof DayPicker>["components"]["Caption"]) {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    const { currentMonth } = useDayPicker();
    
    return (
        <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
                <button
                    disabled={!previousMonth}
                    onClick={() => previousMonth && goToMonth(previousMonth)}
                    className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <h2 className="text-sm font-medium">
                    {format(props.displayMonth, "LLLL yyyy", { locale: pl })}
                </h2>
                <button
                    disabled={!nextMonth}
                    onClick={() => nextMonth && goToMonth(nextMonth)}
                    className={cn(buttonVariants({ variant: "outline" }), "h-8 w-8 p-0")}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}


const CustomCalendarLayout = () => {
  const {
    locale,
    classNames,
    styles,
    currentMonth,
    ...dayPicker
  } = useDayPicker();

  const { weeks } = dayPicker;

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2024, 0, i + 1); // A week that starts on Monday
    return format(date, "eee", { locale });
  });

  return (
    <div className="grid grid-cols-[1fr_6fr] gap-x-4">
        {/* Custom Header */}
        <div className="font-bold text-center">{weekDays[0]}</div>
        <div className="grid grid-cols-6 text-center">
            {weekDays.slice(1).map((day, i) => (
                <div key={i} className="font-bold">{day}</div>
            ))}
        </div>

        {/* Custom Body */}
        {weeks.map((week) => (
            <React.Fragment key={week.weekNumber}>
                <div className="text-center">
                    {week.days[0] && (
                         <div
                            className={cn("h-9 w-9 flex items-center justify-center rounded-md",
                                classNames.day,
                                {
                                    [classNames.day_selected || ""]: week.days[0].selected,
                                    [classNames.day_today || ""]: week.days[0].today,
                                    [classNames.day_outside || ""]: week.days[0].outside,
                                    [classNames.day_disabled || ""]: week.days[0].disabled,
                                }
                            )}
                            onClick={() => dayPicker.onDayClick?.(week.days[0].date, {}, new MouseEvent("click"))}
                         >
                            {format(week.days[0].date, "d")}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-6 text-center">
                    {week.days.slice(1).map((day) => (
                        <div
                            key={day.date.toISOString()}
                            className={cn("h-9 w-9 flex items-center justify-center rounded-md",
                                classNames.day,
                                {
                                    [classNames.day_selected || ""]: day.selected,
                                    [classNames.day_today || ""]: day.today,
                                    [classNames.day_outside || ""]: day.outside,
                                    [classNames.day_disabled || ""]: day.disabled,
                                }
                            )}
                            onClick={() => dayPicker.onDayClick?.(day.date, {}, new MouseEvent("click"))}
                        >
                            {day.outside ? "" : format(day.date, "d")}
                        </div>
                    ))}
                </div>
            </React.Fragment>
        ))}
    </div>
  );
};


export { Calendar }

    