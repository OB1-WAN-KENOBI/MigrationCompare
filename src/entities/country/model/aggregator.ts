import type { Country } from './types';
import { manualCountriesData } from '@/shared/config/countries/manualData';
import type { ExternalCostOfLiving } from '@/shared/api/countries/externalSources';
import type { RestCountryResponse } from '@/shared/api/countries/restCountries';
import { CountrySchema, RestCountryResponseSchema, ExternalCostOfLivingSchema } from './schema';
import { logError } from '@shared/lib/utils/logger';

type CountryIdMap = {
  readonly [key: string]: string;
};

const COUNTRY_ID_MAP = {
  arm: 'armenia',
  srb: 'serbia',
  phl: 'philippines',
  vnm: 'vietnam',
  alb: 'albania',
  geo: 'georgia',
  mex: 'mexico',
  prt: 'portugal',
  tha: 'thailand',
  tur: 'turkiye',
  mne: 'montenegro',
  idn: 'indonesia',
  esp: 'spain',
  mys: 'malaysia',
  are: 'uae',
  cyp: 'cyprus',
} as const satisfies CountryIdMap;

export function normalizeCountryId(apiData: RestCountryResponse): string {
  // Используем cca3 (ISO 3166-1 alpha-3) как основу, приводим к lowercase
  // Если cca3 нет, используем cca2
  const code = (apiData.cca3 ?? apiData.cca2 ?? '').toLowerCase();

  // Маппинг специальных случаев для соответствия существующим ID
  const idMap = COUNTRY_ID_MAP;

  return code in idMap ? idMap[code as keyof typeof idMap] : code;
}

function apiNameEn(apiData: RestCountryResponse): string {
  return apiData.name.common ?? '';
}

function apiFlag(apiData: RestCountryResponse): string {
  // Предпочитаем emoji флаг, если есть, иначе используем SVG URL
  if (apiData.flag) {
    return apiData.flag;
  }
  // Можно также использовать emoji из флага, но для простоты используем URL
  return apiData.flags?.svg ?? apiData.flags?.png ?? '';
}

function apiPopulation(apiData: RestCountryResponse): number | null {
  return apiData.population ?? null;
}

function apiCurrency(apiData: RestCountryResponse): string {
  if (!apiData.currencies) {
    return '';
  }
  // Берем первый ключ валюты
  const currencyCode = Object.keys(apiData.currencies)[0];
  return currencyCode || '';
}

function apiLanguage(apiData: RestCountryResponse): string {
  if (!apiData.languages) {
    return '';
  }
  // Конкатенируем все языки через запятую
  return Object.values(apiData.languages).join(', ');
}

export function buildCountry(
  apiData: RestCountryResponse,
  external?: ExternalCostOfLiving | null
): Country {
  // Валидация API данных с помощью Zod
  const apiValidation = RestCountryResponseSchema.safeParse(apiData);
  if (!apiValidation.success) {
    logError(apiValidation.error, 'Invalid RestCountryResponse data');
    // Продолжаем с исходными данными, но логируем ошибку
  }

  // Валидация external данных, если они есть
  if (external) {
    const externalValidation = ExternalCostOfLivingSchema.safeParse(external);
    if (!externalValidation.success) {
      logError(externalValidation.error, 'Invalid ExternalCostOfLiving data');
    }
  }

  const id = normalizeCountryId(apiData);
  const manual = manualCountriesData[id] ?? {};

  // Валидация обязательных полей
  const nameEn = apiNameEn(apiData);
  const flagValue = manual.flag ?? apiFlag(apiData);

  if (!nameEn) {
    logError(new Error(`Country name is missing for country with id: ${id}`), 'buildCountry');
  }
  if (!flagValue) {
    logError(new Error(`Country flag is missing for country with id: ${id}`), 'buildCountry');
  }

  // Базовые поля из API
  const base: Country = {
    id,
    name: {
      en: nameEn || id,
      ru: manual.name?.ru ?? (nameEn || id),
    },
    flag: flagValue || '🏳️',
    population: apiPopulation(apiData),

    language: manual.language ?? apiLanguage(apiData),
    currency: manual.currency ?? apiCurrency(apiData),
    visa: manual.visa ?? '',

    costOfLiving: external?.costOfLiving ?? manual.costOfLiving ?? null,
    safety: external?.safety ?? manual.safety ?? null,
    internetSpeed: external?.internetSpeed ?? manual.internetSpeed ?? null,
    climate: manual.climate ?? null,

    salary: external?.salary ?? manual.salary ?? null,
    rent: external?.rent ?? manual.rent ?? null,
    groceries: external?.groceries ?? manual.groceries ?? null,

    immigrationDifficulty: manual.immigrationDifficulty ?? 'medium',
    taxes: manual.taxes ?? null,
    freelanceFriendly: manual.freelanceFriendly ?? false,
    englishLevel: manual.englishLevel ?? 'medium',
    healthcare: external?.healthcare ?? manual.healthcare ?? 'medium',
    transport: external?.transport ?? manual.transport ?? null,
    nomadVisa: manual.nomadVisa ?? false,
    banking: manual.banking ?? 'medium',
    russianCommunity: manual.russianCommunity ?? false,
  };

  // Финальная валидация результата
  const validation = CountrySchema.safeParse(base);
  if (!validation.success) {
    logError(validation.error, `Invalid Country data for ${id}`);
    // Возвращаем данные даже при ошибке валидации, но логируем
  }

  return base;
}
