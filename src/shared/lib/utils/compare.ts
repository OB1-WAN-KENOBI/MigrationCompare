import type { CompareMetricValue } from '@shared/types';

/**
 * Определяет цвет для ячейки в таблице сравнения
 * @param value - значение метрики
 * @param allValues - все значения для этой метрики
 * @param higherIsBetter - лучше ли большее значение
 * @returns цвет для отображения
 */
export const getColorClass = (
  value: CompareMetricValue,
  allValues: CompareMetricValue[],
  higherIsBetter: boolean
): 'success' | 'error' | 'default' => {
  // Обработка null/undefined
  if (value === null || value === undefined) {
    return 'default';
  }

  if (typeof value === 'boolean') {
    return value ? 'success' : 'error';
  }

  if (typeof value === 'string') {
    const levelMap: Record<string, number> = {
      high: 3,
      good: 3,
      advanced: 3,
      strong: 3,
      medium: 2,
      easy: 3,
      low: 1,
      basic: 1,
      weak: 1,
      hard: 1,
    };
    const numericValues = allValues
      .filter((v): v is string => v !== null && v !== undefined && typeof v === 'string')
      .map((v) => levelMap[v] ?? 2);
    if (numericValues.length === 0) return 'default';
    const numericValue = levelMap[value] ?? 2;
    const max = Math.max(...numericValues);
    const min = Math.min(...numericValues);

    if (numericValue === max && max !== min) {
      return higherIsBetter ? 'success' : 'error';
    }
    if (numericValue === min && max !== min) {
      return higherIsBetter ? 'error' : 'success';
    }
    return 'default';
  }

  if (typeof value === 'number') {
    const numericValues = allValues.filter(
      (v): v is number => v !== null && v !== undefined && typeof v === 'number'
    );
    if (numericValues.length === 0) return 'default';
    const max = Math.max(...numericValues);
    const min = Math.min(...numericValues);

    if (value === max && max !== min) {
      return higherIsBetter ? 'success' : 'error';
    }
    if (value === min && max !== min) {
      return higherIsBetter ? 'error' : 'success';
    }
  }

  return 'default';
};
