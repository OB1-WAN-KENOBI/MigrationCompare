import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import type { FilterState, SafetyLevel, ClimateType, EnglishLevel } from '@shared/types';
import { ActiveFiltersChips } from './ActiveFiltersChips';
import { countActiveFilters } from '@shared/lib/utils/filterHelpers';

interface CountryFilterPanelProps {
  filters: FilterState;
  searchQuery: string;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
}

const safetyOptions: SafetyLevel[] = ['low', 'medium', 'high'];
const climateOptions: ClimateType[] = [
  'continental',
  'tropical',
  'subtropical',
  'oceanic',
  'arid',
  'polar',
];
const englishOptions: EnglishLevel[] = ['low', 'medium', 'high'];

export const CountryFilterPanel = memo(
  ({ filters, searchQuery, onFilterChange, onReset, onSearchChange }: CountryFilterPanelProps) => {
    const { t } = useTranslation();
    const activeCount = countActiveFilters(filters, searchQuery);

    const handleCheckboxChange = <K extends keyof FilterState>(
      key: K,
      value: string,
      checked: boolean
    ) => {
      const currentValues = filters[key] as string[];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      onFilterChange(key, newValues as FilterState[K]);
    };

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Badge badgeContent={activeCount} color="primary">
            <Typography variant="h6" fontWeight={600}>
              {t('filters.title')}
            </Typography>
          </Badge>
          <Button size="small" startIcon={<FilterAltOffIcon />} onClick={onReset} color="inherit">
            {t('filters.reset')}
          </Button>
        </Box>

        {/* Active Filters Chips */}
        <ActiveFiltersChips
          filters={filters}
          searchQuery={searchQuery}
          onRemoveFilter={onFilterChange}
          onSearchChange={onSearchChange}
        />

        {/* Safety Filter */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>{t('filters.safety')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {safetyOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.safety.includes(option)}
                      onChange={(e) => handleCheckboxChange('safety', option, e.target.checked)}
                    />
                  }
                  label={t(`values.safety.${option}`)}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Climate Filter */}
        <Accordion defaultExpanded disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>{t('filters.climate')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {climateOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.climate.includes(option)}
                      onChange={(e) => handleCheckboxChange('climate', option, e.target.checked)}
                    />
                  }
                  label={t(`values.climate.${option}`)}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* English Level Filter */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>{t('filters.englishLevel')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {englishOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      checked={filters.englishLevel.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange('englishLevel', option, e.target.checked)
                      }
                    />
                  }
                  label={t(`values.english.${option}`)}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Rent Range Filter */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>{t('filters.rent')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Slider
                value={filters.rentRange}
                onChange={(_, newValue) =>
                  onFilterChange('rentRange', newValue as [number, number])
                }
                valueLabelDisplay="auto"
                min={0}
                max={2000}
                step={50}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 1000, label: '$1000' },
                  { value: 2000, label: '$2000' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Taxes Range Filter */}
        <Accordion disableGutters elevation={0} sx={{ bgcolor: 'transparent' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={500}>{t('filters.taxes')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1 }}>
              <Slider
                value={filters.taxesRange}
                onChange={(_, newValue) =>
                  onFilterChange('taxesRange', newValue as [number, number])
                }
                valueLabelDisplay="auto"
                min={0}
                max={50}
                step={5}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 25, label: '25%' },
                  { value: 50, label: '50%' },
                ]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
);

CountryFilterPanel.displayName = 'CountryFilterPanel';
