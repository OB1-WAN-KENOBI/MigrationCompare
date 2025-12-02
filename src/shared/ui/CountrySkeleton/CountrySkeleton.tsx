import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export const CountrySkeleton = () => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Skeleton variant="rectangular" height={140} animation="wave" />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" height={32} animation="wave" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="80%" animation="wave" />
          <Skeleton variant="text" width="70%" animation="wave" />
          <Skeleton variant="text" width="50%" animation="wave" />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} animation="wave" />
          <Skeleton variant="rounded" width={80} height={24} animation="wave" />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width="100%" height={36} animation="wave" />
      </Box>
    </Card>
  );
};
