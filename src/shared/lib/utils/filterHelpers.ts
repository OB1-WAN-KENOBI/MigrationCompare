import type { FilterState } from '@shared/types';

/**
 * Подсчитывает количество активных фильтров
 */
export const countActiveFilters = (filters: FilterState, searchQuery: string): number => {
  let count = 0;

  if (searchQuery) count++;
  if (filters.safety.length > 0) count += filters.safety.length;
  if (filters.climate.length > 0) count += filters.climate.length;
  if (filters.visa.length > 0) count += filters.visa.length;
  if (filters.englishLevel.length > 0) count += filters.englishLevel.length;
  if (filters.rentRange[0] !== 0 || filters.rentRange[1] !== 2000) count++;
  if (filters.taxesRange[0] !== 0 || filters.taxesRange[1] !== 50) count++;

  return count;
};

/**
 * Проверяет, есть ли активные фильтры
 */
export const hasActiveFilters = (filters: FilterState, searchQuery: string): boolean => {
  return countActiveFilters(filters, searchQuery) > 0;
};
