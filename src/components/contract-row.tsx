"use client";

import type { Contract } from "@/lib/types";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, CalendarIcon } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface ContractRowProps {
  contract: Contract;
  updateContract: (contract: Contract) => void;
  removeContract: (contractId: string) => void;
}

export function ContractRow({
  contract,
  updateContract,
  removeContract,
}: ContractRowProps) {
  const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate") => {
    updateContract({ ...contract, [field]: date });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return 'Wybierz datę';
    try {
        if (Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())) {
             return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
            }
        }
    } catch (e) {}
    return 'Wybierz datę';
  };

  const daysUsed = useMemo(() => {
    if (contract.startDate && contract.endDate) {
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      if(!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        return differenceInCalendarDays(end, start) + 1;
      }
    }
    return 0;
  }, [contract.startDate, contract.endDate]);

  return (
    <TableRow>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !contract.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateForInput(contract.startDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.startDate}
              onSelect={(date) => handleDateChange(date, "startDate")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !contract.endDate && "text-muted-foreground"
              )}
              disabled={!contract.startDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateForInput(contract.endDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.endDate}
              onSelect={(date) => handleDateChange(date, "endDate")}
              disabled={{ before: contract.startDate }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell className="text-center font-medium">
        {daysUsed > 0 ? `${daysUsed} dni` : "-"}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => removeContract(contract.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Usuń okres</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
