import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import { getColorClass } from '@shared/lib/utils/compare';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { MetaTags } from '@dr.pogodin/react-helmet';
import { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useCountries, useCompare, useNormalizedLanguage } from '@shared/lib';
import { PageTransition } from '@shared/ui';
import type { Country, CompareMetricValue } from '@shared/types';

interface CompareRow {
  id: string;
  metric: string;
  metricKey: string;
  [countryId: string]: CompareMetricValue;
}

const metrics: {
  key: keyof Country;
  labelKey: string;
  higherIsBetter: boolean;
  format?: (v: CompareMetricValue) => string;
}[] = [
  {
    key: 'costOfLiving',
    labelKey: 'country.costOfLiving',
    higherIsBetter: false,
    format: (v) => `$${v}`,
  },
  { key: 'rent', labelKey: 'country.rent', higherIsBetter: false, format: (v) => `$${v}` },
  {
    key: 'groceries',
    labelKey: 'country.groceries',
    higherIsBetter: false,
    format: (v) => `$${v}`,
  },
  { key: 'salary', labelKey: 'country.salary', higherIsBetter: true, format: (v) => `$${v}` },
  { key: 'safety', labelKey: 'country.safety', higherIsBetter: true },
  {
    key: 'internetSpeed',
    labelKey: 'country.internetSpeed',
    higherIsBetter: true,
    format: (v) => `${v} Mbps`,
  },
  { key: 'taxes', labelKey: 'country.taxes', higherIsBetter: false, format: (v) => `${v}%` },
  { key: 'englishLevel', labelKey: 'country.englishLevel', higherIsBetter: true },
  { key: 'healthcare', labelKey: 'country.healthcare', higherIsBetter: true },
  {
    key: 'immigrationDifficulty',
    labelKey: 'country.immigrationDifficulty',
    higherIsBetter: false,
  },
  { key: 'freelanceFriendly', labelKey: 'country.freelanceFriendly', higherIsBetter: true },
  { key: 'nomadVisa', labelKey: 'country.nomadVisa', higherIsBetter: true },
  {
    key: 'transport',
    labelKey: 'country.transport',
    higherIsBetter: false,
    format: (v) => `$${v}`,
  },
];

const ComparePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentLang = useNormalizedLanguage();
  const [isExporting, setIsExporting] = useState(false);

  const { data: allCountries = [], isLoading } = useCountries();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const countries = useMemo(() => {
    return allCountries.filter((c) => compareList.includes(c.id));
  }, [allCountries, compareList]);

  const rows: CompareRow[] = useMemo(() => {
    return metrics.map((metric) => {
      const row: CompareRow = {
        id: metric.key,
        metric: t(metric.labelKey),
        metricKey: metric.key,
      };

      countries.forEach((country) => {
        row[country.id] = country[metric.key] as CompareMetricValue;
      });

      return row;
    });
  }, [countries, t]);

  const columns: GridColDef<CompareRow>[] = useMemo(() => {
    const cols: GridColDef<CompareRow>[] = [
      {
        field: 'metric',
        headerName: '',
        width: 180,
        sortable: false,
        renderCell: (params: GridRenderCellParams<CompareRow>) => (
          <Typography variant="body2" fontWeight={500}>
            {params.value as string}
          </Typography>
        ),
      },
    ];

    countries.forEach((country) => {
      cols.push({
        field: country.id,
        headerName: `${country.flag} ${country.name[currentLang]}`,
        minWidth: 150,
        flex: 1,
        sortable: false,
        renderHeader: () => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {country.flag} {country.name[currentLang]}
            </Typography>
            <Tooltip title={t('compare.remove')}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(country.id);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
        renderCell: (params: GridRenderCellParams<CompareRow>) => {
          const metricKey = params.row.metricKey;
          const value = params.value as CompareMetricValue;
          const metricInfo = metrics.find((m) => m.key === metricKey);

          if (!metricInfo) return null;

          const allValues = countries.map(
            (c) => c[metricKey as keyof Country] as CompareMetricValue
          );
          const color = getColorClass(value, allValues, metricInfo.higherIsBetter);

          let displayValue: string;
          if (value === null || value === undefined) {
            displayValue = '—';
          } else if (typeof value === 'boolean') {
            displayValue = value ? t('values.yes') : t('values.no');
          } else if (typeof value === 'string') {
            const translationMap: Record<string, string> = {
              safety: 'values.safety',
              englishLevel: 'values.english',
              healthcare: 'values.healthcare',
              immigrationDifficulty: 'values.immigration',
              banking: 'values.banking',
            };
            const translationKey = translationMap[metricKey];
            displayValue = translationKey ? t(`${translationKey}.${value}`) : String(value);
          } else {
            displayValue = metricInfo.format ? metricInfo.format(value) : String(value);
          }

          return <Chip label={displayValue} color={color} size="small" sx={{ fontWeight: 500 }} />;
        },
      });
    });

    return cols;
  }, [countries, currentLang, removeFromCompare, t]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <MetaTags title={t('compare.title')} description={t('compare.emptyHint')} />
      <PageTransition>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Box>
              <Button startIcon={<ArrowBackIcon />} onClick={() => void navigate('/')}>
                {t('nav.home')}
              </Button>
            </Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              {t('compare.title')}
            </Typography>
            <Box>
              {countries.length > 0 && (
                <Button
                  startIcon={<ClearAllIcon />}
                  onClick={clearCompare}
                  color="error"
                  variant="outlined"
                >
                  Очистить
                </Button>
              )}
            </Box>
          </Box>

          {/* Empty State */}
          {countries.length === 0 && (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CompareArrowsIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
              <Typography variant="h5" color="text.secondary">
                {t('compare.empty')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('compare.emptyHint')}
              </Typography>
              <Button variant="contained" onClick={() => void navigate('/')} sx={{ mt: 2 }}>
                {t('nav.home')}
              </Button>
            </Paper>
          )}

          {/* Comparison Table */}
          {countries.length > 0 && (
            <>
              {/* Export Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  disabled={isExporting}
                  onClick={async () => {
                    setIsExporting(true);
                    try {
                      const { exportToPDF } = await import('@shared/lib/utils/exportPDF');
                      const exportMetrics = metrics.map((m) => ({
                        key: m.key,
                        label: t(m.labelKey),
                        format: m.format,
                      }));
                      await exportToPDF(countries, exportMetrics, currentLang);
                    } catch (error) {
                      console.error('Failed to export PDF:', error);
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                  aria-label={t('compare.exportPDF')}
                >
                  {isExporting ? t('compare.exporting') : t('compare.exportPDF')}
                </Button>
              </Box>
              {/* Legend */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={t('compare.better')} color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={t('compare.worse')} color="error" size="small" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={t('compare.average')} color="default" size="small" />
                </Box>
              </Box>

              <Paper sx={{ width: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  hideFooter
                  autoHeight
                  sx={{
                    '& .MuiDataGrid-cell': {
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      backgroundColor: 'background.paper',
                    },
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                      backgroundColor: 'action.hover',
                    },
                    '& .MuiDataGrid-cell:first-of-type': {
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      backgroundColor: 'background.paper',
                      borderRight: 1,
                      borderColor: 'divider',
                    },
                    '& .MuiDataGrid-columnHeader:first-of-type': {
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      backgroundColor: 'background.paper',
                      borderRight: 1,
                      borderColor: 'divider',
                    },
                  }}
                />
              </Paper>
            </>
          )}
        </Container>
      </PageTransition>
    </>
  );
};

export default ComparePage;
