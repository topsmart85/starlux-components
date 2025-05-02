// types/index.ts

export interface TripType {
    id: string;
    name: string;
  }
  
  export interface PassengerType {
    type: string;
    label: string;
    count: number;
    description: string;
  }
  
  export interface Airport {
    code: string;
    name: string;
    fullName: string;
    region: string;
  }