import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
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
import { CountryDetails } from '@entities/CountryDetails';
import { useCountry, useCompare } from '@shared/lib';
import { PageTransition } from '@shared/ui';

const CountryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language?.startsWith('ru') ? 'ru' : 'en') as 'ru' | 'en';

  const { data: country, isLoading, error } = useCountry(id ?? '');
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

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
        <Typography variant="h5" color="error">
          Страна не найдена
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => void navigate('/')} sx={{ mt: 2 }}>
          {t('nav.home')}
        </Button>
      </Container>
    );
  }

  const costsData = [
    { name: t('country.rent'), value: country.rent },
    { name: t('country.groceries'), value: country.groceries },
    { name: t('country.transport'), value: country.transport },
  ];

  const qualityData = [
    {
      subject: t('country.safety'),
      value: country.safety === 'high' ? 100 : country.safety === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    {
      subject: t('country.healthcare'),
      value: country.healthcare === 'good' ? 100 : country.healthcare === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    {
      subject: t('country.englishLevel'),
      value: country.englishLevel === 'high' ? 100 : country.englishLevel === 'medium' ? 60 : 30,
      fullMark: 100,
    },
    {
      subject: t('country.internetSpeed'),
      value: Math.min(country.internetSpeed, 100),
      fullMark: 100,
    },
    {
      subject: t('country.freelanceFriendly'),
      value: country.freelanceFriendly ? 100 : 30,
      fullMark: 100,
    },
  ];

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back button and actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
  );
};

export default CountryPage;
