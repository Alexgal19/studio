
"use client";

import type { Contract } from "@/lib/types";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
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
  const daysUsed = useMemo(() => {
    if (contract.startDate && contract.endDate) {
      const start = new Date(contract.startDate);
      const end = new Date(contract.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        return differenceInCalendarDays(end, start) + 1;
      }
    }
    return 0;
  }, [contract.startDate, contract.endDate]);

  const formatDateForInput = (date?: Date): string => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <>
      <TableCell>
        <Input
          type="date"
          value={formatDateForInput(contract.startDate)}
          onChange={(e) =>
            updateContract({
              ...contract,
              startDate: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
          className="w-full p-2 border rounded-md"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={formatDateForInput(contract.endDate)}
          onChange={(e) =>
            updateContract({
              ...contract,
              endDate: e.target.value ? new Date(e.target.value) : undefined,
            })
          }
          className="w-full p-2 border rounded-md"
          min={formatDateForInput(contract.startDate)}
          disabled={!contract.startDate}
        />
      </TableCell>
      <TableCell className="text-center font-medium">
        {daysUsed > 0 ? `${daysUsed} dni` : "-"}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeContract(contract.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Usuń okres</span>
        </Button>
      </TableCell>
    </>
  );
}
