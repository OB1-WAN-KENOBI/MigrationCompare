import axios from 'axios';
import { logError } from '@shared/lib/utils/logger';
import { RestCountryResponseSchema } from '@/entities/country/model/schema';

export interface RestCountryResponse {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flags: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  flag?: string; // emoji flag
  population: number;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  cca2?: string; // ISO 3166-1 alpha-2
  cca3?: string; // ISO 3166-1 alpha-3
}

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

export async function fetchRestCountries(): Promise<RestCountryResponse[]> {
  try {
    const response = await axios.get<RestCountryResponse[]>(
      `${REST_COUNTRIES_API}/all?fields=name,flags,flag,population,currencies,languages,cca2,cca3`
    );

    // Валидация каждого элемента массива
    const validatedData: RestCountryResponse[] = [];
    for (const item of response.data) {
      const validation = RestCountryResponseSchema.safeParse(item);
      if (validation.success) {
        validatedData.push(validation.data as RestCountryResponse);
      } else {
        logError(validation.error, 'Invalid country data from API');
      }
    }

    return validatedData;
  } catch (error) {
    logError(error, 'REST Countries API');
    return [];
  }
}
