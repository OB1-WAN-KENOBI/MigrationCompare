import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { Country, CompareMetricValue } from '@shared/types';

interface ExportMetric {
  key: keyof Country;
  label: string;
  format?: (v: CompareMetricValue) => string;
}

// Стили для PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  tableColCountry: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    fontWeight: 'bold',
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
});

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

interface PDFDocumentProps {
  countries: Country[];
  metrics: ExportMetric[];
  language: 'en' | 'ru';
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ countries, metrics, language }) => {
  const date = new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Вычисляем ширину колонок (страна + метрики)
  const countryColWidth = '25%';
  const metricColWidth = `${75 / metrics.length}%`;

  return (
    <Document
      title="Countries Comparison"
      author="MigrationCompare"
      subject="Country comparison report"
      keywords="migration, countries, comparison"
    >
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.title}>Countries Comparison</Text>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: countryColWidth }]}>
              <Text style={styles.tableCellHeader}>Country</Text>
            </View>
            {metrics.map((metric) => (
              <View key={metric.key} style={[styles.tableColHeader, { width: metricColWidth }]}>
                <Text style={styles.tableCellHeader}>{metric.label}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {countries.map((country) => (
            <View key={country.id} style={styles.tableRow}>
              <View style={[styles.tableColCountry, { width: countryColWidth }]}>
                <Text style={styles.tableCell}>
                  {country.flag} {country.name[language]}
                </Text>
              </View>
              {metrics.map((metric) => {
                const value = country[metric.key] as CompareMetricValue;
                const formatted = formatValue(value, metric.format);
                return (
                  <View key={metric.key} style={[styles.tableCol, { width: metricColWidth }]}>
                    <Text style={styles.tableCell}>{formatted}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Generated on {date}</Text>
      </Page>
    </Document>
  );
};

/**
 * Экспортирует сравнение стран в PDF формат
 */
export const exportToPDF = async (
  countries: Country[],
  metrics: ExportMetric[],
  language: 'en' | 'ru' = 'en'
): Promise<void> => {
  if (countries.length === 0 || metrics.length === 0) {
    return;
  }

  const blob = await pdf(
    <PDFDocument countries={countries} metrics={metrics} language={language} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `countries-comparison-${new Date().toISOString().split('T')[0]}.pdf`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
