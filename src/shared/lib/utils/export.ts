import type { Country, CompareMetricValue } from '@shared/types';

interface ExportMetric {
  key: keyof Country;
  label: string;
  format?: (v: CompareMetricValue) => string;
}

/**
 * Экранирует значение для CSV (обрабатывает кавычки и переносы строк)
 */
const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

/**
 * Форматирует значение метрики для экспорта
 */
const formatValue = (
  value: CompareMetricValue,
  format?: (v: CompareMetricValue) => string
): string => {
  if (value === null || value === undefined) {
    return '—';
  }

  if (format) {
    return format(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'string') {
    // Переводим enum значения в читаемый формат
    const enumMap: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      easy: 'Easy',
      hard: 'Hard',
      basic: 'Basic',
      advanced: 'Advanced',
      weak: 'Weak',
      strong: 'Strong',
    };
    return enumMap[value] ?? value;
  }

  return String(value);
};

/**
 * Экспортирует сравнение стран в CSV формат
 * Формат: страны в строках, метрики в колонках (стандартный формат для сравнения)
 * @param countries - массив стран для сравнения
 * @param metrics - массив метрик с переведенными названиями и форматированием
 * @param language - язык для названий стран ('en' | 'ru')
 */
export const exportToCSV = (
  countries: Country[],
  metrics: ExportMetric[],
  language: 'en' | 'ru' = 'en'
): void => {
  if (countries.length === 0 || metrics.length === 0) {
    return;
  }

  // Заголовки: Country, затем все метрики
  const headers = ['Country', ...metrics.map((m) => m.label)];

  // Строки данных: каждая строка = одна страна
  const rows: string[][] = [headers];

  countries.forEach((country) => {
    const row = [`${country.flag} ${country.name[language]}`];
    metrics.forEach((metric) => {
      const value = country[metric.key] as CompareMetricValue;
      const formatted = formatValue(value, metric.format);
      row.push(formatted);
    });
    rows.push(row);
  });

  // Формируем CSV контент
  const csvContent = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');

  // Добавляем BOM для правильного отображения кириллицы в Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  // Создаем и скачиваем файл
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `countries-comparison-${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
