
"use client";

import type { Contract } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { DatePickerWithManualInput } from "./date-picker-with-manual-input";

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
  
  return (
    <TableRow>
      <TableCell>
        <DatePickerWithManualInput
          value={contract.startDate}
          onChange={(date) =>
            updateContract({ ...contract, startDate: date })
          }
        />
      </TableCell>
      <TableCell>
        <DatePickerWithManualInput
          value={contract.endDate}
          onChange={(date) =>
            updateContract({ ...contract, endDate: date })
          }
        />
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
    </TableRow>
  );
}
