import { useQuery } from '@tanstack/react-query';
import { searchCountryPhotos } from '@/shared/api/countries/pexels';
import { QUERY_KEYS } from '@shared/config';

export const useCountryPhotos = (countryName: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUNTRY, 'photos', countryName],
    queryFn: () => searchCountryPhotos(countryName, 5),
    enabled: enabled && Boolean(countryName),
    staleTime: 1000 * 60 * 60 * 24, // 24 часа - фотографии не меняются часто
  });
};
