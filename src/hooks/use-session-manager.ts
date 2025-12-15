
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AppState, SavedSession } from '@/lib/types';

const SESSIONS_STORAGE_KEY = 'tempWorkCalculatorSessions';

interface UseSessionManagerProps {
  onLoad: (state: AppState) => void;
}

export function useSessionManager({ onLoad }: UseSessionManagerProps) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    try {
      const savedSessionsRaw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (savedSessionsRaw) {
        const parsedSessions: SavedSession[] = JSON.parse(savedSessionsRaw);
        const restoredSessions = parsedSessions.map(session => ({
          ...session,
          state: {
            ...session.state,
            persons: session.state.persons.map(person => ({
              ...person,
              contracts: person.contracts.map(contract => ({
                ...contract,
                startDate: contract.startDate ? new Date(contract.startDate) : undefined,
                endDate: contract.endDate ? new Date(contract.endDate) : undefined,
              }))
            }))
          }
        }));
        setSessions(restoredSessions);
      }
    } catch (error) {
      console.error("Failed to load sessions from localStorage", error);
      setSessions([]);
    }
  }, []);

  const persistSessions = useCallback((updatedSessions: SavedSession[]) => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error("Failed to save sessions to localStorage", error);
    }
  }, []);

  const saveSession = useCallback((name: string, state: AppState) => {
    const newSession: SavedSession = {
      name,
      state,
      savedAt: new Date().toISOString(),
    };
    
    setSessions(prevSessions => {
        const otherSessions = prevSessions.filter(s => s.name !== name);
        const updatedSessions = [...otherSessions, newSession].sort((a, b) => a.name.localeCompare(b.name));
        persistSessions(updatedSessions);
        return updatedSessions;
    });

  }, [persistSessions]);

  const loadSession = useCallback((name: string): AppState | null => {
    const sessionToLoad = sessions.find(s => s.name === name);
    if (sessionToLoad) {
      const restoredState = {
        ...sessionToLoad.state,
        persons: sessionToLoad.state.persons.map(person => ({
          ...person,
          contracts: person.contracts.map(contract => ({
            ...contract,
            startDate: contract.startDate ? new Date(contract.startDate) : undefined,
            endDate: contract.endDate ? new Date(contract.endDate) : undefined,
          }))
        }))
      };

      if (name !== '__last_active__') {
        onLoad(restoredState);
      }
      return restoredState;
    }
    return null;
  }, [sessions, onLoad]);

  const deleteSession = useCallback((name: string) => {
    const updatedSessions = sessions.filter(s => s.name !== name);
    persistSessions(updatedSessions);
  }, [sessions, persistSessions]);

  const clearAllSessions = useCallback(() => {
    persistSessions([]);
  }, [persistSessions]);

  return { sessions, saveSession, loadSession, deleteSession, clearAllSessions };
}
