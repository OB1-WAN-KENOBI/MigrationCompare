export type SafetyLevel = 'low' | 'medium' | 'high';
export type ImmigrationDifficulty = 'easy' | 'medium' | 'hard';
export type EnglishLevel = 'low' | 'medium' | 'high';
export type HealthcareLevel = 'basic' | 'medium' | 'good';
export type ClimateType =
  | 'continental'
  | 'tropical'
  | 'mediterranean'
  | 'moderate'
  | 'diverse'
  | 'dry';

export interface CountryName {
  ru: string;
  en: string;
}

export interface Country {
  id: string;
  name: CountryName;
  flag: string;
  image?: string;
  population: number;
  language: string;
  currency: string;
  visa: string;
  costOfLiving: number;
  safety: SafetyLevel;
  internetSpeed: number;
  climate: ClimateType;
  salary: number;
  rent: number;
  groceries: number;
  immigrationDifficulty: ImmigrationDifficulty;
  taxes: number;
  freelanceFriendly: boolean;
  englishLevel: EnglishLevel;
  healthcare: HealthcareLevel;
  transport: number;
  nomadVisa: boolean;
  banking: string;
  russianCommunity: boolean;
}

export interface FilterState {
  safety: SafetyLevel[];
  climate: ClimateType[];
  visa: string[];
  englishLevel: EnglishLevel[];
  rentRange: [number, number];
  taxesRange: [number, number];
}

export type SortField = 'rent' | 'safety' | 'immigrationDifficulty' | 'salary' | 'costOfLiving';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}
