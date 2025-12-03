import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 64px)',
    }}
  >
    <CircularProgress />
  </Box>
);
