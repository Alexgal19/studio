
"use client";

import { useState, useEffect } from "react";
import type { Person, SavedSession } from "@/lib/types";
import { PersonCard } from "./person-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Plus, Trash2, BookUser } from "lucide-react";
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
import { Skeleton } from "./ui/skeleton";
import { useSessionManager } from "@/hooks/use-session-manager";
import { SessionManager } from "./session-manager";

export function TempWorkCalculator() {
  const { t, ready } = useTranslation();
  const [persons, setPersons] = useState<Person[]>([]);
  const [limitInDays, setLimitInDays] = useState<number>(548);
  const { installPrompt, handleInstallClick } = usePWAInstaller();
  const [isClient, setIsClient] = useState(false);
  const [isSessionManagerOpen, setSessionManagerOpen] = useState(false);

  const { sessions, saveSession, loadSession, deleteSession, clearAllSessions } = useSessionManager({
    onLoad: (sessionState) => {
      setPersons(sessionState.persons);
      setLimitInDays(sessionState.limitInDays);
    }
  });

  useEffect(() => {
    setIsClient(true);
    const initialSession = loadSession('__last_active__');
    if (initialSession) {
      setPersons(initialSession.persons);
      setLimitInDays(initialSession.limitInDays);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      saveSession('__last_active__', { persons, limitInDays });
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
    if (isClient) {
      setPersons([]);
    }
  };

  if (!isClient || !ready) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="overflow-hidden shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <Button onClick={addPerson}>
          <Plus className="mr-2" />{t('addPerson')}
        </Button>
        <Button variant="outline" onClick={() => setSessionManagerOpen(true)}>
          <BookUser className="mr-2" /> {t('manageSessions')}
        </Button>
        {installPrompt && (
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
        {persons.length > 0 && (
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
      
      <SessionManager
        isOpen={isSessionManagerOpen}
        onOpenChange={setSessionManagerOpen}
        sessions={sessions.filter(s => s.name !== '__last_active__')}
        onSave={(name) => saveSession(name, { persons, limitInDays })}
        onLoad={(name) => {
          const session = loadSession(name);
          if (session) {
            setPersons(session.persons);
            setLimitInDays(session.limitInDays);
            setSessionManagerOpen(false);
          }
        }}
        onDelete={deleteSession}
      />
    </div>
  );
}
