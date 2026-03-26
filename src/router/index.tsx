import { lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';
import { Navigate, createBrowserRouter } from 'react-router-dom';

const AppShellLayout = lazy(async () => ({
  default: (await import('../components/AppShellLayout')).AppShellLayout,
}));
const HomePage = lazy(async () => ({
  default: (await import('../pages/HomePage')).HomePage,
}));
const DestinationsPage = lazy(async () => ({
  default: (await import('../pages/DestinationsPage')).DestinationsPage,
}));
const DestinationPage = lazy(async () => ({
  default: (await import('../pages/DestinationPage')).DestinationPage,
}));
const PlacesPage = lazy(async () => ({
  default: (await import('../pages/PlacesPage')).PlacesPage,
}));
const ServicesPage = lazy(async () => ({
  default: (await import('../pages/ServicesPage')).ServicesPage,
}));
const MapPage = lazy(async () => ({
  default: (await import('../pages/MapPage')).MapPage,
}));
const RouteGeneratorPage = lazy(async () => ({
  default: (await import('../pages/RouteGeneratorPage')).RouteGeneratorPage,
}));
const RouteResultPage = lazy(async () => ({
  default: (await import('../pages/RouteResultPage')).RouteResultPage,
}));
const AdminLayout = lazy(async () => ({
  default: (await import('../components/AdminLayout')).AdminLayout,
}));
const AdminDashboardPage = lazy(async () => ({
  default: (await import('../pages/AdminDashboardPage')).AdminDashboardPage,
}));
const AdminCategoriesPage = lazy(async () => ({
  default: (await import('../pages/AdminCategoriesPage')).AdminCategoriesPage,
}));
const AdminPlacesPage = lazy(async () => ({
  default: (await import('../pages/AdminPlacesPage')).AdminPlacesPage,
}));
const AdminPlaceFormPage = lazy(async () => ({
  default: (await import('../pages/AdminPlaceFormPage')).AdminPlaceFormPage,
}));

const PageLoader = () => (
  <Center h="min(55vh, 420px)">
    <Loader color="sun" size="lg" />
  </Center>
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: withSuspense(<AdminLayout />),
    children: [
      { index: true, element: withSuspense(<AdminDashboardPage />) },
      { path: 'categories', element: withSuspense(<AdminCategoriesPage />) },
      { path: 'places', element: withSuspense(<AdminPlacesPage />) },
      { path: 'places/new', element: withSuspense(<AdminPlaceFormPage />) },
      { path: 'places/:id/edit', element: withSuspense(<AdminPlaceFormPage />) },
      { path: '*', element: <Navigate to="/admin" replace /> },
    ],
  },
  {
    path: '/',
    element: withSuspense(<AppShellLayout />),
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'destinations', element: withSuspense(<DestinationsPage />) },
      { path: 'destinations/:slug', element: withSuspense(<DestinationPage />) },
      { path: 'places', element: withSuspense(<PlacesPage />) },
      { path: 'map', element: withSuspense(<MapPage />) },
      { path: 'services', element: withSuspense(<ServicesPage />) },
      { path: 'route-generator', element: withSuspense(<RouteGeneratorPage />) },
      { path: 'route-result', element: withSuspense(<RouteResultPage />) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
