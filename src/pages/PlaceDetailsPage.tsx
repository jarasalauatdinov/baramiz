import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DestinationImage } from '../components/DestinationImage';
import { GuideCard } from '../components/GuideCard';
import { PageHeaderBlock } from '../components/layout/PageHeaderBlock';
import { PageSection } from '../components/layout/PageSection';
import { StatePanel } from '../components/layout/StatePanel';
import { PlaceCard } from '../components/PlaceCard';
import { ServiceCard } from '../components/ServiceCard';
import { getLocalizedDestinationByCity } from '../data/destinations';
import { guideProfiles } from '../data/guides';
import { getLocalizedServiceSections } from '../data/services';
import { getPlaceById, getPlaces } from '../entities/place/api/placeApi';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import { buildGoogleMapsPlaceUrl, getPlaceGeoPoint } from '../shared/lib/map/geo';
import type { Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';

const RELATED_PLACES_LIMIT = 3;

export function PlaceDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPlace = async () => {
      if (!id) {
        setPlace(null);
        setRelatedPlaces([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasError(false);

      try {
        const currentPlace = await getPlaceById(id);
        if (!active) {
          return;
        }

        if (!currentPlace) {
          setPlace(null);
          setRelatedPlaces([]);
          setLoading(false);
          return;
        }

        setPlace(currentPlace);

        const source = currentPlace.city ? await getPlaces({ city: currentPlace.city }) : await getPlaces();
        if (!active) {
          return;
        }

        setRelatedPlaces(
          source
            .filter((item) => String(item.id) !== String(currentPlace.id))
            .sort((left, right) => Number(right.featured) - Number(left.featured))
            .slice(0, RELATED_PLACES_LIMIT),
        );
      } catch (error) {
        console.error('Failed to load place details', error);
        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPlace();
    return () => {
      active = false;
    };
  }, [id]);

  const destination = useMemo(() => getLocalizedDestinationByCity(place?.city, t), [place?.city, t]);
  const point = place ? getPlaceGeoPoint(place) : null;
  const localizedServiceSections = useMemo(() => getLocalizedServiceSections(t), [t]);

  const recommendedServices = useMemo(() => {
    if (!place?.city) {
      return [];
    }

    return localizedServiceSections
      .flatMap((section) =>
        section.items
          .filter((item) => item.city === place.city || item.availableCities?.includes(place.city))
          .map((item) => ({ item, kind: section.id })),
      )
      .slice(0, 3);
  }, [localizedServiceSections, place?.city]);

  const recommendedGuides = useMemo(() => {
    if (!place?.city) {
      return [];
    }

    return guideProfiles.filter((guide) => guide.availableCities.includes(place.city ?? '')).slice(0, 2);
  }, [place?.city]);

  const routeQuery = useMemo(() => {
    if (!place) {
      return routePaths.appRouteBuilder;
    }

    const query = new URLSearchParams();
    if (place.city) {
      query.set('city', place.city);
    }
    query.set('interest', place.category.toLowerCase());
    return `${routePaths.appRouteBuilder}${query.toString() ? `?${query.toString()}` : ''}`;
  }, [place]);

  const relatedPlacesQuery = useMemo(() => {
    if (!place?.city) {
      return routePaths.appExplore;
    }

    const query = new URLSearchParams({ city: place.city });
    return `${routePaths.appExplore}?${query.toString()}`;
  }, [place?.city]);

  if (loading) {
    return (
      <PageSection py={{ base: 20, md: 30 }}>
        <Container size="xl">
          <Stack gap="md">
            <Skeleton h={360} radius="30px" />
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
              <Skeleton h={220} radius="24px" />
              <Skeleton h={220} radius="24px" />
            </SimpleGrid>
          </Stack>
        </Container>
      </PageSection>
    );
  }

  if (!place) {
    return (
      <PageSection py={{ base: 30, md: 56 }}>
        <Container size="xl">
          <StatePanel
            badge={t('common.place', { defaultValue: 'Place' })}
            title={t('placeDetails.notFound.title', {
              defaultValue: 'This place is not available',
            })}
            description={t('placeDetails.notFound.description', {
              defaultValue: 'Open the places list or continue to route planning.',
            })}
            actions={
              <>
                <Button component={Link} to={routePaths.appExplore} color="forest">
                  {t('common.exploreMorePlaces')}
                </Button>
                <Button component={Link} to={routePaths.appRouteBuilder} variant="light" color="forest">
                  {t('common.goToRoute')}
                </Button>
              </>
            }
          />
        </Container>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <Paper
            withBorder
            radius={publicUi.radius.hero}
            p={{ base: 'lg', md: '2rem' }}
            style={{
              borderColor: publicUi.border.soft,
              background: publicUi.background.hero,
              boxShadow: publicUi.shadow.hero,
            }}
          >
            <Stack gap="md">
              <DestinationImage
                src={place.imageUrl}
                name={place.name}
                city={place.city}
                category={place.category}
                aspectRatio="16 / 10"
                height="auto"
                radius={24}
              />

              <Stack gap="sm">
                <Group gap="xs" wrap="wrap">
                  <Badge color="forest" variant="light" radius="xl">
                    {destination?.name ?? t('common.place', { defaultValue: 'Place' })}
                  </Badge>
                  <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                    {formatCategoryLabel(place.category, t)}
                  </Badge>
                  {place.city ? (
                    <Badge color="gray" variant="light" radius="xl">
                      {place.city}
                    </Badge>
                  ) : null}
                  {place.featured ? <Badge color="forest">{t('common.featured')}</Badge> : null}
                </Group>

                <Title order={1} style={{ fontSize: 'clamp(1.7rem, 7vw, 2.5rem)', lineHeight: 1.08 }}>
                  {place.name}
                </Title>
                <Text c="dimmed">
                  {place.description ??
                    t('placeDetails.descriptionFallback', {
                      defaultValue: 'A strong stop for destination discovery and route planning.',
                    })}
                </Text>

                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                  <Paper withBorder p="sm" radius="16px" bg="white">
                    <Text size="xs" c="dimmed">
                      {t('placeDetails.facts.city', { defaultValue: 'City' })}
                    </Text>
                    <Text fw={700}>{place.city ?? t('common.unknownCity')}</Text>
                  </Paper>
                  <Paper withBorder p="sm" radius="16px" bg="white">
                    <Text size="xs" c="dimmed">
                      {t('placeDetails.facts.visitTime', { defaultValue: 'Visit time' })}
                    </Text>
                    <Text fw={700}>{formatMinutesLabel(place.durationMinutes, t)}</Text>
                  </Paper>
                  <Paper withBorder p="sm" radius="16px" bg="white">
                    <Text size="xs" c="dimmed">
                      {t('placeDetails.facts.region', { defaultValue: 'Region' })}
                    </Text>
                    <Text fw={700}>{place.region || '-'}</Text>
                  </Paper>
                  <Paper withBorder p="sm" radius="16px" bg="white">
                    <Text size="xs" c="dimmed">
                      {t('placeDetails.facts.destination', { defaultValue: 'Destination' })}
                    </Text>
                    <Text fw={700}>{destination?.name ?? '-'}</Text>
                  </Paper>
                </SimpleGrid>

                <Group gap="sm" wrap="wrap">
                  <Button component={Link} to={routeQuery} color="sun" c="#2d2208">
                    {t('placeDetails.actions.planFromHere', { defaultValue: 'Build route from here' })}
                  </Button>
                  {point ? (
                    <Button
                      component="a"
                      href={buildGoogleMapsPlaceUrl(point)}
                      target="_blank"
                      rel="noreferrer"
                      variant="light"
                      color="forest"
                    >
                      {t('placeDetails.actions.openMap', { defaultValue: 'Open in map' })}
                    </Button>
                  ) : null}
                  {destination ? (
                    <Button component={Link} to={routePaths.appDestinationDetails(destination.slug)} variant="subtle">
                      {t('placeDetails.actions.openDestination', { defaultValue: 'Open destination' })}
                    </Button>
                  ) : null}
                </Group>
              </Stack>
            </Stack>
          </Paper>
        </Container>
      </PageSection>

      <PageSection py={{ base: 14, md: 22 }}>
        <Container size="xl">
          {hasError ? (
            <Alert color="yellow" variant="light" mb="md">
              {t('placeDetails.errors.relatedData', {
                defaultValue: 'Some related data is currently unavailable.',
              })}
            </Alert>
          ) : null}

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <PageHeaderBlock
                eyebrow={t('placeDetails.context.eyebrow', { defaultValue: 'Highlights' })}
                title={t('placeDetails.context.title', { defaultValue: 'At a glance' })}
                size="section"
                mb="sm"
              />
              <Stack gap={4}>
                <Text c="dimmed" size="sm">
                  - {t('placeDetails.context.point1', { defaultValue: 'Best used with nearby stops in the same city.' })}
                </Text>
                <Text c="dimmed" size="sm">
                  - {t('placeDetails.context.point2', { defaultValue: 'Quick to include in route generation.' })}
                </Text>
                {destination ? (
                  <Text c="dimmed" size="sm">
                    - {t('placeDetails.context.point3', {
                      defaultValue: 'Part of the {{destination}} destination flow.',
                      destination: destination.name,
                    })}
                  </Text>
                ) : null}
              </Stack>
            </Paper>

            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <PageHeaderBlock
                eyebrow={t('placeDetails.map.eyebrow', { defaultValue: 'Map' })}
                title={t('placeDetails.map.title', { defaultValue: 'Location preview' })}
                size="section"
                mb="sm"
              />
              {point ? (
                <MapContainer
                  center={[point.lat, point.lng]}
                  zoom={11}
                  style={{ height: 300, width: '100%', borderRadius: 18, overflow: 'hidden' }}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <CircleMarker center={[point.lat, point.lng]} radius={9} color="#2f5a45" fillColor="#2f5a45" fillOpacity={0.92}>
                    <Popup>
                      <Text fw={700}>{place.name}</Text>
                      <Text size="sm" c="dimmed">
                        {place.city ?? t('common.unknownCity')}
                      </Text>
                    </Popup>
                  </CircleMarker>
                </MapContainer>
              ) : (
                <Paper withBorder p="md" radius="16px" bg={publicUi.background.surfaceSoft}>
                  <Text c="dimmed">
                    {t('placeDetails.map.empty', {
                      defaultValue: 'Coordinates are not available for this place yet.',
                    })}
                  </Text>
                </Paper>
              )}
            </Paper>
          </SimpleGrid>
        </Container>
      </PageSection>

      <PageSection py={{ base: 14, md: 20 }}>
        <Container size="xl">
          <PageHeaderBlock
            eyebrow={t('placeDetails.related.eyebrow', { defaultValue: 'Nearby' })}
            title={t('placeDetails.related.title', { defaultValue: 'Continue with nearby stops' })}
            description={t('placeDetails.related.description', {
              defaultValue: 'Keep this trip in one city flow.',
            })}
            size="section"
            action={
              <Button component={Link} to={relatedPlacesQuery} variant="light" color="forest">
                {t('placeDetails.related.action', { defaultValue: 'Open city places' })}
              </Button>
            }
          />

          {relatedPlaces.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
              {relatedPlaces.map((item) => (
                <PlaceCard key={String(item.id)} place={item} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="lg" radius={publicUi.radius.panel} bg="white">
              <Text c="dimmed">{t('placeDetails.related.empty', { defaultValue: 'No nearby places right now.' })}</Text>
            </Paper>
          )}
        </Container>
      </PageSection>

      <PageSection py={{ base: 14, md: 26 }}>
        <Container size="xl">
          <PageHeaderBlock
            eyebrow={t('placeDetails.support.eyebrow', { defaultValue: 'Support' })}
            title={t('placeDetails.support.title', { defaultValue: 'Services and local help' })}
            description={t('placeDetails.support.description', {
              defaultValue: 'Open support options if needed.',
            })}
            size="section"
          />

          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <Stack gap="md">
                <Text fw={800}>{t('placeDetails.support.servicesTitle', { defaultValue: 'Recommended services' })}</Text>
                {recommendedServices.length > 0 ? (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
                    {recommendedServices.map((service) => (
                      <ServiceCard key={service.item.id} item={service.item} kind={service.kind} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text c="dimmed">{t('placeDetails.support.servicesEmpty', { defaultValue: 'No service matches yet.' })}</Text>
                )}
              </Stack>
            </Paper>

            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <Stack gap="md">
                <Text fw={800}>{t('placeDetails.support.guidesTitle', { defaultValue: 'Local guides' })}</Text>
                {recommendedGuides.length > 0 ? (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
                    {recommendedGuides.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text c="dimmed">{t('placeDetails.support.guidesEmpty', { defaultValue: 'No guide matches yet.' })}</Text>
                )}
              </Stack>
            </Paper>
          </SimpleGrid>
        </Container>
      </PageSection>
    </>
  );
}
