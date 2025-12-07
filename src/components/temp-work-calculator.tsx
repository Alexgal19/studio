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
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function TempWorkCalculator() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [limitInDays, setLimitInDays] = useState<number>(548);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setInstallPromptEvent(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const addPerson = () => {
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

  const installApp = async () => {
    if (!installPromptEvent) {
      toast({
        title: "Instalacja",
        description: "Aplikacji nie można zainstalować na tym urządzeniu lub w tej przeglądarce.",
        variant: "destructive"
      });
      return;
    }
    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      toast({
        title: "Sukces!",
        description: "Aplikacja została pomyślnie zainstalowana.",
      });
    }
    setInstallPromptEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button onClick={addPerson}>
          <Plus className="mr-2" />+ Dodaj Osobę
        </Button>
        {installPromptEvent && (
          <Button variant="secondary" onClick={installApp}>
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
              <SelectTrigger className="w-[120px]" id="limitDays">
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
                <Trash2 className="mr-2" />
                Wyczyść wszystko
            </Button>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
            {persons.map((person) => (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
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
        </AnimatePresence>
      </div>
    </div>
  );
}
