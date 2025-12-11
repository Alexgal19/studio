
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker, useNavigation } from "react-day-picker";
import { pl } from "date-fns/locale";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={pl}
        {...props}
        components={{
          Caption: () => <CustomCaption />,
          Months: () => {
            const { months } = useDayPicker();
            const { goToMonth, nextMonth, previousMonth } = useNavigation();

            if (!months.length) {
              return null;
            }
            const {
              captionStart,
              captionEnd,
              weeks,
              weekdays
            } = months[0];

            return (
              <div className="grid grid-cols-[auto_1fr] items-center gap-y-4">
                {/* Custom Navigation */}
                <div className="flex items-center gap-1 row-start-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!previousMonth}
                    onClick={() => previousMonth && goToMonth(previousMonth)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                   <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={!nextMonth}
                    onClick={() => nextMonth && goToMonth(nextMonth)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Custom Month/Year header */}
                <div className="col-start-2 text-lg font-medium text-center">
                   {format(months[0].month, "LLLL yyyy", { locale: pl })}
                </div>

                {/* Custom Weekday headers */}
                <div className="col-start-2 grid grid-cols-7 text-center text-sm font-medium text-muted-foreground">
                    <div className="font-bold text-foreground">pon</div>
                    <div>wto</div>
                    <div>śro</div>
                    <div>czw</div>
                    <div>pią</div>
                    <div>sob</div>
                    <div>nie</div>
                </div>


                {/* Custom Day grid */}
                <div className="col-span-2 grid grid-cols-1 gap-y-2">
                  {weeks.map((week) => (
                    <div key={week.weekNumber} className="grid grid-cols-7">
                      {week.days.map((day) => (
                        <div
                          key={format(day.date, "T")}
                          className="text-center text-sm"
                        >
                          <Button
                            variant={day.selected ? "default" : "ghost"}
                            size="icon"
                            className={cn("h-8 w-8 rounded-full", {
                              "text-muted-foreground opacity-50": day.outside,
                              "font-bold": day.selected
                            })}
                            onClick={() => props.onSelect?.(day.date, day, {}, {} as any)}
                            disabled={day.disabled}
                          >
                            {format(day.date, "d")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";


function CustomCaption() {
    // This is intentionally left blank because we are creating a fully custom layout.
    // The default caption is replaced by our custom month/year header.
    return null;
}

export { Calendar };
