
"use client";

import type { Contract } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { DatePickerWithManualInput } from "./date-picker-with-manual-input";
import { Label } from "./ui/label";

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
  
  return (
    <>
      <TableCell>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor={`start-date-${contract.id}`}>{t('startDate')}</Label>
            <DatePickerWithManualInput
              id={`start-date-${contract.id}`}
              value={contract.startDate}
              onChange={(date) =>
                updateContract({ ...contract, startDate: date })
              }
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor={`end-date-${contract.id}`}>{t('endDate')}</Label>
            <DatePickerWithManualInput
              id={`end-date-${contract.id}`}
              value={contract.endDate}
              onChange={(date) =>
                updateContract({ ...contract, endDate: date })
              }
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center font-medium align-middle">
        {daysUsed > 0 ? t('daysUnit', { count: daysUsed }) : "-"}
      </TableCell>
      <TableCell className="text-right align-middle">
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
