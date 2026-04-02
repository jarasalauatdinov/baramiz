import { Navigate, useParams, type RouteObject } from 'react-router-dom';
import { RequireSession } from '../features/auth/ui/RequireSession';
import { routePaths } from './paths';
import { lazyPage, withSuspense } from './pageLoader';

const AppMobileLayout = lazyPage(
  () => import('../widgets/app-shell'),
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
const AppAuthRequiredPage = lazyPage(
  () => import('../pages/AppAuthRequiredPage'),
  (module) => module.AppAuthRequiredPage,
);
const AppLoginPage = lazyPage(
  () => import('../pages/AppLoginPage'),
  (module) => module.AppLoginPage,
);
const AppRegisterPage = lazyPage(
  () => import('../pages/AppRegisterPage'),
  (module) => module.AppRegisterPage,
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
const TripHotelsPage = lazyPage(
  () => import('../pages/TripHotelsPage'),
  (module) => module.TripHotelsPage,
);
const HotelDetailsPage = lazyPage(
  () => import('../pages/HotelDetailsPage'),
  (module) => module.HotelDetailsPage,
);
const AppProfilePage = lazyPage(
  () => import('../pages/AppProfilePage'),
  (module) => module.AppProfilePage,
);
const MapPage = lazyPage(() => import('../pages/MapPage'), (module) => module.MapPage);
const RouteGeneratorPage = lazyPage(
  () => import('../pages/RouteGeneratorPage'),
  (module) => module.RouteGeneratorPage,
);
const RouteResultPage = lazyPage(
  () => import('../pages/RouteResultPage'),
  (module) => module.RouteResultPage,
);
const BookingDetailsPage = lazyPage(
  () => import('../pages/BookingDetailsPage'),
  (module) => module.BookingDetailsPage,
);
const BookingReviewPage = lazyPage(
  () => import('../pages/BookingReviewPage'),
  (module) => module.BookingReviewPage,
);
const PaymentMethodPage = lazyPage(
  () => import('../pages/PaymentMethodPage'),
  (module) => module.PaymentMethodPage,
);
const BookingConfirmationPage = lazyPage(
  () => import('../pages/BookingConfirmationPage'),
  (module) => module.BookingConfirmationPage,
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

function HotelAliasRedirect() {
  const { slug } = useParams();
  return <Navigate to={routePaths.appHotelDetails(slug ?? 'savitsky-plaza')} replace />;
}

const publicAppChildren: RouteObject[] = [
  { index: true, element: <Navigate to={routePaths.appHome} replace /> },
  { path: 'home', element: withSuspense(<AppHomePage />) },
  { path: 'explore', element: withSuspense(<PlacesPage />) },
  { path: 'places/:id', element: withSuspense(<PlaceDetailsPage />) },
  { path: 'destinations', element: withSuspense(<DestinationsPage />) },
  { path: 'destinations/:slug', element: withSuspense(<DestinationPage />) },
  { path: 'services', element: withSuspense(<ServicesPage />) },
  { path: 'guides', element: withSuspense(<GuidesPage />) },
  { path: 'trip-hotels', element: withSuspense(<TripHotelsPage />) },
  { path: 'trip-hotels/:slug', element: withSuspense(<HotelDetailsPage />) },
  { path: 'profile', element: withSuspense(<AppProfilePage />) },
  { path: 'route-builder', element: withSuspense(<RouteGeneratorPage />) },
  { path: 'route-result', element: withSuspense(<RouteResultPage />) },
  { path: 'map', element: withSuspense(<MapPage />) },
  { path: 'about', element: withSuspense(<AboutPage />) },
];

const appChildren: RouteObject[] = [
  ...publicAppChildren,
  {
    element: <RequireSession reason="booking" />,
    children: [
      { path: 'booking', element: withSuspense(<BookingDetailsPage />) },
      { path: 'booking/review', element: withSuspense(<BookingReviewPage />) },
      { path: 'booking/confirmation', element: withSuspense(<BookingConfirmationPage />) },
    ],
  },
  {
    element: <RequireSession reason="payment" />,
    children: [{ path: 'booking/payment', element: withSuspense(<PaymentMethodPage />) }],
  },
];

export const publicRoutes: RouteObject = {
  path: '/',
  children: [
    { index: true, element: <Navigate to={routePaths.appSplash} replace /> },
    { path: 'app/splash', element: withSuspense(<AppSplashPage />) },
    { path: 'app/language', element: withSuspense(<AppLanguagePage />) },
    { path: 'app/onboarding', element: withSuspense(<AppOnboardingPage />) },
    { path: 'app/auth-required', element: withSuspense(<AppAuthRequiredPage />) },
    { path: 'app/login', element: withSuspense(<AppLoginPage />) },
    { path: 'app/register', element: withSuspense(<AppRegisterPage />) },
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
    { path: 'hotels', element: <Navigate to={routePaths.appTripHotels} replace /> },
    { path: 'hotels/:slug', element: <HotelAliasRedirect /> },
    { path: 'profile', element: <Navigate to={routePaths.appProfile} replace /> },
    { path: 'map', element: <Navigate to={`${routePaths.appRoot}/map`} replace /> },
    { path: 'route-generator', element: <Navigate to={routePaths.appRouteBuilder} replace /> },
    { path: 'route-result', element: <Navigate to={routePaths.appRouteResult} replace /> },
    { path: 'about', element: <Navigate to={`${routePaths.appRoot}/about`} replace /> },
    { path: '*', element: withSuspense(<NotFoundPage />) },
  ],
};
