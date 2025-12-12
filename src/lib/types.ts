export interface Contract {
  id: string;
  startDate?: Date;
  endDate?: Date;
}

export interface Person {
  id: string;
  fullName: string;
  contracts: Contract[];
}

export interface Period {
  id: string;
  startDate?: Date;
  endDate?: Date;
  contracts: Contract[];
  totalDaysUsed: number;
  remainingDays: number;
  canExtendUntil?: string | null;
  resetDate?: string | null;
}

export interface AppState {
  persons: Person[];
  limitInDays: number;
}

export interface SavedSession {
  name: string;
  state: AppState;
  savedAt: string;
}
