import { useQuery } from '@tanstack/react-query';
import { getCountries, getCountryById } from '@shared/api';
import { QUERY_KEYS } from '@shared/config';
import type { Country } from '@shared/types';

export const useCountries = () => {
  return useQuery<Country[], Error>({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: getCountries,
  });
};

export const useCountry = (id: string) => {
  return useQuery<Country | undefined, Error>({
    queryKey: [QUERY_KEYS.COUNTRY, id],
    queryFn: () => getCountryById(id),
    enabled: Boolean(id),
  });
};
