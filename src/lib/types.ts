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
