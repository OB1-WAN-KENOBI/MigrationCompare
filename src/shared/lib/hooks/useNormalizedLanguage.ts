import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../utils/i18n';

/**
 * Хук для получения нормализованного языка
 * @returns Нормализованный язык 'ru' | 'en'
 */
export const useNormalizedLanguage = (): 'ru' | 'en' => {
  const { i18n } = useTranslation();
  return normalizeLanguage(i18n.language);
};
