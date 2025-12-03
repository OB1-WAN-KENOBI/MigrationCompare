import { Component, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { logError } from '@shared/lib/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logError(error, 'ErrorBoundary');
    if (import.meta.env.DEV) {
      console.error('Error details:', errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
        <Typography variant="h5" component="h1" fontWeight={600}>
          Произошла ошибка
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error?.message ?? 'Произошла непредвиденная ошибка'}
        </Typography>
        <Button variant="contained" onClick={onReset} sx={{ mt: 2 }}>
          Попробовать снова
        </Button>
      </Box>
    </Container>
  );
};
