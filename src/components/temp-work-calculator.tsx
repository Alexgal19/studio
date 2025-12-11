
"use client";

import { useState, useEffect } from "react";
import type { Person } from "@/lib/types";
import { PersonCard } from "./person-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { usePWAInstaller } from "./pwa-installer";
import { useTranslation } from "react-i18next";

export function TempWorkCalculator() {
  const { t, ready } = useTranslation();
  const [persons, setPersons] = useState<Person[]>([]);
  const [limitInDays, setLimitInDays] = useState<number>(548);
  const { installPrompt, handleInstallClick } = usePWAInstaller();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedState = localStorage.getItem("tempWorkCalculatorState");
      if (savedState) {
        const { persons: savedPersons, limitInDays: savedLimit } = JSON.parse(savedState);
        const restoredPersons = savedPersons.map((person: Person) => ({
          ...person,
          contracts: person.contracts.map(contract => ({
            ...contract,
            startDate: contract.startDate ? new Date(contract.startDate) : undefined,
            endDate: contract.endDate ? new Date(contract.endDate) : undefined,
          }))
        }));
        setPersons(restoredPersons);
        setLimitInDays(savedLimit || 548);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      setPersons([]);
      setLimitInDays(548);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const stateToSave = JSON.stringify({ persons, limitInDays });
        localStorage.setItem("tempWorkCalculatorState", stateToSave);
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [persons, limitInDays, isClient]);


  const addPerson = () => {
    if (isClient) {
      const newPerson: Person = {
        id: crypto.randomUUID(),
        fullName: "",
        contracts: [
          {
            id: crypto.randomUUID(),
            startDate: undefined,
            endDate: undefined,
          },
        ],
      };
      setPersons([...persons, newPerson]);
    }
  };

  const updatePerson = (updatedPerson: Person) => {
    setPersons(
      persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p))
    );
  };

  const removePerson = (personId: string) => {
    setPersons(persons.filter((p) => p.id !== personId));
  };

  const clearAll = () => {
    setPersons([]);
  };

  if (!ready) {
    return <Card className="overflow-hidden shadow-lg p-6">{t('loadingData')}</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button onClick={addPerson}>
          <Plus className="mr-2" />{t('addPerson')}
        </Button>
        {isClient && installPrompt && (
          <Button variant="secondary" onClick={handleInstallClick}>
            <Download className="mr-2" />
            {t('installApp')}
          </Button>
        )}
        <div className="flex items-center gap-2">
           <label htmlFor="limitDays" className="text-sm font-medium">{t('limitSelectLabel')}</label>
           <Select
              value={String(limitInDays)}
              onValueChange={(value) => setLimitInDays(Number(value))}
            >
              <SelectTrigger id="limitDays" className="w-[120px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="548">{t('limitInDays', {days: 548})}</SelectItem>
                <SelectItem value="540">{t('limitInDays', {days: 540})}</SelectItem>
              </SelectContent>
            </Select>
        </div>
        {isClient && persons.length > 0 && (
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="mr-2" /> {t('clearAll')}
          </Button>
        )}
      </div>

      <AnimatePresence>
        <div className="grid gap-6 md:grid-cols-1">
          {persons.map((person) => (
             <motion.div
              key={person.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <PersonCard
                person={person}
                updatePerson={updatePerson}
                removePerson={removePerson}
                limitInDays={limitInDays}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
