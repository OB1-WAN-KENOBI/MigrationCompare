import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CountryCard } from '@entities/country/ui';
import { useCountries, useFavorites, useCompare } from '@shared/lib';
import { CountrySkeleton, PageTransition } from '@shared/ui';

export const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: countries, isLoading } = useCountries();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { isInCompare, toggleCompare, canAddMore } = useCompare();

  const favoriteCountries = useMemo(() => {
    if (!countries) return [];
    return countries.filter((country) => favorites.includes(country.id));
  }, [countries, favorites]);

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => void navigate('/')} color="inherit">
            {t('nav.home')}
          </Button>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {t('nav.favorites')}
          </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <CountrySkeleton />
              </Grid>
            ))}
          </Grid>
        ) : favoriteCountries.length === 0 ? (
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
            <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
            <Typography variant="h5" color="text.secondary">
              {t('favorites.empty')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('favorites.emptyHint')}
            </Typography>
            <Button variant="contained" onClick={() => void navigate('/')} sx={{ mt: 2 }}>
              {t('favorites.browseCountries')}
            </Button>
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('countries.count', { count: favoriteCountries.length })}
            </Typography>
            <Grid container spacing={3}>
              {favoriteCountries.map((country) => (
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
          </>
        )}
      </Container>
    </PageTransition>
  );
};
