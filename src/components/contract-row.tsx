"use client";

import type { Contract } from "@/lib/types";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { Input } from "@/components/ui/input";

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "startDate" | "endDate") => {
    const value = e.target.value;
    // Basic validation for yyyy-mm-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(value) || value === '') {
        const date = value ? new Date(value) : undefined;
        if (date && !isNaN(date.getTime())) {
             updateContract({ ...contract, [field]: date });
        } else if (!value) {
            updateContract({ ...contract, [field]: undefined });
        }
    }
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    try {
        // Ensure date is a valid Date object before formatting
        if (Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())) {
             return date.toISOString().split('T')[0];
        }
        // Handle cases where date might be an invalid string from localStorage
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split('T')[0];
            }
        }
    } catch (e) {
        // console.error("Error formatting date:", e);
    }
    return '';
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
        <Input 
          type="date"
          value={formatDateForInput(contract.startDate)}
          onChange={(e) => handleDateChange(e, "startDate")}
          className="w-full"
        />
      </TableCell>
      <TableCell>
         <Input 
          type="date"
          value={formatDateForInput(contract.endDate)}
          onChange={(e) => handleDateChange(e, "endDate")}
          className="w-full"
          min={contract.startDate ? formatDateForInput(contract.startDate) : ''}
        />
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
