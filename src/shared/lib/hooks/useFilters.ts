import { useState, useCallback, useMemo, useDeferredValue, useTransition, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { Country, FilterState, SortState, SortField, SortDirection } from '@shared/types';
import { SAFETY_ORDER, IMMIGRATION_ORDER } from '@shared/config';
import { useDebounce } from './useDebounce';
import { serializeFiltersToUrl, parseFiltersFromUrl } from '@shared/lib/utils/urlFilters';

const initialFilters: FilterState = {
  safety: [],
  climate: [],
  visa: [],
  englishLevel: [],
  rentRange: [0, 2000],
  taxesRange: [0, 50],
};

const initialSort: SortState = {
  field: 'costOfLiving',
  direction: 'asc',
};

export const useFilters = (countries: Country[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Инициализация из URL или дефолтные значения
  const urlState = parseFiltersFromUrl(searchParams);
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    ...urlState.filters,
  });
  const [sort, setSort] = useState<SortState>({
    ...initialSort,
    ...urlState.sort,
  });
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery);
  const [isPending, startTransition] = useTransition();

  // Debounce search query для оптимизации
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  // Deferred value для поиска (React 18 оптимизация)
  const deferredSearchQuery = useDeferredValue(debouncedSearchQuery);

  // Синхронизация с URL при изменении фильтров
  useEffect(() => {
    const params = serializeFiltersToUrl(filters, sort, searchQuery);
    setSearchParams(params, { replace: true });
  }, [filters, sort, searchQuery, setSearchParams]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      startTransition(() => {
        setFilters((prev) => ({ ...prev, [key]: value }));
      });
    },
    [startTransition]
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
  }, []);

  const setSearchValue = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const setSortField = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const setSortDirection = useCallback((direction: SortDirection) => {
    setSort((prev) => ({ ...prev, direction }));
  }, []);

  const filteredAndSortedCountries = useMemo(() => {
    let result = [...countries];

    // Search filter (используем deferred значение для плавности)
    if (deferredSearchQuery) {
      const query = deferredSearchQuery.toLowerCase();
      result = result.filter(
        (country) =>
          country.name.ru.toLowerCase().includes(query) ||
          country.name.en.toLowerCase().includes(query)
      );
    }

    // Safety filter
    if (filters.safety.length > 0) {
      result = result.filter(
        (country) => country.safety !== null && filters.safety.includes(country.safety)
      );
    }

    // Climate filter
    if (filters.climate.length > 0) {
      result = result.filter(
        (country) => country.climate !== null && filters.climate.includes(country.climate)
      );
    }

    // English level filter
    if (filters.englishLevel.length > 0) {
      result = result.filter((country) => filters.englishLevel.includes(country.englishLevel));
    }

    // Rent range filter
    result = result.filter(
      (country) =>
        country.rent !== null &&
        country.rent >= filters.rentRange[0] &&
        country.rent <= filters.rentRange[1]
    );

    // Taxes range filter
    result = result.filter(
      (country) =>
        country.taxes !== null &&
        country.taxes >= filters.taxesRange[0] &&
        country.taxes <= filters.taxesRange[1]
    );

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'rent': {
          const aVal = a.rent ?? Infinity;
          const bVal = b.rent ?? Infinity;
          comparison = aVal - bVal;
          break;
        }
        case 'salary': {
          const aVal = a.salary ?? Infinity;
          const bVal = b.salary ?? Infinity;
          comparison = aVal - bVal;
          break;
        }
        case 'costOfLiving': {
          const aVal = a.costOfLiving ?? Infinity;
          const bVal = b.costOfLiving ?? Infinity;
          comparison = aVal - bVal;
          break;
        }
        case 'safety': {
          const aVal = a.safety ? (SAFETY_ORDER[a.safety] ?? 0) : -1;
          const bVal = b.safety ? (SAFETY_ORDER[b.safety] ?? 0) : -1;
          comparison = aVal - bVal;
          break;
        }
        case 'immigrationDifficulty':
          comparison =
            (IMMIGRATION_ORDER[a.immigrationDifficulty] ?? 0) -
            (IMMIGRATION_ORDER[b.immigrationDifficulty] ?? 0);
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [countries, filters, sort, deferredSearchQuery]);

  return {
    filters,
    sort,
    searchQuery,
    updateFilter,
    resetFilters,
    setSearchValue,
    setSortField,
    setSortDirection,
    filteredAndSortedCountries,
    isPending, // Для показа индикатора загрузки при необходимости
  };
};
