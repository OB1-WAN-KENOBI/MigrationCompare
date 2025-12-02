import { type ReactNode } from 'react';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <Fade in timeout={400}>
      <Box>{children}</Box>
    </Fade>
  );
};
