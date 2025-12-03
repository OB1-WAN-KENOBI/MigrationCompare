import { type ReactNode } from 'react';
import { HelmetProvider as ReactHelmetProvider } from '@dr.pogodin/react-helmet';

interface HelmetProviderProps {
  children: ReactNode;
}

export const HelmetProvider = ({ children }: HelmetProviderProps) => {
  return <ReactHelmetProvider>{children}</ReactHelmetProvider>;
};
