import { memo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeIcon from '@mui/icons-material/Home';
import { MetricChip } from '@shared/ui';
import { searchCountryPhotos } from '@/shared/api/countries/pexels';
import { QUERY_KEYS } from '@shared/config';
import { useNormalizedLanguage } from '@shared/lib';
import type { Country } from '@shared/types';

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
  isInCompare: boolean;
  canAddToCompare: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export const CountryCard = memo(
  ({
    country,
    isFavorite,
    isInCompare,
    canAddToCompare,
    onToggleFavorite,
    onToggleCompare,
  }: CountryCardProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const currentLang = useNormalizedLanguage();

    const handleViewDetails = () => {
      void navigate(`/country/${country.id}`);
    };

    const handlePrefetchPhotos = () => {
      void queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.COUNTRY, 'photos', country.name.en],
        queryFn: () => searchCountryPhotos(country.name.en, 5),
        staleTime: 1000 * 60 * 60 * 24, // 24 часа
      });
    };

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
        onMouseEnter={handlePrefetchPhotos}
      >
        {
          <Box
            sx={{
              height: 120,
              background:
                'linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h1" component="span">
              {country.flag}
            </Typography>
          </Box>
        }
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h4" component="span">
              {country.flag}
            </Typography>
            <Typography variant="h6" component="h3" fontWeight={600}>
              {country.name[currentLang]}
            </Typography>
          </Box>
          <Tooltip
            title={isFavorite ? t('countries.removeFromFavorites') : t('countries.addToFavorites')}
          >
            <IconButton
              onClick={() => onToggleFavorite(country.id)}
              color={isFavorite ? 'error' : 'default'}
              size="small"
              aria-label={
                isFavorite ? t('countries.removeFromFavorites') : t('countries.addToFavorites')
              }
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="text.secondary">
                {t('country.costOfLiving')}:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {country.costOfLiving !== null
                  ? `$${country.costOfLiving}/${t('country.perMonth')}`
                  : '—'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HomeIcon fontSize="small" color="primary" />
              <Typography variant="body2" color="text.secondary">
                {t('country.rent')}:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {country.rent !== null ? `$${country.rent}/${t('country.perMonth')}` : '—'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('country.visa')}:
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap>
                {country.visa}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {country.safety !== null && (
              <MetricChip type="safety" value={country.safety} showLabel />
            )}
            <MetricChip type="english" value={country.englishLevel} showLabel />
            <MetricChip type="immigration" value={country.immigrationDifficulty} showLabel />
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button variant="outlined" size="small" fullWidth onClick={handleViewDetails}>
            {t('countries.viewDetails')}
          </Button>
          <Tooltip
            title={
              isInCompare
                ? t('countries.removeFromCompare')
                : canAddToCompare
                  ? t('countries.addToCompare')
                  : t('countries.maxCompareReached', { count: 5 })
            }
          >
            <span>
              <IconButton
                onClick={() => onToggleCompare(country.id)}
                color={isInCompare ? 'primary' : 'default'}
                disabled={!isInCompare && !canAddToCompare}
                aria-label={
                  isInCompare
                    ? t('countries.removeFromCompare')
                    : canAddToCompare
                      ? t('countries.addToCompare')
                      : t('countries.maxCompareReached', { count: 5 })
                }
              >
                <CompareArrowsIcon />
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>
      </Card>
    );
  }
);

CountryCard.displayName = 'CountryCard';
