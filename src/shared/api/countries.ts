import type { Country } from '@/entities/country/model/types';
import { fetchRestCountries } from './countries/restCountries';
import { fetchExternalCostOfLiving } from './countries/externalSources';
import { buildCountry, normalizeCountryId } from '@/entities/country/model/aggregator';
import { manualCountriesData } from '@shared/config/countries';

export const getCountries = async (): Promise<Country[]> => {
  const [apiCountries, externalCost] = await Promise.all([
    fetchRestCountries(),
    fetchExternalCostOfLiving(),
  ]);

  const externalById = new Map(externalCost.map((e) => [e.id, e]));

  return apiCountries
    .map((apiCountry) => {
      const id = normalizeCountryId(apiCountry);
      const external = externalById.get(id) ?? null;
      return buildCountry(apiCountry, external);
    })
    .filter((c) => manualCountriesData[c.id]); // пока ограничиться списком вручную поддерживаемых стран
};

export const getCountryById = async (id: string): Promise<Country | undefined> => {
  try {
    const countries = await getCountries();
    return countries.find((country) => country.id === id);
  } catch (error) {
    return undefined;
  }
};
