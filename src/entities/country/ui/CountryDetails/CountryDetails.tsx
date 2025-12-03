import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityIcon from '@mui/icons-material/Security';
import WifiIcon from '@mui/icons-material/Wifi';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Skeleton from '@mui/material/Skeleton';
import { MetricChip } from '@shared/ui';
import { useCountryPhotos, useNormalizedLanguage, useKeyboardShortcuts } from '@shared/lib';
import type { Country } from '@shared/types';

interface CountryDetailsProps {
  country: Country;
}

interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const MetricRow = ({ icon, label, value }: MetricRowProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      py: 1.5,
      px: 2,
      '&:hover': {
        bgcolor: 'action.hover',
        borderRadius: 1,
      },
    }}
  >
    <Box sx={{ color: 'primary.main', mr: 2, display: 'flex' }}>{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180 }}>
      {label}
    </Typography>
    <Box sx={{ ml: 'auto' }}>{value}</Box>
  </Box>
);

export const CountryDetails = ({ country }: CountryDetailsProps) => {
  const { t } = useTranslation();
  const currentLang = useNormalizedLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { data: photos = [], isLoading: photosLoading } = useCountryPhotos(country.name.en, true);

  // Keyboard shortcut для закрытия модалки
  useKeyboardShortcuts(
    [
      {
        key: 'Escape',
        handler: () => {
          if (selectedPhoto) {
            setSelectedPhoto(null);
          }
        },
      },
    ],
    Boolean(selectedPhoto)
  );

  const formatNumber = (num: number | null) => {
    if (num === null) return '—';
    return new Intl.NumberFormat(currentLang === 'ru' ? 'ru-RU' : 'en-US').format(num);
  };

  return (
    <Box>
      {/* Header with Photos */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        {/* Main Photo */}
        {photos.length > 0 && photos[0] && (
          <Box
            sx={{
              height: 300,
              backgroundImage: `url(${photos[0].src.large})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              },
            }}
            onClick={() => setSelectedPhoto(photos[0]?.src.large2x || null)}
          />
        )}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h2" component="span">
              {country.flag}
            </Typography>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700}>
                {country.name[currentLang]}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {country.currency} • {country.language}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {country.safety !== null && <MetricChip type="safety" value={country.safety} />}
            <MetricChip type="english" value={country.englishLevel} />
            <MetricChip type="immigration" value={country.immigrationDifficulty} />
            <MetricChip type="healthcare" value={country.healthcare} />
            {country.freelanceFriendly && (
              <Chip label={t('country.freelanceFriendly')} color="primary" size="small" />
            )}
            {country.nomadVisa && (
              <Chip label={t('country.nomadVisa')} color="secondary" size="small" />
            )}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* General Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ px: 2, py: 1 }}>
              {t('country.visa')}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <MetricRow
              icon={<PublicIcon />}
              label={t('country.visa')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.visa}
                </Typography>
              }
            />
            <MetricRow
              icon={<PeopleIcon />}
              label={t('country.population')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.population !== null ? formatNumber(country.population) : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<LanguageIcon />}
              label={t('country.language')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.language}
                </Typography>
              }
            />
            <MetricRow
              icon={<ThermostatIcon />}
              label={t('country.climate')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.climate !== null ? t(`values.climate.${country.climate}`) : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<FlightTakeoffIcon />}
              label={t('country.nomadVisa')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.nomadVisa ? t('values.yes') : t('values.no')}
                </Typography>
              }
            />
          </Paper>
        </Grid>

        {/* Financial Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ px: 2, py: 1 }}>
              {t('country.costOfLiving')}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <MetricRow
              icon={<AttachMoneyIcon />}
              label={t('country.costOfLiving')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.costOfLiving !== null ? `$${country.costOfLiving}/мес` : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<HomeIcon />}
              label={t('country.rent')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.rent !== null ? `$${country.rent}/мес` : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<ShoppingCartIcon />}
              label={t('country.groceries')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.groceries !== null ? `$${country.groceries}/мес` : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<WorkIcon />}
              label={t('country.salary')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.salary !== null ? `$${country.salary}/мес` : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<AccountBalanceIcon />}
              label={t('country.taxes')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.taxes !== null ? `${country.taxes}%` : '—'}
                </Typography>
              }
            />
          </Paper>
        </Grid>

        {/* Quality of Life */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ px: 2, py: 1 }}>
              {t('charts.quality')}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {country.safety !== null && (
              <MetricRow
                icon={<SecurityIcon />}
                label={t('country.safety')}
                value={<MetricChip type="safety" value={country.safety} />}
              />
            )}
            <MetricRow
              icon={<LocalHospitalIcon />}
              label={t('country.healthcare')}
              value={<MetricChip type="healthcare" value={country.healthcare} />}
            />
            <MetricRow
              icon={<WifiIcon />}
              label={t('country.internetSpeed')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.internetSpeed !== null
                    ? `${country.internetSpeed} ${t('country.mbps')}`
                    : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<DirectionsBusIcon />}
              label={t('country.transport')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.transport !== null ? `$${country.transport}/мес` : '—'}
                </Typography>
              }
            />
            <MetricRow
              icon={<LanguageIcon />}
              label={t('country.englishLevel')}
              value={<MetricChip type="english" value={country.englishLevel} />}
            />
          </Paper>
        </Grid>

        {/* Community & Banking */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ px: 2, py: 1 }}>
              {t('country.banking')}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <MetricRow
              icon={<AccountBalanceIcon />}
              label={t('country.banking')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {t(`values.banking.${country.banking}`)}
                </Typography>
              }
            />
            <MetricRow
              icon={<PeopleIcon />}
              label={t('country.russianCommunity')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.russianCommunity ? t('values.yes') : t('values.no')}
                </Typography>
              }
            />
            <MetricRow
              icon={<WorkIcon />}
              label={t('country.freelanceFriendly')}
              value={
                <Typography variant="body2" fontWeight={600}>
                  {country.freelanceFriendly ? t('values.yes') : t('values.no')}
                </Typography>
              }
            />
            <MetricRow
              icon={<FlightTakeoffIcon />}
              label={t('country.immigrationDifficulty')}
              value={<MetricChip type="immigration" value={country.immigrationDifficulty} />}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Photo Gallery */}
      {(photos.length > 1 || photosLoading) && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            {t('country.photos')}
          </Typography>
          {photosLoading ? (
            <ImageList cols={3} gap={8} sx={{ m: 0 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <ImageListItem key={`skeleton-${index}`}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: 1 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : photos.length > 1 ? (
            <ImageList cols={3} gap={8} sx={{ m: 0 }}>
              {photos.slice(1).map((photo) => (
                <ImageListItem
                  key={photo.id}
                  sx={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRadius: 1,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      transition: 'transform 0.2s',
                    },
                  }}
                  onClick={() => setSelectedPhoto(photo.src.large2x)}
                >
                  <img
                    src={photo.src.medium}
                    alt={photo.alt || country.name[currentLang]}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : null}
        </Paper>
      )}

      {/* Photo Dialog */}
      <Dialog
        open={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedPhoto(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt={country.name[currentLang]}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
