"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"
import { pl } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { ScrollArea } from "./scroll-area"

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
      // ZMIANA: Dodano nowoczesny kontener z cieniem, zaokrągleniami i efektem glassmorphism
      className={cn(
        "p-4 border border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl rounded-2xl",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden",
        caption_dropdowns: "flex justify-center gap-2",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          // ZMIANA: Bardziej subtelne przyciski nawigacji
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-muted border-none transition-opacity"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        // ZMIANA: Usunięto rounded-md na rzecz pełnej kontroli w 'day', obsługa rounded-l/r dla zakresów
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          // ZMIANA: rounded-full dla nowoczesnego wyglądu, animacja transition-all
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full transition-all duration-200 hover:scale-105"
        ),
        day_range_end: "day-range-end",
        day_selected:
          // ZMIANA: Dodano shadow-md dla wybranego elementu, aby go wyróżnić
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md shadow-primary/20",
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
        Dropdown: ({ value, onChange, children, ...props }: DropdownProps) => {
          const options = React.Children.toArray(
            children
          ) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[]
          const selected = options.find((child) => child.props.value === value)
          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>
            onChange?.(changeEvent)
          }
          return (
            <Select
              value={value?.toString()}
              onValueChange={(value) => {
                handleChange(value)
              }}
            >
              {/* ZMIANA: Lżejszy wygląd triggera */}
              <SelectTrigger className="pr-1.5 focus:ring-0 w-[120px] h-8 border-none bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg font-medium text-xs shadow-none">
                <SelectValue>{selected?.props?.children}</SelectValue>
              </SelectTrigger>
              <SelectContent position="popper" className="rounded-xl border-border/50 shadow-xl">
                <ScrollArea className="h-48">
                  {options.map((option, id: number) => (
                    <SelectItem
                      key={`${option.props.value}-${id}`}
                      value={option.props.value?.toString() ?? ""}
                      className="rounded-lg text-xs cursor-pointer focus:bg-accent focus:text-accent-foreground"
                    >
                      {option.props.children}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          )
        },
      }}
      {...props}
      locale={pl}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
