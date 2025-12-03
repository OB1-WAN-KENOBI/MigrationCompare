/**
 * Логирует ошибки только в dev-режиме
 * @param error - Ошибка для логирования
 * @param context - Контекст, где произошла ошибка
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    const contextMsg = context ? `[${context}]` : '';
    console.error(`${contextMsg} Error:`, error);
  }
}
