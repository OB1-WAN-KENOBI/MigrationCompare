import type { SafetyLevel, HealthcareLevel } from '@/entities/country/model/types';

export interface ExternalCostOfLiving {
  id: string; // country code or slug
  costOfLiving?: number;
  rent?: number;
  groceries?: number;
  transport?: number;
  safety?: SafetyLevel;
  healthcare?: HealthcareLevel;
  internetSpeed?: number;
  salary?: number;
}

export async function fetchExternalCostOfLiving(): Promise<ExternalCostOfLiving[]> {
  // если нет API-ключей -> вернуть пустой массив
  // В будущем здесь можно добавить интеграцию с Numbeo/Teleport/Speedtest
  // const apiKey = import.meta.env.VITE_NUMBEO_API_KEY;
  // if (!apiKey) return [];
  // ... реализация запроса к внешнему API
  return [];
}
