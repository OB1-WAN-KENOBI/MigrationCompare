// Реэкспорт типов из entities для обратной совместимости
export type {
  SafetyLevel,
  ImmigrationDifficulty,
  EnglishLevel,
  HealthcareLevel,
  ClimateType,
  BankingLevel,
  LocalizedName as CountryName,
  Country,
} from '@/entities/country/model/types';

import type { SafetyLevel, ClimateType, EnglishLevel } from '@/entities/country/model/types';

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

export type CompareMetricValue = number | string | boolean;
