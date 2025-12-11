"use client";

import type { Contract } from "@/lib/types";
import { useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { pl } from "date-fns/locale";

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

  useEffect(() => {
    // DIAGNOSTIC ALERT: This will trigger if the component is correctly loaded.
    alert("DIAGNOSTIC: contract-row.tsx HAS BEEN LOADED. If you see this, the problem is likely cache or the calendar file itself.");
  }, []);

  const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate") => {
    updateContract({ ...contract, [field]: date });
  };

  const daysUsed = useMemo(() => {
    if (contract.startDate && contract.endDate) {
      return differenceInCalendarDays(contract.endDate, contract.startDate) + 1;
    }
    return 0;
  }, [contract.startDate, contract.endDate]);

  return (
    <>
      <TableCell>
        <div className="bg-red-500 text-white p-1 font-bold">DIAGNOSTIC TEST ACTIVE</div>
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
              {contract.startDate ? (
                format(contract.startDate, "PPP", { locale: pl })
              ) : (
                <span>Wybierz datę</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.startDate}
              onSelect={(date) => handleDateChange(date, "startDate")}
              disabled={{ after: contract.endDate }}
              initialFocus
              locale={pl}
              captionLayout="dropdown-buttons"
              fromYear={new Date().getFullYear() - 10}
              toYear={new Date().getFullYear() + 10}
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
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {contract.endDate ? (
                format(contract.endDate, "PPP", { locale: pl })
              ) : (
                <span>Wybierz datę</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.endDate}
              onSelect={(date) => handleDateChange(date, "endDate")}
              disabled={{ before: contract.startDate }}
              initialFocus
              locale={pl}
              captionLayout="dropdown-buttons"
              fromYear={new Date().getFullYear() - 10}
              toYear={new Date().getFullYear() + 10}
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
    </>
  );
}
