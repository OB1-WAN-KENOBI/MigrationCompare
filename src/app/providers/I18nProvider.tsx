import { type ReactNode, Suspense, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { STORAGE_KEYS } from '@shared/config';

const ruTranslation = {
  app: {
    title: 'MigrationCompare',
    subtitle: 'Сравнение стран для миграции',
  },
  nav: {
    home: 'Главная',
    countries: 'Страны',
    compare: 'Сравнение',
    favorites: 'Избранное',
    about: 'О нас',
  },
  countries: {
    title: 'Страны для миграции',
    search: 'Поиск по названию...',
    noResults: 'Страны не найдены',
    addToCompare: 'Добавить в сравнение',
    removeFromCompare: 'Удалить из сравнения',
    addToFavorites: 'В избранное',
    removeFromFavorites: 'Убрать из избранного',
    viewDetails: 'Подробнее',
    count_one: '{{count}} страна',
    count_few: '{{count}} страны',
    count_many: '{{count}} стран',
    count_other: '{{count}} стран',
  },
  filters: {
    title: 'Фильтры',
    safety: 'Безопасность',
    climate: 'Климат',
    visa: 'Визовый режим',
    englishLevel: 'Уровень английского',
    rent: 'Аренда ($/мес)',
    taxes: 'Налоги (%)',
    reset: 'Сбросить фильтры',
  },
  sort: {
    title: 'Сортировка',
    rent: 'По аренде',
    safety: 'По безопасности',
    immigrationDifficulty: 'По сложности иммиграции',
    salary: 'По зарплате',
    costOfLiving: 'По стоимости жизни',
  },
  country: {
    population: 'Население',
    language: 'Язык',
    currency: 'Валюта',
    visa: 'Визовый режим',
    costOfLiving: 'Стоимость жизни',
    safety: 'Безопасность',
    internetSpeed: 'Скорость интернета',
    climate: 'Климат',
    salary: 'Средняя зарплата',
    rent: 'Аренда жилья',
    groceries: 'Продукты',
    immigrationDifficulty: 'Сложность иммиграции',
    taxes: 'Налоги',
    freelanceFriendly: 'Фриланс',
    englishLevel: 'Уровень английского',
    healthcare: 'Здравоохранение',
    transport: 'Транспорт',
    nomadVisa: 'Виза цифрового кочевника',
    banking: 'Банковская система',
    russianCommunity: 'Русскоязычное сообщество',
    perMonth: 'мес',
    english: 'Уровень английского',
    immigration: 'Сложность иммиграции',
    mbps: 'Мбит/с',
  },
  values: {
    safety: { low: 'Низкая', medium: 'Средняя', high: 'Высокая' },
    immigration: { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' },
    english: { low: 'Низкий', medium: 'Средний', high: 'Высокий' },
    healthcare: { basic: 'Базовое', medium: 'Среднее', good: 'Хорошее' },
    climate: {
      continental: 'Континентальный',
      tropical: 'Тропический',
      mediterranean: 'Средиземноморский',
      moderate: 'Умеренный',
      diverse: 'Разнообразный',
      dry: 'Сухой',
    },
    yes: 'Да',
    no: 'Нет',
  },
  compare: {
    title: 'Сравнение стран',
    empty: 'Добавьте страны для сравнения',
    emptyHint: 'Выберите страны на главной странице',
    remove: 'Удалить',
    better: 'Лучше',
    worse: 'Хуже',
    average: 'Среднее',
  },
  favorites: {
    title: 'Избранные страны',
    empty: 'Нет избранных стран',
    emptyHint: 'Нажмите на сердечко на карточке страны, чтобы добавить в избранное',
    browseCountries: 'Перейти к странам',
  },
  charts: { costs: 'Расходы', quality: 'Качество жизни' },
  theme: { light: 'Светлая тема', dark: 'Тёмная тема', system: 'Системная' },
  language: { ru: 'Русский', en: 'English' },
};

const enTranslation = {
  app: {
    title: 'MigrationCompare',
    subtitle: 'Compare countries for migration',
  },
  nav: {
    home: 'Home',
    countries: 'Countries',
    compare: 'Compare',
    favorites: 'Favorites',
    about: 'About',
  },
  countries: {
    title: 'Countries for migration',
    search: 'Search by name...',
    noResults: 'No countries found',
    addToCompare: 'Add to compare',
    removeFromCompare: 'Remove from compare',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    viewDetails: 'View details',
    count_one: '{{count}} country',
    count_other: '{{count}} countries',
  },
  filters: {
    title: 'Filters',
    safety: 'Safety',
    climate: 'Climate',
    visa: 'Visa policy',
    englishLevel: 'English level',
    rent: 'Rent ($/mo)',
    taxes: 'Taxes (%)',
    reset: 'Reset filters',
  },
  sort: {
    title: 'Sort',
    rent: 'By rent',
    safety: 'By safety',
    immigrationDifficulty: 'By immigration difficulty',
    salary: 'By salary',
    costOfLiving: 'By cost of living',
  },
  country: {
    population: 'Population',
    language: 'Language',
    currency: 'Currency',
    visa: 'Visa policy',
    costOfLiving: 'Cost of living',
    safety: 'Safety',
    internetSpeed: 'Internet speed',
    climate: 'Climate',
    salary: 'Average salary',
    rent: 'Rent',
    groceries: 'Groceries',
    immigrationDifficulty: 'Immigration difficulty',
    taxes: 'Taxes',
    freelanceFriendly: 'Freelance friendly',
    englishLevel: 'English level',
    healthcare: 'Healthcare',
    transport: 'Transport',
    nomadVisa: 'Digital nomad visa',
    banking: 'Banking system',
    russianCommunity: 'Russian community',
    perMonth: 'mo',
    english: 'English level',
    immigration: 'Immigration difficulty',
    mbps: 'Mbps',
  },
  values: {
    safety: { low: 'Low', medium: 'Medium', high: 'High' },
    immigration: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    english: { low: 'Low', medium: 'Medium', high: 'High' },
    healthcare: { basic: 'Basic', medium: 'Medium', good: 'Good' },
    climate: {
      continental: 'Continental',
      tropical: 'Tropical',
      mediterranean: 'Mediterranean',
      moderate: 'Moderate',
      diverse: 'Diverse',
      dry: 'Dry',
    },
    yes: 'Yes',
    no: 'No',
  },
  compare: {
    title: 'Compare countries',
    empty: 'Add countries to compare',
    emptyHint: 'Select countries from the main page',
    remove: 'Remove',
    better: 'Better',
    worse: 'Worse',
    average: 'Average',
  },
  favorites: {
    title: 'Favorite countries',
    empty: 'No favorite countries',
    emptyHint: 'Click the heart icon on a country card to add to favorites',
    browseCountries: 'Browse countries',
  },
  charts: { costs: 'Costs', quality: 'Quality of life' },
  theme: { light: 'Light theme', dark: 'Dark theme', system: 'System' },
  language: { ru: 'Русский', en: 'English' },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ruTranslation },
      en: { translation: enTranslation },
    },
    fallbackLng: 'ru',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
      caches: ['localStorage'],
    },
  });

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  useEffect(() => {
    const storedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (storedLang && (storedLang === 'ru' || storedLang === 'en')) {
      void i18n.changeLanguage(storedLang);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </I18nextProvider>
  );
};

export { i18n };
