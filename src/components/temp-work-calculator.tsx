"use client";

import { useState, useEffect } from "react";
import type { Person } from "@/lib/types";
import { PersonCard } from "./person-card";
import { Button } from "@/components/ui/button";
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

export function TempWorkCalculator() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [limitInDays, setLimitInDays] = useState<number>(548);
  const { installPrompt, handleInstallClick } = usePWAInstaller();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button onClick={addPerson}>
          <Plus className="mr-2" />+ Dodaj Osobę
        </Button>
        {installPrompt && (
          <Button variant="secondary" onClick={handleInstallClick}>
            <Download className="mr-2" />
            Zainstaluj aplikację
          </Button>
        )}
        <div className="flex items-center gap-2">
           <label htmlFor="limitDays" className="text-sm font-medium">Wybierz limit dni:</label>
           <Select
              value={String(limitInDays)}
              onValueChange={(value) => setLimitInDays(Number(value))}
            >
              <SelectTrigger id="limitDays" className="w-[120px]">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="548">548 dni</SelectItem>
                <SelectItem value="540">540 dni</SelectItem>
              </SelectContent>
            </Select>
        </div>
        {persons.length > 0 && (
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="mr-2" /> Wyczyść wszystko
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