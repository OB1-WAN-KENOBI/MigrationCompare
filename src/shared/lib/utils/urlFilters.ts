import type { FilterState, SortState } from '@shared/types';

/**
 * Сериализует состояние фильтров в URL search params
 */
export const serializeFiltersToUrl = (
  filters: FilterState,
  sort: SortState,
  searchQuery: string
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.safety.length > 0) {
    params.set('safety', filters.safety.join(','));
  }
  if (filters.climate.length > 0) {
    params.set('climate', filters.climate.join(','));
  }
  if (filters.visa.length > 0) {
    params.set('visa', filters.visa.join(','));
  }
  if (filters.englishLevel.length > 0) {
    params.set('englishLevel', filters.englishLevel.join(','));
  }
  if (filters.rentRange[0] !== 0 || filters.rentRange[1] !== 2000) {
    params.set('rentMin', filters.rentRange[0].toString());
    params.set('rentMax', filters.rentRange[1].toString());
  }
  if (filters.taxesRange[0] !== 0 || filters.taxesRange[1] !== 50) {
    params.set('taxesMin', filters.taxesRange[0].toString());
    params.set('taxesMax', filters.taxesRange[1].toString());
  }
  if (sort.field !== 'costOfLiving' || sort.direction !== 'asc') {
    params.set('sortField', sort.field);
    params.set('sortDirection', sort.direction);
  }
  if (searchQuery) {
    params.set('search', searchQuery);
  }

  return params;
};

/**
 * Парсит URL search params в состояние фильтров
 */
export const parseFiltersFromUrl = (
  searchParams: URLSearchParams
): {
  filters: Partial<FilterState>;
  sort: Partial<SortState>;
  searchQuery: string;
} => {
  const filters: Partial<FilterState> = {};
  const sort: Partial<SortState> = {};

  const safety = searchParams.get('safety');
  if (safety) {
    filters.safety = safety.split(',') as FilterState['safety'];
  }

  const climate = searchParams.get('climate');
  if (climate) {
    filters.climate = climate.split(',') as FilterState['climate'];
  }

  const visa = searchParams.get('visa');
  if (visa) {
    filters.visa = visa.split(',');
  }

  const englishLevel = searchParams.get('englishLevel');
  if (englishLevel) {
    filters.englishLevel = englishLevel.split(',') as FilterState['englishLevel'];
  }

  const rentMin = searchParams.get('rentMin');
  const rentMax = searchParams.get('rentMax');
  if (rentMin || rentMax) {
    filters.rentRange = [
      rentMin ? Number.parseInt(rentMin, 10) : 0,
      rentMax ? Number.parseInt(rentMax, 10) : 2000,
    ] as [number, number];
  }

  const taxesMin = searchParams.get('taxesMin');
  const taxesMax = searchParams.get('taxesMax');
  if (taxesMin || taxesMax) {
    filters.taxesRange = [
      taxesMin ? Number.parseInt(taxesMin, 10) : 0,
      taxesMax ? Number.parseInt(taxesMax, 10) : 50,
    ] as [number, number];
  }

  const sortField = searchParams.get('sortField');
  if (sortField) {
    sort.field = sortField as SortState['field'];
  }

  const sortDirection = searchParams.get('sortDirection');
  if (sortDirection) {
    sort.direction = sortDirection as SortState['direction'];
  }

  const searchQuery = searchParams.get('search') || '';

  return { filters, sort, searchQuery };
};
