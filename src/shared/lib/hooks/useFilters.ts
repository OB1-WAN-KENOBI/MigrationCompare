import { useState, useCallback, useMemo } from 'react';
import type {
  Country,
  FilterState,
  SortState,
  SortField,
  SortDirection,
  SafetyLevel,
  ClimateType,
  EnglishLevel,
} from '@shared/types';
import { SAFETY_ORDER, IMMIGRATION_ORDER } from '@shared/config';

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
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortState>(initialSort);
  const [searchQuery, setSearchQuery] = useState('');

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

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

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (country) =>
          country.name.ru.toLowerCase().includes(query) ||
          country.name.en.toLowerCase().includes(query)
      );
    }

    // Safety filter
    if (filters.safety.length > 0) {
      result = result.filter((country) => filters.safety.includes(country.safety as SafetyLevel));
    }

    // Climate filter
    if (filters.climate.length > 0) {
      result = result.filter((country) => filters.climate.includes(country.climate as ClimateType));
    }

    // English level filter
    if (filters.englishLevel.length > 0) {
      result = result.filter((country) =>
        filters.englishLevel.includes(country.englishLevel as EnglishLevel)
      );
    }

    // Rent range filter
    result = result.filter(
      (country) => country.rent >= filters.rentRange[0] && country.rent <= filters.rentRange[1]
    );

    // Taxes range filter
    result = result.filter(
      (country) => country.taxes >= filters.taxesRange[0] && country.taxes <= filters.taxesRange[1]
    );

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'rent':
          comparison = a.rent - b.rent;
          break;
        case 'salary':
          comparison = a.salary - b.salary;
          break;
        case 'costOfLiving':
          comparison = a.costOfLiving - b.costOfLiving;
          break;
        case 'safety':
          comparison = (SAFETY_ORDER[a.safety] ?? 0) - (SAFETY_ORDER[b.safety] ?? 0);
          break;
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
  }, [countries, filters, sort, searchQuery]);

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
  };
};
