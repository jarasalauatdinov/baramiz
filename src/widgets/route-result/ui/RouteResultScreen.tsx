import { useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
import type { GeoPoint } from '../../../shared/lib/map/geo';
import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPlaceUrl,
  buildYandexMapsPlaceUrl,
} from '../../../shared/lib/map/geo';
import { routePaths } from '../../../router/paths';
import type { GuideProfile } from '../../../entities/guide';
import { GuideCard } from '../../../entities/guide';
import { formatCategoryLabel, formatMinutesLabel } from '../../../entities/place';
import type { ServiceCatalogEntry } from '../../../entities/service';
import { ServiceCard } from '../../../entities/service';
import type { RoutePlanningResult } from '../../../features/route-planning/model/types';
import {
  getBudgetLevelLabel,
  getDurationLabel,
  getTransportPreferenceLabel,
  getTravelPaceLabel,
  getTripStyleLabel,
} from '../../../features/route-planning/model/options';
import type {
  RouteOverviewContent,
  RouteSupportRecommendations,
  RouteTravelTip,
} from '../../../features/route-planning/model/resultExperience';
import { RouteResultPanel } from '../../../features/route-planning/ui/RouteResultPanel';
import { RouteTravelTips } from '../../../features/route-planning/ui/RouteTravelTips';
import { TravelAssistantPanel } from '../../../features/travel-assistant/ui/TravelAssistantPanel';
import { DestinationImage } from '../../../shared/ui';
import type { RouteStopViewModel } from '../model/types';

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

interface RouteResultScreenProps {
  state: RoutePlanningResult;
  routeOverview: RouteOverviewContent | null;
  travelTips: RouteTravelTip[];
  supportRecommendations: RouteSupportRecommendations;
  assistantPrompts: string[];
  stopModels: RouteStopViewModel[];
  selectedStopIndex: number;
  selectedStop: RouteStopViewModel | null;
  routePoints: GeoPoint[];
  mapCenter: GeoPoint | null;
  mapZoom: number;
  mapDataFailed: boolean;
  visibleInterests: string[];
  hiddenInterestCount: number;
  onSelectStop: (index: number) => void;
  onSaveRoute: () => void;
  onFindHotels: () => void;
  onBookRouteSupport: () => void;
  onBookService: (service: ServiceCatalogEntry) => void;
  onBookGuide: (guide: GuideProfile) => void;
}

export function RouteResultScreen({
  state,
  routeOverview,
  travelTips,
  supportRecommendations,
  assistantPrompts,
  stopModels,
  selectedStopIndex,
  selectedStop,
  routePoints,
  mapCenter,
  mapZoom,
  mapDataFailed,
  visibleInterests,
  hiddenInterestCount,
  onSelectStop,
  onSaveRoute,
  onFindHotels,
  onBookRouteSupport,
  onBookService,
  onBookGuide,
}: RouteResultScreenProps) {
  const { t } = useTranslation();
  const route = state.route;
  const request = state.request;
  const source = state.source;

  const googleRouteUrl =
    routePoints.length > 1
      ? buildGoogleMapsDirectionsUrl(routePoints)
      : selectedStop?.point
        ? buildGoogleMapsPlaceUrl(selectedStop.point)
        : null;

  return (
    <Container size="xl" py={{ base: 14, md: 22 }}>
      <Paper withBorder radius="30px" p={{ base: 'xl', md: '2rem' }} bg="#fffdf8" mb="lg">
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
              <Text c="dimmed" style={{ lineHeight: 1.65 }}>
                {routeOverview?.description ?? t('routeResult.summary.description')}
              </Text>
              {routeOverview ? (
                <Group gap="xs" wrap="wrap">
                  {routeOverview.highlights.slice(0, 2).map((highlight) => (
                    <Badge
                      key={highlight}
                      color="gray"
                      variant="light"
                      radius="xl"
                      styles={{ label: { whiteSpace: 'normal' } }}
                    >
                      {highlight}
                    </Badge>
                  ))}
                </Group>
              ) : null}
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" w={{ base: '100%', lg: 'auto' }}>
              <Button
                color="sun"
                c="#2d2208"
                disabled={!googleRouteUrl}
                onClick={() => openExternalLink(googleRouteUrl)}
                fullWidth
                radius="xl"
                style={{ boxShadow: '0 14px 28px rgba(229, 182, 47, 0.18)' }}
              >
                {t('routeResult.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
              </Button>
              <Button variant="light" color="forest" onClick={onSaveRoute} fullWidth radius="xl">
                {t('routeResult.actions.saveForLater', { defaultValue: 'Save for later' })}
              </Button>
            </SimpleGrid>
          </Group>

          <SimpleGrid cols={{ base: 2, md: 3 }} spacing="md">
            <Paper withBorder p="md" radius="18px" bg="#fffaf3">
              <Text size="sm" c="dimmed">{t('routeResult.stats.destination')}</Text>
              <Text fw={800} mt={6}>{route.city}</Text>
            </Paper>
            <Paper withBorder p="md" radius="18px" bg="#fffaf3">
              <Text size="sm" c="dimmed">{t('routeResult.stats.stops')}</Text>
              <Text fw={800} mt={6}>{stopModels.length}</Text>
            </Paper>
            <Paper withBorder p="md" radius="18px" bg="#fffaf3">
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
            <Badge color="gray" variant="light" radius="xl">
              {getDurationLabel(request.duration, t)}
            </Badge>
            {visibleInterests.map((interest) => (
              <Badge key={interest} color="sun" variant="light" radius="xl" c="#5a420b">
                {formatCategoryLabel(interest, t)}
              </Badge>
            ))}
            {hiddenInterestCount > 0 ? (
              <Badge color="gray" variant="light" radius="xl">
                +{hiddenInterestCount}
              </Badge>
            ) : null}
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
                      background: selected ? '#fff9ea' : '#fffdf8',
                      cursor: 'pointer',
                      boxShadow: selected ? '0 12px 24px rgba(229, 182, 47, 0.12)' : 'none',
                    }}
                    onClick={() => onSelectStop(index)}
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
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1.55 }} lineClamp={2}>
                              {t('routeResult.plan.whyThisFits', {
                                defaultValue: 'Why this fits: {{reason}}',
                                reason: stop.reason,
                              })}
                            </Text>
                          </Stack>
                        </SimpleGrid>

                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs" mt="sm">
                          <Button
                            size="xs"
                            variant={selected ? 'filled' : 'light'}
                            color={selected ? 'sun' : 'forest'}
                            c={selected ? '#2d2208' : undefined}
                            fullWidth
                            onClick={(event) => {
                              event.stopPropagation();
                              onSelectStop(index);
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
                        </SimpleGrid>
                      </Box>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          ) : (
            <Paper withBorder p="md" radius="18px">
              <Text c="dimmed">{t('routeResult.plan.empty', { defaultValue: 'No stops are available yet.' })}</Text>
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
                style={{
                  height: 'clamp(280px, 52vh, 420px)',
                  width: '100%',
                  borderRadius: 18,
                  overflow: 'hidden',
                }}
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
                        click: () => onSelectStop(index),
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
                      radius="xl"
                      onClick={() => openExternalLink(selectedStop.point ? buildGoogleMapsPlaceUrl(selectedStop.point as GeoPoint) : null)}
                    >
                      {t('routeResult.actions.openGoogle', { defaultValue: 'Open in Google Maps' })}
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      disabled={!selectedStop.point}
                      radius="xl"
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
          title={t('routeResult.support.title', { defaultValue: 'Useful support around this route' })}
          description={t('routeResult.support.description', {
            defaultValue: 'Short tips, optional services, and local help.',
          })}
        >
          <Stack gap="md">
            <Paper withBorder p="md" radius="18px" bg="#fffdf8">
              <Stack gap={6}>
                <Text fw={700}>
                  {t('pages.hotels.route.title', { defaultValue: 'Stay close to this route' })}
                </Text>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {t('pages.hotels.route.description', {
                    defaultValue:
                      'Open a short curated list of hotels matched to this city, budget, and route pace.',
                  })}
                </Text>
                <Button color="sun" c="#2d2208" radius="xl" onClick={onFindHotels}>
                  {t('pages.hotels.route.cta', { defaultValue: 'Find hotels for this trip' })}
                </Button>
              </Stack>
            </Paper>

            <Button variant="light" color="forest" radius="xl" onClick={onBookRouteSupport}>
              {t('pages.booking.common.bookNow')}
            </Button>

            {travelTips.length > 0 ? (
              <Stack gap="sm">
                <Text fw={700}>{t('routeResult.tips.sectionTitle', { defaultValue: 'Travel tips for this route' })}</Text>
                <RouteTravelTips tips={travelTips.slice(0, 2)} />
              </Stack>
            ) : null}

            {travelTips.length > 0 &&
            (supportRecommendations.services.length > 0 || supportRecommendations.guides.length > 0) ? (
              <Divider />
            ) : null}

            {supportRecommendations.services.length > 0 ? (
              <Stack gap="sm">
                <Text fw={700}>{t('routeResult.support.servicesTitle', { defaultValue: 'Recommended services' })}</Text>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  {supportRecommendations.services.slice(0, 2).map((service) => (
                    <ServiceCard
                      key={service.id}
                      item={service}
                      kind={service.kind}
                      onBook={() => onBookService(service)}
                    />
                  ))}
                </SimpleGrid>
              </Stack>
            ) : null}

            {supportRecommendations.services.length > 0 && supportRecommendations.guides.length > 0 ? <Divider /> : null}

            {supportRecommendations.guides.length > 0 ? (
              <Stack gap="sm">
                <Text fw={700}>{t('routeResult.support.guidesTitle', { defaultValue: 'Guides who fit this route' })}</Text>
                <SimpleGrid cols={{ base: 1 }} spacing="md">
                  {supportRecommendations.guides.slice(0, 1).map((guide) => (
                    <GuideCard key={guide.id} guide={guide} onBook={() => onBookGuide(guide)} />
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

        <TravelAssistantPanel
          title={t('routeResult.assistant.title', {
            defaultValue: 'Need route adjustments?',
          })}
          description={t('routeResult.assistant.description', {
            defaultValue:
              'Ask to shorten, reorder, or improve this route. Sent only to backend.',
          })}
          placeholder={t('routeResult.assistant.placeholder', {
            defaultValue: 'Ask how to shorten, reorder, or improve this route...',
          })}
          emptyHint={t('routeResult.assistant.emptyHint', {
            defaultValue:
              'This works best for quick route questions after the plan has already been generated.',
          })}
          suggestions={assistantPrompts}
          compact
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="xl">
        <Button component={Link} to={routePaths.appRouteBuilder} color="forest" fullWidth radius="xl">
          {t('common.generateAnother')}
        </Button>
        <Button component={Link} to={routePaths.appExplore} variant="light" color="forest" fullWidth radius="xl">
          {t('common.exploreMorePlaces')}
        </Button>
      </SimpleGrid>
    </Container>
  );
}
