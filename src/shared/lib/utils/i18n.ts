/**
 * Нормализует язык из i18n в формат 'ru' | 'en'
 * @param lang - Язык из i18n (может быть 'ru', 'ru-RU', 'en', 'en-US' и т.д.)
 * @returns Нормализованный язык 'ru' или 'en'
 */
export function normalizeLanguage(lang: string | undefined | null): 'ru' | 'en' {
  if (!lang) return 'en';
  return lang.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
