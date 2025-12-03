import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const showSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  const showError = (message: string) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const showInfo = (message: string) => {
    enqueueSnackbar(message, { variant: 'info' });
  };

  const showWarning = (message: string) => {
    enqueueSnackbar(message, { variant: 'warning' });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    t, // Для удобства использования переводов
  };
};
