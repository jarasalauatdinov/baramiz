import { useEffect, useMemo } from 'react';
import { Badge, Button, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HotelCard, getRecommendedHotelsForRoute } from '../entities/hotel';
import { createHotelBookingSource } from '../features/booking/model/bookingDraft';
import { startProtectedAction } from '../features/auth/lib/startProtectedAction';
import { getCurrentRouteResult, setCurrentRouteResult } from '../features/route-planning/model/currentRoute';
import { getBudgetLevelLabel, getTripStyleLabel } from '../features/route-planning/model/options';
import type { RoutePlanningResult } from '../features/route-planning/model/types';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import { StatePanel } from '../shared/ui';

export function TripHotelsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = (location.state ?? null) as RoutePlanningResult | null;
  const routeState = navigationState ?? getCurrentRouteResult();

  useEffect(() => {
    if (navigationState) {
      setCurrentRouteResult(navigationState);
    }
  }, [navigationState]);

  const hotels = useMemo(
    () => (routeState ? getRecommendedHotelsForRoute(routeState, 4) : []),
    [routeState],
  );

  const handleBookHotel = (slug: string) => {
    const hotel = hotels.find((item) => item.slug === slug);

    if (!hotel) {
      return;
    }

    startProtectedAction(navigate, {
      reason: 'booking',
      redirectTo: routePaths.appBookingDetails,
      redirectState: {
        seed: createHotelBookingSource(hotel),
        originPath: routePaths.appTripHotels,
      },
      sourcePath: routePaths.appTripHotels,
    });
  };

  if (!routeState) {
    return (
      <Container size="lg" py={{ base: 20, md: 28 }}>
        <StatePanel
          badge={t('pages.hotels.list.badge', { defaultValue: 'Trip stays' })}
          title={t('pages.hotels.list.emptyTitle', { defaultValue: 'Generate a route first' })}
          description={t('pages.hotels.list.emptyDescription', {
            defaultValue: 'Hotels in Baramiz are suggested after a route is planned, so the stay matches the trip city and pace.',
          })}
          actions={
            <>
              <Button component={Link} to={routePaths.appRouteBuilder} color="sun" c="#2d2208">
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

  return (
    <Container size="lg" py={{ base: 16, md: 24 }}>
      <Stack gap="lg">
        <Paper
          withBorder
          radius={publicUi.radius.card}
          p="lg"
          bg={publicUi.background.surfaceWarm}
          style={{ borderColor: publicUi.border.default, boxShadow: publicUi.shadow.cardSoft }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Stack gap={8} maw={560}>
                <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                  {t('pages.hotels.list.badge', { defaultValue: 'Trip stays' })}
                </Badge>
                <Title order={1} style={{ lineHeight: 1.1 }}>
                  {t('pages.hotels.list.title', {
                    defaultValue: 'Hotels for your {{city}} route',
                    city: routeState.route.city,
                  })}
                </Title>
                <Text c="dimmed" style={{ lineHeight: 1.65 }}>
                  {t('pages.hotels.list.description', {
                    defaultValue:
                      'A short curated list matched to your trip city, pace, and budget so the stay feels connected to the route.',
                  })}
                </Text>
              </Stack>

              <Button component={Link} to={routePaths.appRouteResult} variant="light" color="forest" radius="xl">
                {t('pages.booking.common.backToBrowse')}
              </Button>
            </Group>

            <Group gap="xs" wrap="wrap">
              <Badge color="forest" variant="light" radius="xl">
                {routeState.route.city}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {getTripStyleLabel(routeState.request.tripStyle, t)}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {getBudgetLevelLabel(routeState.request.budgetLevel, t)}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {hotels.length} {t('pages.hotels.list.hotelsLabel', { defaultValue: 'hotels' })}
              </Badge>
            </Group>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              detailsTo={routePaths.appHotelDetails(hotel.slug)}
              onBook={() => handleBookHotel(hotel.slug)}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
