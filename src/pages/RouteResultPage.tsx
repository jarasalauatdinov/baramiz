import { useEffect, useMemo, useState } from 'react';
import { Button, Container } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getPlaces, type Place } from '../entities/place';
import { routePaths } from '../router/paths';
import { StatePanel } from '../shared/ui';
import {
  createGuideBookingSource,
  createRouteBookingSource,
  createServiceBookingSource,
} from '../features/booking/model/bookingDraft';
import { startProtectedAction } from '../features/auth/lib/startProtectedAction';
import {
  clearPendingProtectedAction,
  getPendingProtectedAction,
} from '../features/auth/model/protectedAction';
import { hasAuthSession } from '../features/auth/model/session';
import { getCurrentRouteResult, setCurrentRouteResult } from '../features/route-planning/model/currentRoute';
import { saveRouteForLater } from '../features/route-planning/model/savedRoutes';
import type { RoutePlanningResult } from '../features/route-planning/model/types';
import { composeRouteResultScreenData, RouteResultScreen } from '../widgets/route-result';

export function RouteResultPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = (location.state ?? null) as RoutePlanningResult | null;
  const persistedState = useMemo(() => getCurrentRouteResult(), []);
  const state = navigationState ?? persistedState;
  const route = state?.route ?? null;
  const request = state?.request ?? null;
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [mapDataFailed, setMapDataFailed] = useState(false);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);

  useEffect(() => {
    if (navigationState) {
      setCurrentRouteResult(navigationState);
    }
  }, [navigationState]);

  useEffect(() => {
    if (!route) {
      return;
    }

    let active = true;

    const loadPlaces = async () => {
      try {
        const data = await getPlaces();

        if (!active) {
          return;
        }

        setAllPlaces(data);
      } catch (error) {
        console.error('Failed to load places for route result view', error);

        if (!active) {
          return;
        }

        setMapDataFailed(true);
      }
    };

    void loadPlaces();

    return () => {
      active = false;
    };
  }, [route]);

  const screenData = useMemo(() => {
    if (!state) {
      return null;
    }

    return composeRouteResultScreenData({
      state,
      allPlaces,
      selectedStopIndex,
      t,
    });
  }, [allPlaces, selectedStopIndex, state, t]);

  useEffect(() => {
    if (selectedStopIndex >= (screenData?.stopModels.length ?? 0)) {
      setSelectedStopIndex(0);
    }
  }, [screenData?.stopModels.length, selectedStopIndex]);

  useEffect(() => {
    if (!state || !hasAuthSession()) {
      return;
    }

    const pendingIntent = getPendingProtectedAction();

    if (!pendingIntent || pendingIntent.reason !== 'save-route' || pendingIntent.redirectTo !== routePaths.appRouteResult) {
      return;
    }

    clearPendingProtectedAction();

    try {
      const saved = saveRouteForLater(state);
      notifications.show({
        title: t('routeResult.actions.savedTitle', { defaultValue: 'Route saved' }),
        message: t('routeResult.actions.savedMessage', {
          defaultValue: '{{city}} route is now saved for later.',
          city: saved.city,
        }),
        color: 'forest',
      });
    } catch (error) {
      console.error('Failed to save route after auth', error);
      notifications.show({
        title: t('routeResult.actions.savedErrorTitle', { defaultValue: 'Could not save route' }),
        message: t('routeResult.actions.savedErrorMessage', {
          defaultValue: 'Try again in this browser session.',
        }),
        color: 'red',
      });
    }
  }, [state, t]);

  const handleSaveRoute = () => {
    if (!state) {
      return;
    }

    if (!hasAuthSession()) {
      startProtectedAction(navigate, {
        reason: 'save-route',
        redirectTo: routePaths.appRouteResult,
        redirectState: state,
        sourcePath: routePaths.appRouteResult,
      });
      return;
    }

    try {
      const saved = saveRouteForLater(state);
      notifications.show({
        title: t('routeResult.actions.savedTitle', { defaultValue: 'Route saved' }),
        message: t('routeResult.actions.savedMessage', {
          defaultValue: '{{city}} route is now saved for later.',
          city: saved.city,
        }),
        color: 'forest',
      });
    } catch (error) {
      console.error('Failed to save route', error);
      notifications.show({
        title: t('routeResult.actions.savedErrorTitle', { defaultValue: 'Could not save route' }),
        message: t('routeResult.actions.savedErrorMessage', {
          defaultValue: 'Try again in this browser session.',
        }),
        color: 'red',
      });
    }
  };

  const handleBookRouteSupport = () => {
    if (!state) {
      return;
    }

    startProtectedAction(navigate, {
      reason: 'booking',
      redirectTo: routePaths.appBookingDetails,
      redirectState: {
        seed: createRouteBookingSource(state),
        originPath: routePaths.appRouteResult,
      },
    });
  };

  const handleFindHotels = () => {
    if (!state) {
      return;
    }

    navigate(routePaths.appTripHotels, { state });
  };

  if (!route || !request) {
    return (
      <Container size="xl" py={{ base: 40, md: 64 }}>
        <StatePanel
          badge={t('routeResult.empty.badge')}
          title={t('routeResult.empty.title')}
          description={t('routeResult.empty.description')}
          actions={
            <>
              <Button component={Link} to={routePaths.appRouteBuilder} color="forest">
                {t('common.goToRoute')}
              </Button>
              <Button component={Link} to={routePaths.appExplore} variant="light" color="forest">
                {t('common.exploreMorePlaces')}
              </Button>
            </>
          }
        />
      </Container>
    );
  }

  const selectedStop = screenData?.selectedStop ?? null;

  return (
    <RouteResultScreen
      state={state as RoutePlanningResult}
      routeOverview={screenData?.routeOverview ?? null}
      travelTips={screenData?.travelTips ?? []}
      supportRecommendations={screenData?.supportRecommendations ?? { services: [], guides: [] }}
      assistantPrompts={screenData?.assistantPrompts ?? []}
      stopModels={screenData?.stopModels ?? []}
      selectedStopIndex={selectedStopIndex}
      selectedStop={selectedStop}
      routePoints={screenData?.routePoints ?? []}
      mapCenter={screenData?.mapCenter ?? null}
      mapZoom={screenData?.mapZoom ?? 9}
      mapDataFailed={mapDataFailed}
      visibleInterests={screenData?.visibleInterests ?? []}
      hiddenInterestCount={screenData?.hiddenInterestCount ?? 0}
      onSelectStop={setSelectedStopIndex}
      onSaveRoute={handleSaveRoute}
      onFindHotels={handleFindHotels}
      onBookRouteSupport={handleBookRouteSupport}
      onBookService={(service) =>
        startProtectedAction(navigate, {
          reason: 'service-request',
          redirectTo: routePaths.appBookingDetails,
          redirectState: {
            seed: createServiceBookingSource(service, service.kind),
            originPath: routePaths.appRouteResult,
          },
        })
      }
      onBookGuide={(guide) =>
        startProtectedAction(navigate, {
          reason: 'guide-request',
          redirectTo: routePaths.appBookingDetails,
          redirectState: {
            seed: createGuideBookingSource(guide),
            originPath: routePaths.appRouteResult,
          },
        })
      }
    />
  );
}
