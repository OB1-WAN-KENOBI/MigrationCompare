import { type ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { I18nProvider } from './I18nProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from './ToastProvider';
import { HelmetProvider } from './HelmetProvider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryProvider>
          <I18nProvider>
            <ToastProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </ToastProvider>
          </I18nProvider>
        </QueryProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export { useThemeMode } from './ThemeProvider';
export { i18n } from './I18nProvider';
