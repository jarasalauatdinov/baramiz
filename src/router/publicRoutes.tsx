import { Navigate, useParams, type RouteObject } from 'react-router-dom';
import { routePaths } from './paths';
import { lazyPage, withSuspense } from './pageLoader';

const AppMobileLayout = lazyPage(
  () => import('../components/layout/AppMobileLayout'),
  (module) => module.AppMobileLayout,
);

const AppSplashPage = lazyPage(
  () => import('../pages/AppSplashPage'),
  (module) => module.AppSplashPage,
);
const AppLanguagePage = lazyPage(
  () => import('../pages/AppLanguagePage'),
  (module) => module.AppLanguagePage,
);
const AppOnboardingPage = lazyPage(
  () => import('../pages/AppOnboardingPage'),
  (module) => module.AppOnboardingPage,
);
const AppHomePage = lazyPage(
  () => import('../pages/AppHomePage'),
  (module) => module.AppHomePage,
);
const DestinationsPage = lazyPage(
  () => import('../pages/DestinationsPage'),
  (module) => module.DestinationsPage,
);
const DestinationPage = lazyPage(
  () => import('../pages/DestinationPage'),
  (module) => module.DestinationPage,
);
const PlacesPage = lazyPage(() => import('../pages/PlacesPage'), (module) => module.PlacesPage);
const PlaceDetailsPage = lazyPage(
  () => import('../pages/PlaceDetailsPage'),
  (module) => module.PlaceDetailsPage,
);
const ServicesPage = lazyPage(
  () => import('../pages/ServicesPage'),
  (module) => module.ServicesPage,
);
const GuidesPage = lazyPage(() => import('../pages/GuidesPage'), (module) => module.GuidesPage);
const MapPage = lazyPage(() => import('../pages/MapPage'), (module) => module.MapPage);
const RouteGeneratorPage = lazyPage(
  () => import('../pages/RouteGeneratorPage'),
  (module) => module.RouteGeneratorPage,
);
const RouteResultPage = lazyPage(
  () => import('../pages/RouteResultPage'),
  (module) => module.RouteResultPage,
);
const AboutPage = lazyPage(() => import('../pages/AboutPage'), (module) => module.AboutPage);
const NotFoundPage = lazyPage(
  () => import('../pages/NotFoundPage'),
  (module) => module.NotFoundPage,
);

function DestinationAliasRedirect() {
  const { slug } = useParams();
  return <Navigate to={routePaths.appDestinationDetails(slug ?? 'nukus')} replace />;
}

function PlaceAliasRedirect() {
  const { id } = useParams();
  return <Navigate to={routePaths.appPlaceDetails(id ?? '1')} replace />;
}

const appChildren: RouteObject[] = [
  { index: true, element: <Navigate to={routePaths.appHome} replace /> },
  { path: 'home', element: withSuspense(<AppHomePage />) },
  { path: 'explore', element: withSuspense(<PlacesPage />) },
  { path: 'places/:id', element: withSuspense(<PlaceDetailsPage />) },
  { path: 'destinations', element: withSuspense(<DestinationsPage />) },
  { path: 'destinations/:slug', element: withSuspense(<DestinationPage />) },
  { path: 'services', element: withSuspense(<ServicesPage />) },
  { path: 'guides', element: withSuspense(<GuidesPage />) },
  { path: 'route-builder', element: withSuspense(<RouteGeneratorPage />) },
  { path: 'route-result', element: withSuspense(<RouteResultPage />) },
  { path: 'map', element: withSuspense(<MapPage />) },
  { path: 'about', element: withSuspense(<AboutPage />) },
];

export const publicRoutes: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <Navigate to={routePaths.appSplash} replace /> },
    { path: 'app/splash', element: withSuspense(<AppSplashPage />) },
    { path: 'app/language', element: withSuspense(<AppLanguagePage />) },
    { path: 'app/onboarding', element: withSuspense(<AppOnboardingPage />) },
    {
      path: 'app',
      element: withSuspense(<AppMobileLayout />),
      children: appChildren,
    },

    { path: 'home', element: <Navigate to={routePaths.appHome} replace /> },
    { path: 'destinations', element: <Navigate to={routePaths.appDestinations} replace /> },
    {
      path: 'destinations/:slug',
      element: <DestinationAliasRedirect />,
    },
    { path: 'places', element: <Navigate to={routePaths.appExplore} replace /> },
    {
      path: 'places/:id',
      element: <PlaceAliasRedirect />,
    },
    { path: 'services', element: <Navigate to={routePaths.appServices} replace /> },
    { path: 'guides', element: <Navigate to={routePaths.appGuides} replace /> },
    { path: 'map', element: <Navigate to={`${routePaths.appRoot}/map`} replace /> },
    { path: 'route-generator', element: <Navigate to={routePaths.appRouteBuilder} replace /> },
    { path: 'route-result', element: <Navigate to={routePaths.appRouteResult} replace /> },
    { path: 'about', element: <Navigate to={`${routePaths.appRoot}/about`} replace /> },
    { path: '*', element: withSuspense(<NotFoundPage />) },
  ],
};
