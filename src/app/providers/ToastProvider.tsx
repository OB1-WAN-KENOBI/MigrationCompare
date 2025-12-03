import { type ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
  );
};
