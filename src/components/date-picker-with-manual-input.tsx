
"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { pl } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface DatePickerWithManualInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
}

const DATE_FORMAT = "dd.MM.yyyy";

export function DatePickerWithManualInput({ value, onChange }: DatePickerWithManualInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      if (isValid(value)) {
        setInputValue(format(value, DATE_FORMAT));
        setIsInvalid(false);
      }
    } else {
      setInputValue("");
      setIsInvalid(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsInvalid(false);
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
        onChange(undefined);
        setIsInvalid(false);
        return;
    }

    const parsedDate = parse(inputValue, DATE_FORMAT, new Date());
    if (isValid(parsedDate)) {
      onChange(parsedDate);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  const handleCalendarSelect = (date?: Date) => {
    if(date){
        onChange(date);
        setInputValue(format(date, DATE_FORMAT));
    } else {
        onChange(undefined);
        setInputValue("");
    }
    setPopoverOpen(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={t('selectDate')}
        className={cn(
          "w-[240px] pr-10",
          isInvalid && "border-destructive focus-visible:ring-destructive"
        )}
      />
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <CalendarIcon 
              className="h-5 w-5 text-muted-foreground cursor-pointer"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleCalendarSelect}
            initialFocus
            locale={pl}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
