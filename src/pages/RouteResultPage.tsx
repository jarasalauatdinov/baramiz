import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DestinationImage } from '../components/DestinationImage';
import { GuideCard } from '../components/GuideCard';
import { StatePanel } from '../components/layout/StatePanel';
import { ServiceCard } from '../components/ServiceCard';
import { getPlaces } from '../entities/place/api/placeApi';
import {
  getCurrentRouteResult,
  setCurrentRouteResult,
} from '../features/route-planning/model/currentRoute';
import {
  buildRouteOverviewContent,
  buildRouteTravelTips,
  getRouteSupportRecommendations,
} from '../features/route-planning/model/resultExperience';
import { saveRouteForLater } from '../features/route-planning/model/savedRoutes';
import { getRouteResultAssistantPrompts } from '../features/travel-assistant/model/promptSuggestions';
import { TravelAssistantPanel } from '../features/travel-assistant/ui/TravelAssistantPanel';
import {
  getBudgetLevelLabel,
  getDurationLabel,
  getTransportPreferenceLabel,
  getTravelPaceLabel,
  getTripStyleLabel,
} from '../features/route-planning/model/options';
import type { RoutePlanningResult } from '../features/route-planning/model/types';
import { RouteResultPanel } from '../features/route-planning/ui/RouteResultPanel';
import { RouteTravelTips } from '../features/route-planning/ui/RouteTravelTips';
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPlaceUrl,
  buildYandexMapsDirectionsUrl,
  buildYandexMapsPlaceUrl,
  getPlaceGeoPoint,
  type GeoPoint,
} from '../shared/lib/map/geo';
import type { GeneratedRouteItem, Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import { routePaths } from '../router/paths';

interface RouteStopViewModel {
  id: string;
  item: GeneratedRouteItem;
  place: Place | null;
  point: GeoPoint | null;
  name: string;
  city: string;
  category: string;
  image?: string;
  description: string;
  reason: string;
}

interface FlyToProps {
  center: LatLngExpression;
  zoom: number;
}

function FlyTo({ center, zoom }: FlyToProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.75 });
  }, [center, map, zoom]);

  return null;
}

const openExternalLink = (url: string | null) => {
  if (!url) {
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

export function RouteResultPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigationState = (location.state ?? null) as RoutePlanningResult | null;
  const persistedState = useMemo(() => getCurrentRouteResult(), []);
  const state = navigationState ?? persistedState;
  const route = state?.route ?? null;
  const request = state?.request ?? null;
  const source = state?.source ?? null;
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

  const stopModels = useMemo<RouteStopViewModel[]>(() => {
    if (!route) {
      return [];
    }

    return route.items.map((item) => {
      const placeId = String(item.place.id);
      const normalizedName = item.place.name.toLowerCase();
      const normalizedCity = item.place.city.toLowerCase();

      const matched =
        allPlaces.find((place) => String(place.id) === placeId) ??
        allPlaces.find(
          (place) =>
            place.name.toLowerCase() === normalizedName &&
            (place.city ?? '').toLowerCase() === normalizedCity,
        ) ??
        null;

      return {
        id: placeId,
        item,
        place: matched,
        point: matched ? getPlaceGeoPoint(matched) : null,
        name: item.place.name,
        city: item.place.city,
        category: item.place.category,
        image: item.place.imageUrl || matched?.imageUrl,
        description: matched?.description ?? item.reason,
        reason: item.reason,
      };
    });
  }, [allPlaces, route]);

  useEffect(() => {
    if (selectedStopIndex >= stopModels.length) {
      setSelectedStopIndex(0);
    }
  }, [selectedStopIndex, stopModels.length]);

  const selectedStop = stopModels[selectedStopIndex] ?? null;

  const routePoints = useMemo(
    () => stopModels.map((stop) => stop.point).filter((point): point is GeoPoint => Boolean(point)),
    [stopModels],
  );

  const mapCenter: GeoPoint | null = selectedStop?.point ?? routePoints[0] ?? null;
  const mapZoom = selectedStop?.point ? 11 : 9;
  const googleRouteUrl =
    routePoints.length > 1
      ? buildGoogleMapsDirectionsUrl(routePoints)
      : selectedStop?.point
        ? buildGoogleMapsPlaceUrl(selectedStop.point)
        : null;
  const yandexRouteUrl =
    routePoints.length > 1
      ? buildYandexMapsDirectionsUrl(routePoints)
      : selectedStop?.point
        ? buildYandexMapsPlaceUrl(selectedStop.point)
        : null;

  const routeOverview = useMemo(
    () => (route && request ? buildRouteOverviewContent(request, route, t) : null),
    [request, route, t],
  );
  const travelTips = useMemo(
    () => (route && request ? buildRouteTravelTips(request, route, t) : []),
    [request, route, t],
  );
  const supportRecommendations = useMemo(
    () =>
      route && request
        ? getRouteSupportRecommendations(request, route)
        : { services: [], guides: [] },
    [request, route],
  );
  const assistantPrompts = useMemo(
    () =>
      route && request
        ? getRouteResultAssistantPrompts(t, {
            city: route.city,
            stopName: selectedStop?.name,
            interest: request.interests[0],
          })
        : [],
    [request, route, selectedStop?.name, t],
  );

  const handleSaveRoute = () => {
    if (!state) {
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

  return (
    <Container size="xl" py={{ base: 18, md: 28 }}>
      <Paper withBorder radius="30px" p={{ base: 'xl', md: '2rem' }} bg="white" mb="lg">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Stack gap="sm" maw={760}>
              <Badge
                color={source === 'backend' ? 'forest' : 'sun'}
                variant="light"
                radius="xl"
                w="fit-content"
                c={source === 'backend' ? undefined : '#5a420b'}
              >
                {source === 'backend'
                  ? t('routeResult.summary.sourceBackend', { defaultValue: 'Planned with live route data' })
                  : t('routeResult.summary.sourceFallback', { defaultValue: 'Planned with live place fallback' })}
              </Badge>
              <Title order={1} style={{ lineHeight: 1.08 }}>
                {routeOverview?.title ?? t('routeResult.summary.title', { city: route.city })}
              </Title>
              <Text c="dimmed" style={{ lineHeight: 1.72 }}>
                {routeOverview?.description ?? t('routeResult.summary.description')}
              </Text>
              {routeOverview ? (
                <Stack gap={6}>
                  {routeOverview.highlights.map((highlight) => (
                    <Text key={highlight} size="sm" c="dimmed">
                      • {highlight}
                    </Text>
                  ))}
                </Stack>
              ) : null}
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="sm" w={{ base: '100%', lg: 'auto' }}>
              <Button color="sun" c="#2d2208" disabled={!googleRouteUrl} onClick={() => openExternalLink(googleRouteUrl)} fullWidth>
                {t('routeResult.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
              </Button>
              <Button variant="light" color="forest" disabled={!yandexRouteUrl} onClick={() => openExternalLink(yandexRouteUrl)} fullWidth>
                {t('routeResult.actions.openYandex', { defaultValue: 'Open in Yandex Maps' })}
              </Button>
              <Button variant="default" onClick={handleSaveRoute} fullWidth>
                {t('routeResult.actions.saveForLater', { defaultValue: 'Save for later' })}
              </Button>
              <Button component={Link} to={routePaths.appRouteBuilder} variant="default" fullWidth>
                {t('common.generateAnother')}
              </Button>
            </SimpleGrid>
          </Group>

          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            <Paper withBorder p="md" radius="18px" bg="var(--mantine-color-gray-0)">
              <Text size="sm" c="dimmed">{t('routeResult.stats.destination')}</Text>
              <Text fw={800} mt={6}>{route.city}</Text>
            </Paper>
            <Paper withBorder p="md" radius="18px" bg="var(--mantine-color-gray-0)">
              <Text size="sm" c="dimmed">{t('routeResult.stats.stops')}</Text>
              <Text fw={800} mt={6}>{stopModels.length}</Text>
            </Paper>
            <Paper withBorder p="md" radius="18px" bg="var(--mantine-color-gray-0)">
              <Text size="sm" c="dimmed">{t('routeResult.stats.duration')}</Text>
              <Text fw={800} mt={6}>{getDurationLabel(request.duration, t)}</Text>
            </Paper>
            <Paper withBorder p="md" radius="18px" bg="var(--mantine-color-gray-0)">
              <Text size="sm" c="dimmed">{t('routeResult.stats.totalTime')}</Text>
              <Text fw={800} mt={6}>{formatMinutesLabel(route.totalMinutes, t)}</Text>
            </Paper>
          </SimpleGrid>

          <Group gap="xs" wrap="wrap">
            <Badge color="forest" variant="light" radius="xl">
              {getTripStyleLabel(request.tripStyle, t)}
            </Badge>
            <Badge color="sun" variant="light" radius="xl" c="#5a420b">
              {getTransportPreferenceLabel(request.transportPreference, t)}
            </Badge>
            <Badge color="gray" variant="light" radius="xl">
              {getBudgetLevelLabel(request.budgetLevel, t)}
            </Badge>
            <Badge color="gray" variant="light" radius="xl">
              {getTravelPaceLabel(request.travelPace, t)}
            </Badge>
            {request.interests.map((interest) => (
              <Badge key={interest} color="sun" variant="light" radius="xl" c="#5a420b">
                {formatCategoryLabel(interest, t)}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <RouteResultPanel
          title={t('routeResult.plan.title', { defaultValue: 'Route plan' })}
          description={t('routeResult.plan.description', {
            defaultValue: 'Tap a stop to focus it on the map.',
          })}
        >
          {stopModels.length > 0 ? (
            <Stack gap="sm">
              {stopModels.map((stop, index) => {
                const selected = index === selectedStopIndex;
                return (
                  <Paper
                    key={`${stop.id}-${index}`}
                    withBorder
                    radius="22px"
                    p="sm"
                    style={{
                      borderColor: selected ? 'rgba(229,182,47,0.44)' : 'rgba(23,49,42,0.08)',
                      background: selected ? '#fff9ea' : '#fff',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedStopIndex(index)}
                  >
                    <Group align="flex-start" wrap="nowrap">
                      <ThemeIcon size={34} radius="xl" color={selected ? 'sun' : 'forest'} c={selected ? '#2d2208' : undefined} variant="filled">
                        {index + 1}
                      </ThemeIcon>

                      <Box style={{ flex: 1 }}>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                          <DestinationImage
                            src={stop.image}
                            name={stop.name}
                            city={stop.city}
                            category={stop.category}
                            height={92}
                            radius={16}
                          />
                          <Stack gap={6}>
                            <Group gap={6} wrap="wrap">
                              <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                                {stop.item.time}
                              </Badge>
                              <Badge color="forest" variant="light" radius="xl">
                                {formatCategoryLabel(stop.category, t)}
                              </Badge>
                              <Badge color="gray" variant="light" radius="xl">
                                {formatMinutesLabel(stop.item.estimatedDurationMinutes, t)}
                              </Badge>
                            </Group>
                            <Text fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                              {stop.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {stop.city}
                            </Text>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                              {stop.description}
                            </Text>
                            <Text size="sm" fw={600} style={{ lineHeight: 1.6 }}>
                              {t('routeResult.plan.whyThisFits', {
                                defaultValue: 'Why this fits: {{reason}}',
                                reason: stop.reason,
                              })}
                            </Text>
                          </Stack>
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs" mt="sm">
                          <Button
                            size="xs"
                            variant={selected ? 'filled' : 'light'}
                            color={selected ? 'sun' : 'forest'}
                            c={selected ? '#2d2208' : undefined}
                            fullWidth
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedStopIndex(index);
                            }}
                          >
                            {t('routeResult.plan.focusMap', { defaultValue: 'Focus on map' })}
                          </Button>
                          <Button
                            size="xs"
                            variant="subtle"
                            component={Link}
                            to={routePaths.appPlaceDetails(String(stop.item.place.id))}
                            fullWidth
                            onClick={(event) => event.stopPropagation()}
                          >
                            {t('routeResult.plan.viewDetails', { defaultValue: 'View details' })}
                          </Button>
                          {stop.point ? (
                            <Button
                              size="xs"
                              variant="subtle"
                              fullWidth
                              onClick={(event) => {
                                event.stopPropagation();
                                openExternalLink(buildGoogleMapsPlaceUrl(stop.point as GeoPoint));
                              }}
                            >
                              {t('routeResult.plan.navigate', { defaultValue: 'Navigate' })}
                            </Button>
                          ) : null}
                        </SimpleGrid>
                      </Box>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <Paper withBorder p="md" radius="18px">
              <Text c="dimmed">
                {t('routeResult.plan.empty', { defaultValue: 'No stops are available yet.' })}
              </Text>
            </Paper>
          )}
        </RouteResultPanel>

        <RouteResultPanel
          title={t('routeResult.mapPanel.title', { defaultValue: 'Map and navigation' })}
          description={t('routeResult.mapPanel.description', {
            defaultValue: 'Map follows the selected route stop.',
          })}
        >
          <Stack gap="md">
            {routePoints.length > 0 && mapCenter ? (
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                style={{ height: 420, width: '100%', borderRadius: 18, overflow: 'hidden' }}
                scrollWheelZoom
              >
                <FlyTo center={[mapCenter.lat, mapCenter.lng]} zoom={mapZoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {routePoints.length > 1 ? (
                  <Polyline
                    positions={routePoints.map((point) => [point.lat, point.lng])}
                    pathOptions={{ color: '#2f5a45', weight: 4, opacity: 0.82 }}
                  />
                ) : null}

                {stopModels.map((stop, index) =>
                  stop.point ? (
                    <CircleMarker
                      key={`${stop.id}-map-${index}`}
                      center={[stop.point.lat, stop.point.lng]}
                      radius={index === selectedStopIndex ? 10 : 8}
                      color={index === selectedStopIndex ? '#e5b62f' : '#2f5a45'}
                      fillColor={index === selectedStopIndex ? '#e5b62f' : '#2f5a45'}
                      fillOpacity={0.9}
                      eventHandlers={{
                        click: () => setSelectedStopIndex(index),
                      }}
                    >
                      <Popup>
                        <Text fw={700}>{stop.name}</Text>
                        <Text size="sm" c="dimmed">
                          {stop.city} - {formatCategoryLabel(stop.category, t)}
                        </Text>
                      </Popup>
                    </CircleMarker>
                  ) : null,
                )}
              </MapContainer>
            ) : (
              <Paper withBorder p="md" radius="16px" bg="#fffdf8">
                <Text c="dimmed">
                  {mapDataFailed
                    ? t('routeResult.map.error', {
                        defaultValue:
                          'Map preview is not available because place data could not be loaded right now.',
                      })
                    : t('routeResult.map.empty', {
                        defaultValue:
                          'No coordinates are available for this route yet. You can still use the route plan.',
                      })}
                </Text>
              </Paper>
            )}

            {selectedStop ? (
              <Paper withBorder p="md" radius="18px" bg="#fffdf8">
                <Stack gap={8}>
                  <Text fw={700}>{t('routeResult.mapPanel.selectedTitle', { defaultValue: 'Selected stop' })}</Text>
                  <Text>{selectedStop.name}</Text>
                  <Text size="sm" c="dimmed">
                    {selectedStop.city} - {formatCategoryLabel(selectedStop.category, t)}
                  </Text>
                  <Group gap="xs" wrap="wrap">
                    <Button
                      size="xs"
                      variant="light"
                      color="forest"
                      disabled={!selectedStop.point}
                      onClick={() => openExternalLink(selectedStop.point ? buildGoogleMapsPlaceUrl(selectedStop.point as GeoPoint) : null)}
                    >
                      {t('routeResult.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      disabled={!selectedStop.point}
                      onClick={() => openExternalLink(selectedStop.point ? buildYandexMapsPlaceUrl(selectedStop.point as GeoPoint) : null)}
                    >
                      {t('routeResult.actions.openYandex', { defaultValue: 'Open in Yandex Maps' })}
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </RouteResultPanel>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg" mt="lg">
        <RouteResultPanel
          title={t('routeResult.tips.sectionTitle', { defaultValue: 'Travel tips for this route' })}
          description={t('routeResult.tips.sectionDescription', {
            defaultValue: 'Short practical notes for this route.',
          })}
        >
          <RouteTravelTips tips={travelTips} />
        </RouteResultPanel>

        <RouteResultPanel
          title={t('routeResult.support.title', { defaultValue: 'Useful support around this route' })}
          description={t('routeResult.support.description', {
            defaultValue: 'Optional services and guides for this route.',
          })}
        >
          <Stack gap="md">
            {supportRecommendations.services.length > 0 ? (
              <Stack gap="sm">
                <Text fw={700}>{t('routeResult.support.servicesTitle', { defaultValue: 'Recommended services' })}</Text>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  {supportRecommendations.services.map((service) => (
                    <ServiceCard key={service.id} item={service} kind={service.kind} />
                  ))}
                </SimpleGrid>
              </Stack>
            ) : null}

            {supportRecommendations.services.length > 0 && supportRecommendations.guides.length > 0 ? (
              <Divider />
            ) : null}

            {supportRecommendations.guides.length > 0 ? (
              <Stack gap="sm">
                <Text fw={700}>{t('routeResult.support.guidesTitle', { defaultValue: 'Guides who fit this route' })}</Text>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  {supportRecommendations.guides.map((guide) => (
                    <GuideCard key={guide.id} guide={guide} />
                  ))}
                </SimpleGrid>
              </Stack>
            ) : null}

            {supportRecommendations.services.length === 0 && supportRecommendations.guides.length === 0 ? (
              <Text c="dimmed">
                {t('routeResult.support.empty', {
                  defaultValue: 'Extra route support is not available right now, but you can still continue with places and map navigation.',
                })}
              </Text>
            ) : null}
          </Stack>
        </RouteResultPanel>
      </SimpleGrid>

      <Box mt="lg">
        <TravelAssistantPanel
          title={t('routeResult.assistant.title', {
            defaultValue: 'Need to adjust this route?',
          })}
          description={t('routeResult.assistant.description', {
            defaultValue:
              'Ask to shorten, reorder, or improve this route. Sent only to Baramiz backend.',
          })}
          placeholder={t('routeResult.assistant.placeholder', {
            defaultValue: 'Ask how to shorten, reorder, or improve this route...',
          })}
          emptyHint={t('routeResult.assistant.emptyHint', {
            defaultValue:
              'This works best for quick route questions after the plan has already been generated.',
          })}
          suggestions={assistantPrompts}
        />
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 5 }} spacing="sm" mt="xl">
        <Button component={Link} to={routePaths.appRouteBuilder} color="forest" fullWidth>
          {t('common.generateAnother')}
        </Button>
        <Button variant="default" onClick={handleSaveRoute} fullWidth>
          {t('routeResult.actions.saveForLater', { defaultValue: 'Save for later' })}
        </Button>
        <Button component={Link} to={routePaths.appExplore} variant="light" color="forest" fullWidth>
          {t('common.exploreMorePlaces')}
        </Button>
        <Button component={Link} to={routePaths.appServices} variant="light" fullWidth>
          {t('routeResult.actions.exploreServices', { defaultValue: 'Explore services' })}
        </Button>
        <Button component={Link} to={routePaths.appHome} variant="subtle" fullWidth>
          {t('routeResult.actions.startOver', { defaultValue: 'Start over' })}
        </Button>
      </SimpleGrid>
    </Container>
  );
}


