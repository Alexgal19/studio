
"use client";

import type { Person, Contract, Period } from "@/lib/types";
import { useState, useEffect } from "react";
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
import { differenceInCalendarDays, addDays, format, addMonths, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Skeleton } from "./ui/skeleton";

interface PersonCardProps {
  person: Person;
  updatePerson: (person: Person) => void;
  removePerson: (personId: string) => void;
  limitInDays: number;
}

const groupContractsIntoPeriods = (personId: string, contracts: Contract[], limitInDays: number): Period[] => {
  const sortedContracts = [...contracts]
    .filter(c => c.startDate && c.endDate && isAfter(new Date(c.endDate), new Date(c.startDate)))
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
    
  const contractsWithoutStartDate = contracts.filter(c => !c.startDate || !c.endDate || !isAfter(new Date(c.endDate), new Date(c.startDate)));

  if (sortedContracts.length === 0) {
      if(contractsWithoutStartDate.length > 0) {
        const period: Period = {
            id: `period-new-${personId}`,
            startDate: undefined,
            endDate: undefined,
            contracts: contractsWithoutStartDate,
            totalDaysUsed: 0,
            remainingDays: limitInDays,
          };
          return [period];
      }
    return [];
  }

  const periods: Period[] = [];
  let currentPeriod: Period | null = null;

  for (const contract of sortedContracts) {
    if (!currentPeriod) {
      currentPeriod = createNewPeriod(contract, limitInDays);
      periods.push(currentPeriod);
    } else {
      if (isAfter(new Date(contract.startDate!), new Date(currentPeriod.endDate!))) {
        currentPeriod = createNewPeriod(contract, limitInDays);
        periods.push(currentPeriod);
      } else {
        currentPeriod.contracts.push(contract);
      }
    }
  }

  periods.forEach(period => {
    const daysUsed = calculateDaysUsed(period.contracts);
    period.totalDaysUsed = daysUsed;
    period.remainingDays = limitInDays - daysUsed;

    if (period.remainingDays >= 0) {
      const latestEndDate = period.contracts.reduce((latest: Date | null, contract) => {
        const endDate = new Date(contract.endDate!);
        return !latest || endDate > latest ? endDate : latest;
      }, null);
      if (latestEndDate) {
        period.canExtendUntil = format(addDays(latestEndDate, period.remainingDays), "dd.MM.yyyy");
      }
    } else {
        if(period.startDate) {
            const newPeriodStartDate = addDays(addMonths(period.startDate, 36), 0);
            period.resetDate = format(newPeriodStartDate, "dd.MM.yyyy");
        }
    }
  });

  if (contractsWithoutStartDate.length > 0) {
    const lastPeriod = periods[periods.length - 1];
    if (lastPeriod) {
        lastPeriod.contracts.push(...contractsWithoutStartDate);
    } else {
        const newPeriod: Period = {
            id: `period-new-${personId}`,
            startDate: undefined,
            endDate: undefined,
            contracts: contractsWithoutStartDate,
            totalDaysUsed: 0,
            remainingDays: limitInDays,
        };
        periods.push(newPeriod);
    }
  }


  return periods;
};

const createNewPeriod = (startingContract: Contract, limitInDays: number): Period => {
  const periodStartDate = new Date(startingContract.startDate!);
  const periodEndDate = addDays(addMonths(periodStartDate, 36),-1);
  return {
    id: `period-${periodStartDate.getTime()}`,
    startDate: periodStartDate,
    endDate: periodEndDate,
    contracts: [startingContract],
    totalDaysUsed: 0,
    remainingDays: limitInDays,
  };
};

const calculateDaysUsed = (contracts: Contract[]): number => {
    return contracts.reduce((total, contract) => {
        if (contract.startDate && contract.endDate) {
          const start = new Date(contract.startDate);
          const end = new Date(contract.endDate);
          if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && isAfter(end, start)) {
            return total + differenceInCalendarDays(end, start) + 1;
          }
        }
        return total;
      }, 0);
}


export function PersonCard({
  person,
  updatePerson,
  removePerson,
  limitInDays,
}: PersonCardProps) {
  const { t, ready } = useTranslation();
  const [totalDaysUsed, setTotalDaysUsed] = useState<number>(0);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const allContractsHaveDates = person.contracts.every(c => c.startDate && c.endDate);

    if (person.contracts.length > 0) {
        const groupedPeriods = groupContractsIntoPeriods(person.id, person.contracts, limitInDays);
        setPeriods(groupedPeriods);

        if(allContractsHaveDates) {
            const totalDays = groupedPeriods.reduce((sum, period) => sum + period.totalDaysUsed, 0);
            setTotalDaysUsed(totalDays);
            setRemainingDays(limitInDays - totalDays); // This might not be logical anymore if periods reset limit.
        } else {
            const totalDays = calculateDaysUsed(person.contracts);
            setTotalDaysUsed(totalDays);
            setRemainingDays(limitInDays - totalDays);
        }
    } else {
        setPeriods([]);
        setTotalDaysUsed(0);
        setRemainingDays(limitInDays);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person.id, limitInDays, JSON.stringify(person.contracts)]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePerson({ ...person, fullName: e.target.value });
  };

  const addContract = () => {
      const newContract: Contract = {
        id: crypto.randomUUID(),
        startDate: undefined,
        endDate: undefined,
      };
      updatePerson({ ...person, contracts: [...person.contracts, newContract] });
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

  if (!isClient || !ready) {
    return (
        <Card className="overflow-hidden shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-40 w-full" />
        </Card>
    )
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
      <CardContent className="space-y-4 pt-4">
        {periods.length > 0 ? (
          periods.map((period, index) => (
            <Card key={period.id} className="bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('period')} {index + 1}: {period.startDate ? format(period.startDate, 'dd.MM.yyyy') : t('newContracts')} - {period.endDate ? format(period.endDate, 'dd.MM.yyyy') : ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">{t('period')}</TableHead>
                      <TableHead className="text-center">{t('usedDays')}</TableHead>
                      <TableHead className="text-right">{t('action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {period.contracts.map((contract) => (
                        <motion.tr
                          key={contract.id}
                          layout="position"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-full"
                          as={TableRow}
                        >
                          <ContractRow
                            contract={contract}
                            updateContract={updateContract}
                            removeContract={removeContract}
                          />
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
               <CardFooter className="flex-col items-start gap-2 bg-muted/50 p-4">
                <h3 className="font-semibold">{t('periodCalculation')}</h3>
                <div
                  className={cn(
                    "w-full p-3 rounded-lg text-sm",
                    period.remainingDays >= 0
                      ? "bg-primary/10"
                      : "bg-destructive/10"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className={cn(period.remainingDays >= 0 ? "text-primary" : "text-destructive")}>
                      {t('daysUsedLabel_prefix')} <strong>{period.totalDaysUsed}</strong> {t('daysUsedLabel_suffix')}
                    </span>
                    <span className={cn(period.remainingDays >= 0 ? "text-primary" : "text-destructive")}>
                      {t('daysRemainingLabel_prefix')} <strong>{period.remainingDays}</strong> {t('daysRemainingLabel_suffix')}
                    </span>
                  </div>
                  {period.remainingDays < 0 && (
                    <>
                      <p className="text-destructive font-bold text-center mt-2">
                        {t('limitExceeded', { days: Math.abs(period.remainingDays) })}
                      </p>
                      {period.resetDate && (
                        <p className="text-primary font-bold text-center mt-2">
                          {t('next36MonthPeriod')} {period.resetDate}
                        </p>
                      )}
                    </>
                  )}
                  {period.remainingDays >= 0 && period.canExtendUntil && (
                    <p className="text-primary font-bold text-center mt-2">
                      {t('canExtendUntil')} {period.canExtendUntil}
                    </p>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
            <div className="text-center text-muted-foreground py-4">{t('addContractsToSeePeriods')}</div>
        )}
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={addContract}>
            <Plus className="mr-2 h-4 w-4" />{t('addPeriod')}
          </Button>
        </div>
      </CardContent>
        <CardFooter className="flex-col items-start gap-2 bg-muted/50 p-4">
          <h3 className="font-semibold text-lg">{t('totalCalculation')}</h3>
          <div
            className={cn(
              "w-full p-4 rounded-lg transition-colors duration-300",
               "bg-primary/10"
            )}
          >
            <div className="flex justify-between items-center">
              <span className="text-primary">
                {t('totalDaysUsedLabel')} <strong>{totalDaysUsed}</strong>
              </span>
            </div>
          </div>
        </CardFooter>
    </Card>
  );
}
