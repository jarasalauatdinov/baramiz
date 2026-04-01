import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
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
import { getPlaces } from '../entities/place/api/placeApi';
import type { Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPlaceUrl,
  buildYandexMapsDirectionsUrl,
  buildYandexMapsPlaceUrl,
  calculateRouteDistanceKm,
  estimateTravelMinutes,
  getPlaceGeoPoint,
  type GeoPoint,
} from '../shared/lib/map/geo';
import { publicUi } from '../shared/config/publicUi';

type MapMode = 'explore' | 'route';

const DEFAULT_CENTER: GeoPoint = { lat: 42.4602, lng: 59.6166 };
const DEFAULT_ZOOM = 7;
const ROUTE_ZOOM = 10;

interface MapPlaceEntry {
  place: Place;
  point: GeoPoint;
}

interface FitCenterProps {
  center: LatLngExpression;
  zoom: number;
}

function FitCenter({ center, zoom }: FitCenterProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [center, map, zoom]);

  return null;
}

const stringifyPlaceId = (place: Place): string => String(place.id);

const openExternalLink = (url: string | null) => {
  if (!url) {
    return;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
};

export function MapPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city')?.trim() ?? '';
  const queryCategory = searchParams.get('category')?.trim().toLowerCase() ?? '';
  const queryMode = searchParams.get('mode')?.trim();
  const queryRouteIds = useMemo(
    () =>
      (searchParams.get('route') ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    [searchParams],
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [mode, setMode] = useState<MapMode>(queryMode === 'route' ? 'route' : 'explore');
  const [search] = useState('');
  const [city, setCity] = useState(queryCity || 'all');
  const [category, setCategory] = useState(queryCategory || 'all');
  const [featuredOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(queryRouteIds);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);

  useEffect(() => {
    if (queryCity) {
      setCity(queryCity);
    }
    if (queryCategory) {
      setCategory(queryCategory);
    }
    if (queryMode === 'route' || queryMode === 'explore') {
      setMode(queryMode);
    }
    if (queryRouteIds.length > 0) {
      setSelectedIds((current) => {
        const same =
          current.length === queryRouteIds.length &&
          current.every((id, index) => id === queryRouteIds[index]);
        return same ? current : queryRouteIds;
      });
      setMode('route');
    }
  }, [queryCategory, queryCity, queryMode, queryRouteIds]);

  useEffect(() => {
    if (places.length === 0 || queryRouteIds.length === 0) {
      return;
    }

    const valid = queryRouteIds.filter((id) =>
      places.some((place) => stringifyPlaceId(place) === id),
    );

    if (valid.length > 0) {
      setSelectedIds((current) => {
        const same =
          current.length === valid.length &&
          current.every((id, index) => id === valid[index]);
        return same ? current : valid;
      });
      setMode('route');
    }
  }, [places, queryRouteIds]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const placesResult = await Promise.allSettled([getPlaces()]);

      if (!active) {
        return;
      }

      if (placesResult[0].status === 'fulfilled') {
        setPlaces(placesResult[0].value);
      } else {
        console.error('Failed to load places for map page', placesResult[0].reason);
      }

      if (placesResult[0].status === 'rejected') {
        setHasError(true);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCity = city === 'all' || place.city === city;
      const placeCategory = place.category.toLowerCase();
      const matchesCategory = category === 'all' || placeCategory === category.toLowerCase();
      const matchesFeatured = !featuredOnly || place.featured;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        place.name.toLowerCase().includes(normalizedSearch) ||
        (place.description ?? '').toLowerCase().includes(normalizedSearch);

      return matchesCity && matchesCategory && matchesFeatured && matchesSearch;
    });
  }, [category, city, featuredOnly, places, search]);

  const filteredMapPlaces = useMemo<MapPlaceEntry[]>(
    () =>
      filteredPlaces
        .map((place) => {
          const point = getPlaceGeoPoint(place);
          return point ? { place, point } : null;
        })
        .filter((entry): entry is MapPlaceEntry => Boolean(entry)),
    [filteredPlaces],
  );

  const selectedMapPlaces = useMemo<MapPlaceEntry[]>(
    () =>
      selectedIds
        .map((id) => {
          const place = places.find((item) => stringifyPlaceId(item) === id);
          if (!place) {
            return null;
          }

          const point = getPlaceGeoPoint(place);
          return point ? { place, point } : null;
        })
        .filter((entry): entry is MapPlaceEntry => Boolean(entry)),
    [places, selectedIds],
  );

  const activeMapPlaces = mode === 'route' ? selectedMapPlaces : filteredMapPlaces;

  const routePoints = useMemo(
    () => selectedMapPlaces.map((entry) => entry.point),
    [selectedMapPlaces],
  );

  const routeDistanceKm = useMemo(
    () => calculateRouteDistanceKm(routePoints),
    [routePoints],
  );

  const estimatedMinutes = useMemo(
    () => estimateTravelMinutes(routeDistanceKm),
    [routeDistanceKm],
  );

  const mapCenter = useMemo<GeoPoint>(() => {
    if (mode === 'route' && routePoints.length > 0) {
      return routePoints[0];
    }

    if (activeMapPlaces.length > 0) {
      return activeMapPlaces[0].point;
    }

    if (userLocation) {
      return userLocation;
    }

    return DEFAULT_CENTER;
  }, [activeMapPlaces, mode, routePoints, userLocation]);

  const mapZoom =
    mode === 'route' && routePoints.length > 0 ? ROUTE_ZOOM : DEFAULT_ZOOM;

  const googleDirectionsUrl = buildGoogleMapsDirectionsUrl(routePoints);
  const yandexDirectionsUrl = buildYandexMapsDirectionsUrl(routePoints);

  const featuredCount = useMemo(
    () => filteredPlaces.filter((place) => place.featured).length,
    [filteredPlaces],
  );

  const toggleSelection = (placeId: string) => {
    setSelectedIds((current) =>
      current.includes(placeId)
        ? current.filter((id) => id !== placeId)
        : [...current, placeId],
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const copyCoordinates = async () => {
    if (routePoints.length === 0) {
      notifications.show({
        color: 'yellow',
        message: t('mapPage.actions.copyEmpty', {
          defaultValue: 'Select at least one place first.',
        }),
      });
      return;
    }

    const raw = routePoints.map((point) => `${point.lat}, ${point.lng}`).join('\n');

    try {
      await navigator.clipboard.writeText(raw);
      notifications.show({
        color: 'forest',
        message: t('mapPage.actions.copySuccess', {
          defaultValue: 'Coordinates copied.',
        }),
      });
    } catch (error) {
      console.error('Failed to copy coordinates', error);
      notifications.show({
        color: 'red',
        message: t('mapPage.actions.copyFailed', {
          defaultValue: 'Could not copy coordinates.',
        }),
      });
    }
  };

  const goNearMe = () => {
    if (!('geolocation' in navigator)) {
      notifications.show({
        color: 'yellow',
        message: t('mapPage.actions.nearMeUnsupported', {
          defaultValue: 'Geolocation is not available in this browser.',
        }),
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextPoint: GeoPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(nextPoint);
        notifications.show({
          color: 'forest',
          message: t('mapPage.actions.nearMeSuccess', {
            defaultValue: 'Current location found.',
          }),
        });
      },
      (error) => {
        console.error('Failed to get current location', error);
        notifications.show({
          color: 'red',
          message: t('mapPage.actions.nearMeFailed', {
            defaultValue: 'Could not access current location.',
          }),
        });
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <Container size="xl" py={{ base: 34, md: 52 }}> 
     

      {hasError ? (
        <Alert color="yellow" variant="light" mb="lg">
          {t('mapPage.errors.partial', {
            defaultValue:
              'Some live data failed to load. You can still use available places and navigation tools.',
          })}
        </Alert>
      ) : null}

      <Paper
        withBorder
        radius={publicUi.radius.card}
        p={{ base: 'md', md: 'lg' }}
        mb="lg"
        bg={publicUi.background.surface}
      >

        <Group mt="md" justify="space-between" wrap="wrap" gap="sm">
          <SegmentedControl
            value={mode}
            onChange={(value) => setMode(value as MapMode)}
            data={[
              {
                label: t('mapPage.mode.explore', { defaultValue: 'Explore mode' }),
                value: 'explore',
              },
              {
                label: t('mapPage.mode.route', { defaultValue: 'Selected route' }),
                value: 'route',
              },
            ]}
          />

          <Group gap="xs" wrap="wrap">
            <Badge color="forest" variant="light">
              {t('mapPage.stats.visible', { defaultValue: 'Visible places' })}: {filteredPlaces.length}
            </Badge>
            <Badge color="sun" variant="light" c="#5a420b">
              {t('mapPage.stats.withCoordinates', { defaultValue: 'With coordinates' })}:{' '}
              {filteredMapPlaces.length}
            </Badge>
            <Badge color="forest" variant="light">
              {t('common.featured')}: {featuredCount}
            </Badge>
            <Badge color="gray" variant="light">
              {t('mapPage.stats.selected', { defaultValue: 'Selected' })}: {selectedIds.length}
            </Badge>
          </Group>
        </Group>
      </Paper>

      <Grid gutter="lg" align="stretch">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper
            withBorder
            radius={publicUi.radius.card}
            p={0}
            bg={publicUi.background.surface}
            style={{ overflow: 'hidden', minHeight: 520 }}
          >
            {loading ? (
              <Stack justify="center" align="center" h={520}>
                <Loader color="forest" />
                <Text c="dimmed">{t('common.loading')}</Text>
              </Stack>
            ) : activeMapPlaces.length > 0 || userLocation ? (
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                style={{ height: 520, width: '100%' }}
                scrollWheelZoom
              >
                <FitCenter center={[mapCenter.lat, mapCenter.lng]} zoom={mapZoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mode === 'route' && routePoints.length > 1 ? (
                  <Polyline
                    positions={routePoints.map((point) => [point.lat, point.lng])}
                    pathOptions={{ color: '#2f5a45', weight: 4, opacity: 0.85 }}
                  />
                ) : null}

                {activeMapPlaces.map(({ place, point }) => {
                  const placeId = stringifyPlaceId(place);
                  const selected = selectedIds.includes(placeId);

                  return (
                    <CircleMarker
                      key={placeId}
                      center={[point.lat, point.lng]}
                      radius={selected ? 10 : 8}
                      color={selected ? '#e5b62f' : '#2f5a45'}
                      fillColor={selected ? '#e5b62f' : '#2f5a45'}
                      fillOpacity={0.9}
                      eventHandlers={{
                        click: () => toggleSelection(placeId),
                      }}
                    >
                      <Popup>
                        <Stack gap={6}>
                          <Text fw={700}>{place.name}</Text>
                          <Text size="sm" c="dimmed">
                            {place.city ?? t('common.unknownCity')} -{' '}
                            {formatCategoryLabel(place.category, t)}
                          </Text>
                          <Group gap={6} wrap="wrap">
                            <Button size="xs" variant="light" onClick={() => toggleSelection(placeId)}>
                              {selected
                                ? t('mapPage.actions.removeStop', { defaultValue: 'Remove stop' })
                                : t('mapPage.actions.addStop', { defaultValue: 'Add stop' })}
                            </Button>
                            <Button
                              size="xs"
                              variant="subtle"
                              onClick={() => openExternalLink(buildGoogleMapsPlaceUrl(point))}
                            >
                              Google Maps
                            </Button>
                          </Group>
                        </Stack>
                      </Popup>
                    </CircleMarker>
                  );
                })}

                {userLocation ? (
                  <CircleMarker
                    center={[userLocation.lat, userLocation.lng]}
                    radius={7}
                    color="#1c7ed6"
                    fillColor="#1c7ed6"
                    fillOpacity={0.85}
                  >
                    <Popup>{t('mapPage.actions.yourLocation', { defaultValue: 'Your location' })}</Popup>
                  </CircleMarker>
                ) : null}
              </MapContainer>
            ) : (
              <Stack justify="center" align="center" h={520} px="xl">
                <Title order={3}>
                  {t('mapPage.empty.title', { defaultValue: 'No places with coordinates found' })}
                </Title>
                <Text c="dimmed" ta="center" maw={560}>
                  {t('mapPage.empty.description', {
                    defaultValue:
                      'Try another city or category filter. Places without coordinates stay available in cards, but cannot be pinned on map yet.',
                  })}
                </Text>
              </Stack>
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper
            withBorder
            radius={publicUi.radius.card}
            p="lg"
            bg={publicUi.background.surface}
            h="100%"
          >
            <Stack gap="md" h="100%">
              <Group justify="space-between" align="center" wrap="wrap">
                <Title order={3}>
                  {mode === 'route'
                    ? t('mapPage.sidebar.routeTitle', { defaultValue: 'Selected route' })
                    : t('mapPage.sidebar.exploreTitle', { defaultValue: 'Place list' })}
                </Title>
                <Group gap={6}>
                  <Button size="xs" variant="light" onClick={goNearMe}>
                    {t('mapPage.actions.nearMe', { defaultValue: 'Near me' })}
                  </Button>
                  {selectedIds.length > 0 ? (
                    <Button size="xs" variant="subtle" color="gray" onClick={clearSelection}>
                      {t('mapPage.actions.clear', { defaultValue: 'Clear' })}
                    </Button>
                  ) : null}
                </Group>
              </Group>

              {mode === 'route' ? (
                <>
                  <Group gap="xs" wrap="wrap">
                    <Badge color="forest" variant="light">
                      {t('mapPage.summary.stops', { defaultValue: 'Stops' })}: {selectedMapPlaces.length}
                    </Badge>
                    <Badge color="sun" variant="light" c="#5a420b">
                      {t('mapPage.summary.distance', { defaultValue: 'Distance' })}:{' '}
                      {routeDistanceKm.toFixed(1)} km
                    </Badge>
                    <Badge color="gray" variant="light">
                      {t('mapPage.summary.travel', { defaultValue: 'Estimated travel' })}:{' '}
                      {formatMinutesLabel(estimatedMinutes, t)}
                    </Badge>
                  </Group>

                  <Group gap="xs">
                    <Button
                      size="xs"
                      color="forest"
                      variant="light"
                      disabled={!googleDirectionsUrl}
                      onClick={() => openExternalLink(googleDirectionsUrl)}
                    >
                      {t('mapPage.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      disabled={!yandexDirectionsUrl}
                      onClick={() => openExternalLink(yandexDirectionsUrl)}
                    >
                      {t('mapPage.actions.openYandex', { defaultValue: 'Open in Yandex Maps' })}
                    </Button>
                    <Button size="xs" variant="subtle" onClick={copyCoordinates}>
                      {t('mapPage.actions.copy', { defaultValue: 'Copy coordinates' })}
                    </Button>
                  </Group>

                  <Divider />

                  {selectedMapPlaces.length > 0 ? (
                    <Stack gap="xs">
                      {selectedMapPlaces.map((entry, index) => (
                        <Paper
                          key={stringifyPlaceId(entry.place)}
                          withBorder
                          radius="lg"
                          p="sm"
                          style={{ borderColor: 'rgba(44,54,46,0.1)' }}
                        >
                          <Group justify="space-between" wrap="nowrap" align="flex-start">
                            <div>
                              <Text fw={700} size="sm">
                                {index + 1}. {entry.place.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {entry.place.city ?? t('common.unknownCity')} -{' '}
                                {formatCategoryLabel(entry.place.category, t)}
                              </Text>
                            </div>
                            <Button
                              size="compact-xs"
                              variant="subtle"
                              color="red"
                              onClick={() => toggleSelection(stringifyPlaceId(entry.place))}
                            >
                              {t('mapPage.actions.remove', { defaultValue: 'Remove' })}
                            </Button>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Text c="dimmed" size="sm">
                      {t('mapPage.sidebar.routeEmpty', {
                        defaultValue:
                          'Select places from map to build a route path with navigation links.',
                      })}
                    </Text>
                  )}
                </>
              ) : (
                <Stack gap="xs">
                  {filteredMapPlaces.slice(0, 10).map((entry) => {
                    const placeId = stringifyPlaceId(entry.place);
                    const selected = selectedIds.includes(placeId);

                    return (
                      <Paper
                        key={placeId}
                        withBorder
                        radius="lg"
                        p="sm"
                        style={{
                          borderColor: selected
                            ? 'rgba(229,182,47,0.48)'
                            : 'rgba(44,54,46,0.1)',
                          background: selected ? '#fff8e4' : '#fff',
                        }}
                      >
                        <Group justify="space-between" wrap="nowrap" align="flex-start">
                          <div>
                            <Text fw={700} size="sm">
                              {entry.place.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {entry.place.city ?? t('common.unknownCity')} -{' '}
                              {formatCategoryLabel(entry.place.category, t)}
                            </Text>
                          </div>
                          <Group gap={4}>
                            <Button
                              size="compact-xs"
                              variant={selected ? 'filled' : 'light'}
                              color={selected ? 'sun' : 'forest'}
                              c={selected ? '#2d2208' : undefined}
                              onClick={() => toggleSelection(placeId)}
                            >
                              {selected
                                ? t('mapPage.actions.selected', { defaultValue: 'Selected' })
                                : t('mapPage.actions.add', { defaultValue: 'Add' })}
                            </Button>
                            <Button
                              size="compact-xs"
                              variant="subtle"
                              onClick={() =>
                                openExternalLink(buildYandexMapsPlaceUrl(entry.point))
                              }
                            >
                              {t('mapPage.actions.navigate', { defaultValue: 'Navigate' })}
                            </Button>
                          </Group>
                        </Group>
                      </Paper>
                    );
                  })}

                  {filteredMapPlaces.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      {t('mapPage.sidebar.exploreEmpty', {
                        defaultValue:
                          'No map-ready places for this filter. Try another city or category.',
                      })}
                    </Text>
                  ) : null}
                </Stack>
              )}

              <Box mt="auto">
                <Divider mb="md" />
                <Button component={Link} to="/services" fullWidth variant="default">
                  {t('common.browseServices')}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
