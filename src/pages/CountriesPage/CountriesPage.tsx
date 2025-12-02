import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import WorkIcon from '@mui/icons-material/Work';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { CountryCard } from '@entities/CountryCard';
import { SearchCountries } from '@features/SearchCountries';
import { Sidebar } from '@widgets/Sidebar';
import { CountryFilterPanel } from '@widgets/CountryFilterPanel';
import { CountrySkeleton, PageTransition } from '@shared/ui';
import { useCountries, useCompare, useFavorites, useFilters } from '@shared/lib';
import type { SortField } from '@shared/types';

const sortOptions: { key: SortField; labelKey: string; icon: React.ReactNode }[] = [
  {
    key: 'costOfLiving',
    labelKey: 'sort.costOfLiving',
    icon: <AttachMoneyIcon fontSize="small" />,
  },
  { key: 'rent', labelKey: 'sort.rent', icon: <HomeIcon fontSize="small" /> },
  { key: 'safety', labelKey: 'sort.safety', icon: <SecurityIcon fontSize="small" /> },
  { key: 'salary', labelKey: 'sort.salary', icon: <WorkIcon fontSize="small" /> },
  {
    key: 'immigrationDifficulty',
    labelKey: 'sort.immigrationDifficulty',
    icon: <FlightTakeoffIcon fontSize="small" />,
  },
];

const CountriesPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data: countries = [], isLoading } = useCountries();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();

  const {
    filters,
    sort,
    searchQuery,
    updateFilter,
    resetFilters,
    setSearchValue,
    setSortField,
    filteredAndSortedCountries,
  } = useFilters(countries);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <PageTransition>
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
          <CountryFilterPanel
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
          />
        </Sidebar>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Container maxWidth="xl" disableGutters>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                {t('countries.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('app.subtitle')}
              </Typography>
            </Box>

            {/* Search and Controls */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3,
                alignItems: { sm: 'center' },
              }}
            >
              {isMobile && (
                <Button variant="outlined" startIcon={<FilterListIcon />} onClick={toggleSidebar}>
                  {t('filters.title')}
                </Button>
              )}

              <Box sx={{ flexGrow: 1, maxWidth: { sm: 400 } }}>
                <SearchCountries value={searchQuery} onChange={setSearchValue} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  {t('sort.title')}:
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                  {sortOptions.map((option) => (
                    <Tooltip key={option.key} title={t(option.labelKey)}>
                      <Button
                        onClick={() => setSortField(option.key)}
                        variant={sort.field === option.key ? 'contained' : 'outlined'}
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        {option.icon}
                        {sort.field === option.key &&
                          (sort.direction === 'asc' ? (
                            <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
                          ))}
                      </Button>
                    </Tooltip>
                  ))}
                </ButtonGroup>
              </Box>
            </Box>

            {/* Results count */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('countries.count', { count: filteredAndSortedCountries.length })}
            </Typography>

            {/* Countries Grid */}
            <Grid container spacing={3}>
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                      <CountrySkeleton />
                    </Grid>
                  ))
                : filteredAndSortedCountries.map((country) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.id}>
                      <CountryCard
                        country={country}
                        isFavorite={isFavorite(country.id)}
                        isInCompare={isInCompare(country.id)}
                        canAddToCompare={canAddMore}
                        onToggleFavorite={toggleFavorite}
                        onToggleCompare={toggleCompare}
                      />
                    </Grid>
                  ))}
            </Grid>

            {/* No results */}
            {!isLoading && filteredAndSortedCountries.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t('countries.noResults')}
                </Typography>
                <Button onClick={resetFilters} sx={{ mt: 2 }}>
                  {t('filters.reset')}
                </Button>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default CountriesPage;
