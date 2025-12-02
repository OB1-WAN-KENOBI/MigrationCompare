import { api } from './axios';
import type { Country } from '@shared/types';
import { API_ENDPOINTS } from '@shared/config';

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await api.get<Country[]>(API_ENDPOINTS.COUNTRIES);
  return data;
};

export const getCountryById = async (id: string): Promise<Country | undefined> => {
  const countries = await getCountries();
  return countries.find((country) => country.id === id);
};
