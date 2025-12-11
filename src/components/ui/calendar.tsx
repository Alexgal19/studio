
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker, useNavigation, CaptionProps } from "react-day-picker"
import { format, getMonth, getYear } from "date-fns"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomCaption(props: CaptionProps) {
  const { i18n } = useTranslation();
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  const { currentMonth } = useDayPicker();

  if (!currentMonth) {
    return null;
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(parseInt(e.target.value, 10));
    goToMonth(newMonth);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = new Date(currentMonth);
    newYear.setFullYear(parseInt(e.target.value, 10));
    goToMonth(newYear);
  };

  const currentYear = getYear(props.displayMonth);
  const fromYear = currentYear - 100;
  const toYear = currentYear + 5;

  const years = [];
  for (let i = fromYear; i <= toYear; i++) {
    years.push(i);
  }

  const months = Array.from({ length: 12 }, (_, i) => i);
  const locale = i18n.language === 'pl' ? pl : undefined;

  return (
    <div className="flex justify-center items-center gap-4 mb-4">
      <button
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2">
        <select
          value={getMonth(props.displayMonth)}
          onChange={handleMonthChange}
          className="font-bold bg-transparent border-none focus:ring-0"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {format(new Date(0, month), "LLLL", { locale })}
            </option>
          ))}
        </select>
        <select
          value={getYear(props.displayMonth)}
          onChange={handleYearChange}
          className="font-bold bg-transparent border-none focus:ring-0"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'pl' ? pl : undefined;
  
  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-card", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "hidden", // We use a custom caption
        head_row: "flex mb-2",
        head_cell: "text-muted-foreground rounded-md w-9 font-bold text-center text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatWeekdayName: (day) => format(day, "eee", { locale }).slice(0, 3)
      }}
      components={{
        Caption: CustomCaption,
        IconLeft: () => <ChevronLeft className="h-5 w-5" />,
        IconRight: () => <ChevronRight className="h-5 w-5" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
