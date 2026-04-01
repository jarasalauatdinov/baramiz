import type { RouteObject } from 'react-router-dom';
import { lazyPage, withSuspense } from './pageLoader';

const AdminLayout = lazyPage(
  () => import('../components/AdminLayout'),
  (module) => module.AdminLayout,
);
const AdminDashboardPage = lazyPage(
  () => import('../pages/AdminDashboardPage'),
  (module) => module.AdminDashboardPage,
);
const AdminCategoriesPage = lazyPage(
  () => import('../pages/AdminCategoriesPage'),
  (module) => module.AdminCategoriesPage,
);
const AdminPlacesPage = lazyPage(
  () => import('../pages/AdminPlacesPage'),
  (module) => module.AdminPlacesPage,
);
const AdminPlaceFormPage = lazyPage(
  () => import('../pages/AdminPlaceFormPage'),
  (module) => module.AdminPlaceFormPage,
);
const NotFoundPage = lazyPage(
  () => import('../pages/NotFoundPage'),
  (module) => module.NotFoundPage,
);

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: withSuspense(<AdminLayout />),
  children: [
    { index: true, element: withSuspense(<AdminDashboardPage />) },
    { path: 'categories', element: withSuspense(<AdminCategoriesPage />) },
    { path: 'places', element: withSuspense(<AdminPlacesPage />) },
    { path: 'places/new', element: withSuspense(<AdminPlaceFormPage />) },
    { path: 'places/:id/edit', element: withSuspense(<AdminPlaceFormPage />) },
    { path: '*', element: withSuspense(<NotFoundPage />) },
  ],
};

