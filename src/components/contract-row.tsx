
"use client";

import type { Contract } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Trash2, CalendarIcon } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ContractRowProps {
  contract: Contract;
  updateContract: (contract: Contract) => void;
  removeContract: (contractId: string) => void;
  isClient: boolean;
}

export function ContractRow({
  contract,
  updateContract,
  removeContract,
  isClient,
}: ContractRowProps) {
  const { t } = useTranslation();
  const [daysUsed, setDaysUsed] = useState(0);

  useEffect(() => {
    if (contract.startDate && contract.endDate) {
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        setDaysUsed(differenceInCalendarDays(end, start) + 1);
        return;
      }
    }
    setDaysUsed(0);
  }, [contract.startDate, contract.endDate]);

  if (!isClient) {
    return (
      <>
        <TableCell>
          <div className="h-9 w-[240px] bg-muted animate-pulse rounded-md" />
        </TableCell>
        <TableCell>
          <div className="h-9 w-[240px] bg-muted animate-pulse rounded-md" />
        </TableCell>
        <TableCell className="text-center font-medium">-</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" disabled>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </>
    );
  }
  
  return (
    <>
      <TableCell>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !contract.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {contract.startDate ? (
                format(contract.startDate, "PPP", { locale: pl })
              ) : (
                <span>{t('selectDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.startDate}
              onSelect={(date) =>
                updateContract({ ...contract, startDate: date })
              }
              initialFocus
              locale={pl}
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
                "w-[240px] justify-start text-left font-normal",
                !contract.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {contract.endDate ? (
                format(contract.endDate, "PPP", { locale: pl })
              ) : (
                <span>{t('selectDate')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={contract.endDate}
              onSelect={(date) =>
                updateContract({ ...contract, endDate: date })
              }
              initialFocus
              locale={pl}
            />
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell className="text-center font-medium">
        {daysUsed > 0 ? t('daysUnit', { count: daysUsed }) : "-"}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeContract(contract.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">{t('removePeriod')}</span>
        </Button>
      </TableCell>
    </>
  );
}
