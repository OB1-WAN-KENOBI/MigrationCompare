import { useQuery } from '@tanstack/react-query';
import { getCountries, getCountryById } from '@shared/api';
import { QUERY_KEYS } from '@shared/config';
import type { Country } from '@/entities/country/model/types';

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: [QUERY_KEYS.COUNTRIES],
    queryFn: getCountries,
  });
};

export const useCountry = (id: string) => {
  return useQuery<Country | undefined>({
    queryKey: [QUERY_KEYS.COUNTRY, id],
    queryFn: () => getCountryById(id),
    enabled: Boolean(id),
  });
};
