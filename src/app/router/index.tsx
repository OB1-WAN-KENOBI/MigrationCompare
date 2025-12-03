import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import Box from '@mui/material/Box';
import { Header } from '@widgets/Header';
import { PageLoader } from '@shared/ui';

const CountriesPage = lazy(() => import('@pages/CountriesPage'));
const CountryPage = lazy(() => import('@pages/CountryPage'));
const ComparePage = lazy(() => import('@pages/ComparePage'));
const FavoritesPage = lazy(() => import('@pages/FavoritesPage'));

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

const router = createBrowserRouter(
  [
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
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
