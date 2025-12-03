import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { FilterState } from '@shared/types';
import { countActiveFilters } from '@shared/lib/utils/filterHelpers';

interface ActiveFiltersChipsProps {
  filters: FilterState;
  searchQuery: string;
  onRemoveFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSearchChange: (value: string) => void;
}

export const ActiveFiltersChips = memo(
  ({ filters, searchQuery, onRemoveFilter, onSearchChange }: ActiveFiltersChipsProps) => {
    const { t } = useTranslation();

    const activeCount = countActiveFilters(filters, searchQuery);

    if (activeCount === 0) {
      return null;
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('filters.activeFilters')} ({activeCount})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {searchQuery && (
            <Chip
              label={`${t('countries.search')}: "${searchQuery}"`}
              onDelete={() => {
                onSearchChange('');
              }}
              size="small"
              variant="outlined"
            />
          )}
          {filters.safety.map((value) => (
            <Chip
              key={`safety-${value}`}
              label={`${t('filters.safety')}: ${t(`values.safety.${value}`)}`}
              onDelete={() => {
                const newValues = filters.safety.filter((v) => v !== value);
                onRemoveFilter('safety', newValues as FilterState['safety']);
              }}
              size="small"
              variant="outlined"
            />
          ))}
          {filters.climate.map((value) => (
            <Chip
              key={`climate-${value}`}
              label={`${t('filters.climate')}: ${t(`values.climate.${value}`)}`}
              onDelete={() => {
                const newValues = filters.climate.filter((v) => v !== value);
                onRemoveFilter('climate', newValues as FilterState['climate']);
              }}
              size="small"
              variant="outlined"
            />
          ))}
          {filters.englishLevel.map((value) => (
            <Chip
              key={`english-${value}`}
              label={`${t('filters.englishLevel')}: ${t(`values.english.${value}`)}`}
              onDelete={() => {
                const newValues = filters.englishLevel.filter((v) => v !== value);
                onRemoveFilter('englishLevel', newValues as FilterState['englishLevel']);
              }}
              size="small"
              variant="outlined"
            />
          ))}
          {(filters.rentRange[0] !== 0 || filters.rentRange[1] !== 2000) && (
            <Chip
              label={`${t('filters.rent')}: $${filters.rentRange[0]} - $${filters.rentRange[1]}`}
              onDelete={() => {
                onRemoveFilter('rentRange', [0, 2000] as FilterState['rentRange']);
              }}
              size="small"
              variant="outlined"
            />
          )}
          {(filters.taxesRange[0] !== 0 || filters.taxesRange[1] !== 50) && (
            <Chip
              label={`${t('filters.taxes')}: ${filters.taxesRange[0]}% - ${filters.taxesRange[1]}%`}
              onDelete={() => {
                onRemoveFilter('taxesRange', [0, 50] as FilterState['taxesRange']);
              }}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
    );
  }
);

ActiveFiltersChips.displayName = 'ActiveFiltersChips';
