
"use client";

import type { Person, Contract } from "@/lib/types";
import { useMemo, useState, useEffect } from "react";
import { ContractRow } from "./contract-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface PersonCardProps {
  person: Person;
  updatePerson: (person: Person) => void;
  removePerson: (personId: string) => void;
  limitInDays: number;
}

export function PersonCard({
  person,
  updatePerson,
  removePerson,
  limitInDays,
}: PersonCardProps) {
  const { t, ready } = useTranslation();
  const [totalDaysUsed, setTotalDaysUsed] = useState<number | null>(null);
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const daysUsed = person.contracts.reduce((total, contract) => {
      if (contract.startDate && contract.endDate) {
        const start = new Date(contract.startDate);
        const end = new Date(contract.endDate);
        if(!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
            return total + differenceInCalendarDays(end, start) + 1;
        }
      }
      return total;
    }, 0);
    setTotalDaysUsed(daysUsed);
    setRemainingDays(limitInDays - daysUsed);
  }, [person.contracts, limitInDays]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePerson({ ...person, fullName: e.target.value });
  };

  const addContract = () => {
    if (isClient) {
      const newContract: Contract = {
        id: crypto.randomUUID(),
        startDate: new Date(),
        endDate: new Date(),
      };
      updatePerson({ ...person, contracts: [...person.contracts, newContract] });
    }
  };

  const updateContract = (updatedContract: Contract) => {
    const updatedContracts = person.contracts.map((c) =>
      c.id === updatedContract.id ? updatedContract : c
    );
    updatePerson({ ...person, contracts: updatedContracts });
  };

  const removeContract = (contractId: string) => {
    const updatedContracts = person.contracts.filter((c) => c.id !== contractId);
    updatePerson({ ...person, contracts: updatedContracts });
  };

  if (!ready) {
    return <Card className="overflow-hidden shadow-lg p-6">{t('loadingData')}</Card>;
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-card">
        <CardTitle className="flex-grow">
          <Input
            placeholder={t('personNamePlaceholder')}
            value={person.fullName}
            onChange={handleNameChange}
            className="text-lg font-semibold border-0 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => removePerson(person.id)}>
          <Trash2 className="h-5 w-5 text-destructive" />
          <span className="sr-only">{t('removePerson')}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('startDate')}</TableHead>
              <TableHead>{t('endDate')}</TableHead>
              <TableHead className="text-center">{t('usedDays')}</TableHead>
              <TableHead className="text-right">{t('action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {person.contracts.map((contract) => (
                <TableRow
                  as={motion.tr}
                  key={contract.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <ContractRow
                    contract={contract}
                    updateContract={updateContract}
                    removeContract={removeContract}
                  />
                </TableRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={addContract}>
            <Plus className="mr-2 h-4 w-4" />{t('addPeriod')}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 bg-muted/50 p-4">
        <h3 className="font-semibold text-lg">{t('calculationResults')}</h3>
        {totalDaysUsed !== null && remainingDays !== null ? (
          <div
            className={cn(
              "w-full p-4 rounded-lg transition-colors duration-300",
              remainingDays >= 0
                ? "bg-primary/10 text-primary-foreground"
                : "bg-destructive/10 text-destructive"
            )}
          >
            <div className="flex justify-between items-center">
              <span 
                className={cn(remainingDays >= 0 ? "text-primary" : "text-destructive")}
                dangerouslySetInnerHTML={{ __html: t('daysUsedLabel', { totalDaysUsed }) }} 
              />
              <span 
                className={cn(remainingDays >= 0 ? "text-primary" : "text-destructive")}
                dangerouslySetInnerHTML={{ __html: t('daysRemainingLabel', { remainingDays }) }}
              />
            </div>
            {remainingDays < 0 && (
              <p className="text-destructive font-bold text-center mt-2">
                {t('limitExceeded', { days: Math.abs(remainingDays) })}
              </p>
            )}
          </div>
        ) : (
          <div className="w-full p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
              <span>-</span>
              <span>-</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
