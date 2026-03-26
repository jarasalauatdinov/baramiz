import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
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
import { getPlaces } from '../entities/place/api/placeApi';
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPlaceUrl,
  buildYandexMapsDirectionsUrl,
  buildYandexMapsPlaceUrl,
  getPlaceGeoPoint,
  type GeoPoint,
} from '../shared/lib/map/geo';
import type {
  GeneratedRoute,
  GeneratedRouteItem,
  Place,
  RouteDuration,
} from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';

interface RouteResultLocationState {
  route?: GeneratedRoute;
  request?: {
    interests?: string[];
    city?: string;
    duration?: RouteDuration;
  };
}

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
  const state = (location.state ?? null) as RouteResultLocationState | null;
  const route = state?.route ?? null;
  const request = state?.request;
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [mapDataFailed, setMapDataFailed] = useState(false);
  const [selectedStopIndex, setSelectedStopIndex] = useState(0);

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

  const durationLabels: Record<RouteDuration, string> = {
    '3_hours': t('routeGenerator.durations.3_hours.label', { defaultValue: '3 hours' }),
    half_day: t('routeGenerator.durations.half_day.label', { defaultValue: 'Half day' }),
    '1_day': t('routeGenerator.durations.1_day.label', { defaultValue: '1 day' }),
  };

  const selectedInterests = useMemo(
    () =>
      (request?.interests ?? [])
        .map((interest) => formatCategoryLabel(interest, t))
        .filter(Boolean),
    [request?.interests, t],
  );

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
        image: item.place.image || matched?.imageUrl,
        description: matched?.description ?? item.reason,
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
    () =>
      stopModels
        .map((stop) => stop.point)
        .filter((point): point is GeoPoint => Boolean(point)),
    [stopModels],
  );

  const googleDirectionsUrl = useMemo(
    () => buildGoogleMapsDirectionsUrl(routePoints),
    [routePoints],
  );

  const yandexDirectionsUrl = useMemo(
    () => buildYandexMapsDirectionsUrl(routePoints),
    [routePoints],
  );

  const mapCenter: GeoPoint | null = selectedStop?.point ?? routePoints[0] ?? null;
  const mapZoom = selectedStop?.point ? 11 : 9;

  const startNavigationTo = useMemo(() => {
    if (!route) {
      return '/map?mode=route';
    }

    const params = new URLSearchParams();
    params.set('mode', 'route');
    params.set('city', route.city);

    const routeIds = route.items
      .map((item) => String(item.place.id).trim())
      .filter(Boolean);

    if (routeIds.length > 0) {
      params.set('route', routeIds.join(','));
    }

    return `/map?${params.toString()}`;
  }, [route]);

  const handleShareRoute = async () => {
    if (!route) {
      return;
    }

    const summary = `${t('routeResult.summary.title', {
      city: route.city,
      defaultValue: `Your trip - ${route.city}`,
    })}
${t('routeResult.stats.stops')}: ${route.items.length}
${t('routeResult.stats.totalTime')}: ${formatMinutesLabel(route.totalMinutes, t)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t('common.appName')} - ${route.city}`,
          text: summary,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(summary);
      notifications.show({
        color: 'forest',
        message: t('routeResult.actions.shareSuccess', {
          defaultValue: 'Route summary copied to clipboard.',
        }),
      });
    } catch (error) {
      console.error('Failed to share route summary', error);
      notifications.show({
        color: 'red',
        message: t('routeResult.actions.shareFailed', {
          defaultValue: 'Could not share route right now.',
        }),
      });
    }
  };

  if (!route) {
    return (
      <Container size="xl" py={{ base: 40, md: 64 }}>
        <Paper withBorder radius="30px" p={{ base: 'xl', md: '2rem' }} bg="white">
          <Stack gap="lg" align="flex-start">
            <Badge color="gray" variant="light" radius="xl">
              {t('routeResult.empty.badge')}
            </Badge>
            <div>
              <Title order={2}>{t('routeResult.empty.title')}</Title>
              <Text mt="sm" c="dimmed" maw={640}>
                {t('routeResult.empty.description')}
              </Text>
            </div>
            <Group gap="sm">
              <Button component={Link} to="/route-generator" color="forest">
                {t('common.goToRoute')}
              </Button>
              <Button component={Link} to="/places" variant="light" color="forest">
                {t('common.exploreMorePlaces')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py={{ base: 34, md: 56 }}>
      <Paper
        radius="34px"
        p={{ base: 'xl', md: '2.1rem' }}
        mb="lg"
        style={{
          border: '1px solid rgba(23, 49, 42, 0.08)',
          background:
            'linear-gradient(140deg, rgba(255,252,245,0.98), rgba(235,240,229,0.94) 60%, rgba(217,171,98,0.14))',
        }}
      >
        <Stack gap="md">
          <Group gap="xs" wrap="wrap">
            <Badge color="forest" variant="light" radius="xl">
              {t('routeResult.hero.badge')}
            </Badge>
            <Badge color="sand" variant="light" radius="xl">
              {t('routeResult.hero.stopsBadge', { count: stopModels.length })}
            </Badge>
            {selectedInterests.length > 0 ? (
              <Badge color="sun" variant="light" c="#5a420b" radius="xl">
                {selectedInterests.join(', ')}
              </Badge>
            ) : null}
          </Group>

          <Title order={1}>
            {t('routeResult.summary.title', {
              city: route.city,
              defaultValue: `Your trip - ${route.city}`,
            })}
          </Title>
          <Text c="dimmed" size="lg" maw={840} style={{ lineHeight: 1.75 }}>
            {t('routeResult.summary.description', {
              defaultValue:
                'A practical route plan you can review quickly, navigate immediately, and continue exploring across places, services, and destination pages.',
            })}
          </Text>

          <SimpleGrid cols={{ base: 2, md: 3 }} spacing="sm">
            <Paper withBorder p="sm" radius="18px" bg="white">
              <Text size="xs" c="dimmed">
                {t('routeResult.stats.destination')}
              </Text>
              <Text fw={700} mt={4}>
                {route.city}
              </Text>
            </Paper>
            <Paper withBorder p="sm" radius="18px" bg="white">
              <Text size="xs" c="dimmed">
                {t('routeResult.stats.duration', { defaultValue: t('common.duration') })}
              </Text>
              <Text fw={700} mt={4}>
                {durationLabels[route.duration] ?? route.duration}
              </Text>
            </Paper>
            <Paper withBorder p="sm" radius="18px" bg="white">
              <Text size="xs" c="dimmed">
                {t('routeResult.stats.totalTime')}
              </Text>
              <Text fw={700} mt={4}>
                {formatMinutesLabel(route.totalMinutes, t)}
              </Text>
            </Paper>
          </SimpleGrid>

          <Group gap="sm" wrap="wrap">
            <Button component={Link} to={startNavigationTo} color="forest">
              {t('routeResult.actions.startNavigation', { defaultValue: 'Start navigation' })}
            </Button>
            <Button
              variant="light"
              color="forest"
              disabled={!googleDirectionsUrl}
              onClick={() => openExternalLink(googleDirectionsUrl)}
            >
              {t('routeResult.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
            </Button>
            <Button
              variant="light"
              disabled={!yandexDirectionsUrl}
              onClick={() => openExternalLink(yandexDirectionsUrl)}
            >
              {t('routeResult.actions.openYandex', { defaultValue: 'Open in Yandex Maps' })}
            </Button>
            <Button variant="subtle" color="forest" onClick={() => { void handleShareRoute(); }}>
              {t('routeResult.actions.share', { defaultValue: 'Share route' })}
            </Button>
          </Group>
        </Stack>
      </Paper>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        <Paper withBorder radius="28px" p={{ base: 'md', md: 'lg' }} bg="white">
          <Stack gap="md">
            <div>
              <Title order={3}>
                {t('routeResult.plan.title', { defaultValue: 'Route plan' })}
              </Title>
              <Text c="dimmed" mt={6}>
                {t('routeResult.plan.description', {
                  defaultValue:
                    'Review your stops, pick a point, and the map will focus on that location.',
                })}
              </Text>
            </div>

            {stopModels.length > 0 ? (
              <Stack gap="sm">
                {stopModels.map((stop, index) => {
                  const selected = index === selectedStopIndex;
                  const placesQuery = new URLSearchParams();
                  placesQuery.set('city', stop.city);
                  placesQuery.set('category', stop.category);

                  return (
                    <Paper
                      key={`${stop.id}-${index}`}
                      withBorder
                      radius="22px"
                      p="sm"
                      style={{
                        borderColor: selected
                          ? 'rgba(229,182,47,0.44)'
                          : 'rgba(23,49,42,0.08)',
                        background: selected ? '#fff9ea' : '#fff',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedStopIndex(index)}
                    >
                      <Group align="flex-start" wrap="nowrap">
                        <ThemeIcon
                          size={34}
                          radius="xl"
                          color={selected ? 'sun' : 'forest'}
                          c={selected ? '#2d2208' : undefined}
                          variant="filled"
                        >
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
                            </Stack>
                          </SimpleGrid>

                          <Group gap="xs" mt="sm" wrap="wrap">
                            <Button
                              size="xs"
                              variant={selected ? 'filled' : 'light'}
                              color={selected ? 'sun' : 'forest'}
                              c={selected ? '#2d2208' : undefined}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedStopIndex(index);
                              }}
                            >
                              {t('routeResult.plan.focusMap', {
                                defaultValue: 'Focus on map',
                              })}
                            </Button>
                            <Button
                              size="xs"
                              variant="subtle"
                              component={Link}
                              to={`/places?${placesQuery.toString()}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              {t('routeResult.plan.viewDetails', {
                                defaultValue: 'View details',
                              })}
                            </Button>
                            {stop.point ? (
                              <Button
                                size="xs"
                                variant="subtle"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openExternalLink(buildGoogleMapsPlaceUrl(stop.point as GeoPoint));
                                }}
                              >
                                {t('routeResult.plan.navigate', {
                                  defaultValue: 'Navigate',
                                })}
                              </Button>
                            ) : null}
                          </Group>
                        </Box>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            ) : (
              <Paper withBorder p="md" radius="18px">
                <Text c="dimmed">
                  {t('routeResult.plan.empty', {
                    defaultValue: 'No stops are available yet.',
                  })}
                </Text>
              </Paper>
            )}
          </Stack>
        </Paper>

        <Paper withBorder radius="28px" p={{ base: 'md', md: 'lg' }} bg="white">
          <Stack gap="md">
            <div>
              <Title order={3}>
                {t('routeResult.mapPanel.title', { defaultValue: 'Map and navigation' })}
              </Title>
              <Text c="dimmed" mt={6}>
                {t('routeResult.mapPanel.description', {
                  defaultValue:
                    'Markers show your route stops. Select a place from the plan to focus the map.',
                })}
              </Text>
            </div>

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
              <Paper withBorder p="md" radius="16px" bg="var(--surface-soft)">
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
              <Paper withBorder p="md" radius="18px" bg="var(--surface-soft)">
                <Stack gap={8}>
                  <Text fw={700}>
                    {t('routeResult.mapPanel.selectedTitle', {
                      defaultValue: 'Selected stop',
                    })}
                  </Text>
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
                      onClick={() =>
                        openExternalLink(
                          selectedStop.point
                            ? buildGoogleMapsPlaceUrl(selectedStop.point)
                            : null,
                        )
                      }
                    >
                      {t('routeResult.actions.openGoogle', {
                        defaultValue: 'Open in Google Maps',
                      })}
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      disabled={!selectedStop.point}
                      onClick={() =>
                        openExternalLink(
                          selectedStop.point
                            ? buildYandexMapsPlaceUrl(selectedStop.point)
                            : null,
                        )
                      }
                    >
                      {t('routeResult.actions.openYandex', {
                        defaultValue: 'Open in Yandex Maps',
                      })}
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Paper>
      </SimpleGrid>

      <Group gap="sm" mt="xl" wrap="wrap">
        <Button component={Link} to="/route-generator" color="forest">
          {t('common.generateAnother')}
        </Button>
        <Button component={Link} to="/places" variant="light" color="forest">
          {t('common.exploreMorePlaces')}
        </Button>
        <Button component={Link} to="/" variant="subtle">
          {t('routeResult.actions.startOver', { defaultValue: 'Start over' })}
        </Button>
      </Group>
    </Container>
  );
}
