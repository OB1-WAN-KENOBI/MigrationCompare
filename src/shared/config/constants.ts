export const STORAGE_KEYS = {
  COMPARE_LIST: 'migration-compare-list',
  FAVORITES: 'migration-favorites',
  THEME_MODE: 'migration-theme-mode',
  LANGUAGE: 'migration-language',
} as const;

export const QUERY_KEYS = {
  COUNTRIES: 'countries',
  COUNTRY: 'country',
} as const;

export const ROUTES = {
  HOME: '/',
  COUNTRY: '/country/:id',
  COMPARE: '/compare',
} as const;

export const API_ENDPOINTS = {
  COUNTRIES: '/countries.json',
} as const;

export const SAFETY_ORDER: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const IMMIGRATION_ORDER: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const ENGLISH_ORDER: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};
