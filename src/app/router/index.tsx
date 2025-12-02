import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Header } from '@widgets/Header';

const CountriesPage = lazy(() => import('@pages/CountriesPage'));
const CountryPage = lazy(() => import('@pages/CountryPage'));
const ComparePage = lazy(() => import('@pages/ComparePage'));
const FavoritesPage = lazy(() => import('@pages/FavoritesPage'));

const PageLoader = () => (
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

const RootLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CountriesPage />,
      },
      {
        path: 'country/:id',
        element: <CountryPage />,
      },
      {
        path: 'compare',
        element: <ComparePage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
