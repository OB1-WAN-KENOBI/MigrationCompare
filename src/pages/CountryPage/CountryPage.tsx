import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { MetaTags } from '@dr.pogodin/react-helmet';
import { CountryDetails } from '@entities/country/ui';
import { useCountry, useCompare, useNormalizedLanguage } from '@shared/lib';
import { searchCountryPhotos } from '@/shared/api/countries/pexels';
import { QUERY_KEYS } from '@shared/config';
import { PageTransition } from '@shared/ui';

const CountryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const currentLang = useNormalizedLanguage();

  const { data: country, isLoading, error } = useCountry(id ?? '');
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  // Prefetch фотографий сразу после загрузки страны
  useEffect(() => {
    if (country?.name.en) {
      void queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.COUNTRY, 'photos', country.name.en],
        queryFn: () => searchCountryPhotos(country.name.en, 5),
        staleTime: 1000 * 60 * 60 * 24, // 24 часа
      });
    }
  }, [country?.name.en, queryClient]);

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

  if (error || !country) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => void navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            {t('nav.home')}
          </Link>
          <Typography color="text.primary">{t('errors.countryNotFound')}</Typography>
        </Breadcrumbs>
        <Typography variant="h5" color="error">
          {t('errors.countryNotFound')}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => void navigate('/')} sx={{ mt: 2 }}>
          {t('nav.home')}
        </Button>
      </Container>
    );
  }

  const costsData = [
    { name: t('country.rent'), value: country.rent ?? 0 },
    { name: t('country.groceries'), value: country.groceries ?? 0 },
    { name: t('country.transport'), value: country.transport ?? 0 },
  ].filter((item) => item.value > 0);

  const qualityData = [
    country.safety !== null && {
      subject: t('country.safety'),
      value: country.safety === 'high' ? 100 : country.safety === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    {
      subject: t('country.healthcare'),
      value: country.healthcare === 'advanced' ? 100 : country.healthcare === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    {
      subject: t('country.englishLevel'),
      value: country.englishLevel === 'high' ? 100 : country.englishLevel === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    country.internetSpeed !== null && {
      subject: t('country.internetSpeed'),
      value: Math.min(country.internetSpeed, 100),
      fullMark: 100,
    },
    {
      subject: t('country.freelanceFriendly'),
      value: country.freelanceFriendly ? 100 : 30,
      fullMark: 100,
    },
  ].filter((item): item is NonNullable<typeof item> => item !== false);

  const countryDescription = `${t('country.costOfLiving')}: $${country.costOfLiving ?? 'N/A'}/mo, ${t('country.safety')}: ${country.safety ?? 'N/A'}, ${t('country.visa')}: ${country.visa}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Country',
    name: country.name[currentLang],
    alternateName: country.name[currentLang === 'ru' ? 'en' : 'ru'],
    description: countryDescription,
    currency: country.currency,
    population: country.population,
  };

  return (
    <>
      <MetaTags
        title={`${country.name[currentLang]} - ${t('app.title')}`}
        description={countryDescription}
      />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <PageTransition>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link
              component="button"
              variant="body1"
              onClick={() => void navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <HomeIcon fontSize="small" />
              {t('nav.home')}
            </Link>
            <Link
              component="button"
              variant="body1"
              onClick={() => void navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <PublicIcon fontSize="small" />
              {t('nav.countries')}
            </Link>
            <Typography
              color="text.primary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              {country.flag} {country.name[currentLang]}
            </Typography>
          </Breadcrumbs>
          {/* Back button and actions */}
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Button startIcon={<ArrowBackIcon />} onClick={() => void navigate('/')}>
              {t('nav.home')}
            </Button>
            <Button
              variant={isInCompare(country.id) ? 'contained' : 'outlined'}
              startIcon={<CompareArrowsIcon />}
              onClick={() => toggleCompare(country.id)}
              disabled={!isInCompare(country.id) && !canAddMore}
            >
              {isInCompare(country.id)
                ? t('countries.removeFromCompare')
                : t('countries.addToCompare')}
            </Button>
          </Box>

          {/* Country Details */}
          <CountryDetails country={country} />

          {/* Charts */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {/* Costs Bar Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('charts.costs')} ($/{t('country.perMonth')})
                </Typography>
                <Box sx={{ width: '100%', height: 300, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={costsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: 'none',
                          borderRadius: 8,
                          color: '#fff',
                        }}
                        formatter={(value: number) => [`$${value}`, '']}
                      />
                      <Bar dataKey="value" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Quality Radar Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('charts.quality')}
                </Typography>
                <Box sx={{ width: '100%', height: 300, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={qualityData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name={country.name[currentLang]}
                        dataKey="value"
                        stroke="#22d3ee"
                        fill="#22d3ee"
                        fillOpacity={0.5}
                      />
                      <Legend
                        formatter={() => country.name[currentLang]}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(30, 41, 59, 0.9)',
                          border: 'none',
                          borderRadius: 8,
                          color: '#fff',
                        }}
                        formatter={(value: number) => [value, country.name[currentLang]]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </PageTransition>
    </>
  );
};

export default CountryPage;
