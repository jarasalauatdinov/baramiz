import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
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
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DestinationImage } from '../components/DestinationImage';
import { DestinationNearbyPointCard } from '../components/DestinationNearbyPointCard';
import { PlaceCard } from '../components/PlaceCard';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import {
  getDestinationBySlug,
  getLocalizedDestinationBySlug,
  getLocalizedDestinationSupportData,
} from '../data/destinations';
import { getLocalizedServiceSections } from '../data/services';
import { getPlaces } from '../entities/place/api/placeApi';
import { routePaths } from '../router/paths';
import {
  buildGoogleMapsPlaceUrl,
  getPlaceGeoPoint,
  type GeoPoint,
} from '../shared/lib/map/geo';
import { publicUi } from '../shared/config/publicUi';
import type { Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';

const SECTION_CARD_LIMIT = 6;

interface DestinationMapEntry {
  id: string;
  title: string;
  subtitle: string;
  point: GeoPoint;
  kind: 'place' | 'nearby';
}

interface FlyToLocationProps {
  center: LatLngExpression;
  zoom: number;
}

function FlyToLocation({ center, zoom }: FlyToLocationProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.75 });
  }, [center, map, zoom]);

  return null;
}

const stringifyPlaceCategory = (place: Place): string =>
  place.category.toLowerCase();

const includesAnyCategory = (place: Place, keys: string[]): boolean => {
  const category = stringifyPlaceCategory(place);
  return keys.some((key) => category.includes(key));
};

export function DestinationPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const destinationDefinition = getDestinationBySlug(slug);
  const destination = getLocalizedDestinationBySlug(slug, t);
  const support = slug ? getLocalizedDestinationSupportData(slug, t) : null;
  const services = useMemo(() => getLocalizedServiceSections(t), [t]);

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const interest = (searchParams.get('interest') ?? '').toLowerCase();

  useEffect(() => {
    let active = true;

    const loadDestination = async () => {
      if (!destinationDefinition) {
        setPlaces([]);
        setHasError(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasError(false);

      try {
        const results = await Promise.all(destinationDefinition.cities.map((city) => getPlaces({ city })));

        if (!active) {
          return;
        }

        const unique = new Map<string, Place>();
        results.flat().forEach((place) => {
          unique.set(String(place.id), place);
        });

        setPlaces(Array.from(unique.values()));
      } catch (error) {
        console.error('Failed to load destination places', error);
        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadDestination();

    return () => {
      active = false;
    };
  }, [destinationDefinition]);

  const visiblePlaces = useMemo(() => {
    if (!interest) {
      return places;
    }

    return places.filter((place) => stringifyPlaceCategory(place).includes(interest));
  }, [interest, places]);

  const nearbyPoints = useMemo(() => {
    if (!destination) {
      return [];
    }

    if (!interest) {
      return destination.nearbyPoints;
    }

    return destination.nearbyPoints.filter((point) => point.category.toLowerCase().includes(interest));
  }, [destination, interest]);

  const mapEntries = useMemo<DestinationMapEntry[]>(() => {
    const relatedPlaces = visiblePlaces.reduce<DestinationMapEntry[]>((items, place) => {
      const point = getPlaceGeoPoint(place);

      if (!point) {
        return items;
      }

      items.push({
        id: `place-${place.id}`,
        title: place.name,
        subtitle: place.city ?? t('common.unknownCity'),
        point,
        kind: 'place',
      });

      return items;
    }, []);

    const nearby = nearbyPoints.map((point) => ({
      id: `nearby-${point.id}`,
      title: point.title,
      subtitle: point.description,
      point: point.coordinates,
      kind: 'nearby' as const,
    }));

    return [...nearby, ...relatedPlaces];
  }, [nearbyPoints, t, visiblePlaces]);

  const topAttractions = useMemo(
    () => [...visiblePlaces].sort((left, right) => Number(right.featured) - Number(left.featured)).slice(0, SECTION_CARD_LIMIT),
    [visiblePlaces],
  );

  const museumPlaces = useMemo(
    () => visiblePlaces.filter((place) => includesAnyCategory(place, ['museum', 'exhibition'])).slice(0, SECTION_CARD_LIMIT),
    [visiblePlaces],
  );

  const naturePlaces = useMemo(
    () => visiblePlaces.filter((place) => includesAnyCategory(place, ['nature', 'adventure', 'outdoor'])).slice(0, SECTION_CARD_LIMIT),
    [visiblePlaces],
  );

  const experienceCategories = useMemo(
    () => Array.from(new Set(visiblePlaces.map((place) => stringifyPlaceCategory(place)).filter(Boolean))),
    [visiblePlaces],
  );

  const transportCards = useMemo(
    () => services.find((section) => section.id === 'transport')?.items ?? [],
    [services],
  );

  const destinationFacts = useMemo(
    () =>
      destination
        ? [
            { label: t('destinationPage.facts.city', { defaultValue: 'City' }), value: destination.city },
            { label: t('destinationPage.facts.region', { defaultValue: 'Region' }), value: destination.region },
            {
              label: t('destinationPage.facts.category', { defaultValue: 'Category' }),
              value: formatCategoryLabel(destination.category, t),
            },
            {
              label: t('destinationPage.facts.visitTime', { defaultValue: 'Estimated visit time' }),
              value: formatMinutesLabel(destination.estimatedVisitMinutes, t),
            },
            { label: t('destinationPage.facts.bestSeason', { defaultValue: 'Best season' }), value: destination.bestSeason },
            {
              label: t('destinationPage.facts.nearbyPoints', { defaultValue: 'Nearby points' }),
              value: t('destinationPage.facts.nearbyPointsValue', {
                defaultValue: '{{count}} planning points',
                count: destination.nearbyPoints.length,
              }),
            },
          ]
        : [],
    [destination, t],
  );

  if (!destination || !support) {
    return (
      <Container size="xl" py={64}>
        <Alert color="red" variant="light" title={t('destinationPage.notFound.title')}>
          {t('destinationPage.notFound.description')}
        </Alert>
      </Container>
    );
  }

  const mapCenter = mapEntries[0]?.point ?? destination.coordinates;

  return (
    <Box>
      <Box component="section" py={{ base: 32, md: 52 }}>
        <Container size="xl">
          <Paper
            radius={publicUi.radius.hero}
            p={{ base: 'xl', md: '2.2rem' }}
            style={{
              border: `1px solid ${publicUi.border.soft}`,
              background: publicUi.background.hero,
            }}
          >
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
              <Stack gap="lg">
                <div>
                  <Badge color="forest" variant="light" radius="xl">
                    {destination.kicker}
                  </Badge>
                  <Title order={1} mt="md" style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1.05 }}>
                    {destination.name}
                  </Title>
                  <Text mt="md" size="lg" c="dimmed" maw={640} style={{ lineHeight: 1.76 }}>
                    {destination.overview}
                  </Text>
                </div>

                <Group gap="xs" wrap="wrap">
                  <Badge color="gray" variant="light" radius="xl">
                    {destination.city}
                  </Badge>
                  <Badge color="forest" variant="light" radius="xl">
                    {destination.region}
                  </Badge>
                  <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                    {formatCategoryLabel(destination.category, t)}
                  </Badge>
                  {interest ? (
                    <Badge color="forest" variant="filled" radius="xl">
                      {t('common.interestFilter', {
                        interest: formatCategoryLabel(interest, t),
                      })}
                    </Badge>
                  ) : null}
                </Group>

                <Group gap="xs" wrap="wrap">
                  {destination.tags.map((item) => (
                    <Badge key={item} color="sun" variant="light" radius="xl" c="#5a420b">
                      {item}
                    </Badge>
                  ))}
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                  {destination.metrics.map((item) => (
                    <Paper key={`${item.label}-${item.value}`} withBorder p="md" radius="20px" bg="white">
                      <Text size="sm" c="dimmed">
                        {item.label}
                      </Text>
                      <Text fw={800} mt={6}>
                        {item.value}
                      </Text>
                    </Paper>
                  ))}
                </SimpleGrid>

                <Group gap="sm" wrap="wrap">
                  <Button
                    component={Link}
                    to={`${routePaths.routeGenerator}?city=${encodeURIComponent(destination.cities[0] ?? destination.name)}`}
                    color="sun"
                    c="#2d2208"
                  >
                    {t('destinationPage.hero.planRoute')}
                  </Button>
                  <Button component={Link} to={`${routePaths.map}?city=${encodeURIComponent(destination.cities[0] ?? destination.name)}`} variant="light" color="forest">
                    {t('destinationPage.hero.openMap', { defaultValue: 'Open map' })}
                  </Button>
                  <Button component={Link} to={routePaths.services} variant="default">
                    {t('destinationPage.hero.exploreServices')}
                  </Button>
                </Group>
              </Stack>

              <DestinationImage
                src={destination.heroImage}
                name={destination.name}
                city={destination.city}
                category={destination.heroCategory}
                aspectRatio="4 / 3"
                height="auto"
                radius={26}
              />
            </SimpleGrid>
          </Paper>
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 24 }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <SectionHeading
                eyebrow={t('destinationPage.profile.eyebrow', { defaultValue: 'Destination profile' })}
                title={t('destinationPage.profile.title', { defaultValue: 'What makes this destination worth planning around' })}
                description={t('destinationPage.profile.description', {
                  defaultValue: 'This block gives the traveler practical context before they move into map exploration, services, and route building.',
                })}
              />
              <Text c="dimmed" style={{ lineHeight: 1.78 }}>
                {destination.longDescription}
              </Text>
            </Paper>

            <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius={publicUi.radius.panel} bg="white">
              <SectionHeading
                eyebrow={t('destinationPage.facts.eyebrow', { defaultValue: 'Planning facts' })}
                title={t('destinationPage.facts.title', { defaultValue: 'Travel basics at a glance' })}
                description={t('destinationPage.facts.description', {
                  defaultValue: 'The most useful planning details for a destination-first travel flow.',
                })}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {destinationFacts.map((fact) => (
                  <Paper key={fact.label} withBorder p="md" radius="18px" bg="var(--mantine-color-gray-0)">
                    <Text size="sm" c="dimmed">
                      {fact.label}
                    </Text>
                    <Text fw={800} mt={6}>
                      {fact.value}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
              <Group gap="sm" wrap="wrap" mt="lg">
                <Button component="a" href={buildGoogleMapsPlaceUrl(destination.coordinates)} target="_blank" rel="noreferrer" variant="light" color="forest">
                  {t('destinationPage.facts.openGoogle', { defaultValue: 'Open destination in Google Maps' })}
                </Button>
              </Group>
            </Paper>
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 28 }}>
        <Container size="xl">
          <Paper withBorder radius={publicUi.radius.panel} p={{ base: 'md', md: 'lg' }} bg={publicUi.background.surface}>
            <SectionHeading
              eyebrow={t('destinationPage.map.eyebrow', { defaultValue: 'Interactive map preview' })}
              title={t('destinationPage.map.title', { defaultValue: 'Navigate key places in this destination' })}
              description={t('destinationPage.map.description', {
                defaultValue: 'Nearby planning points and live places appear together so the destination feels useful before route generation even starts.',
              })}
              action={
                <Button component={Link} to={`${routePaths.map}?city=${encodeURIComponent(destination.cities[0] ?? destination.name)}`} variant="light" color="forest">
                  {t('destinationPage.map.openFull', { defaultValue: 'Open full map' })}
                </Button>
              }
            />

            {mapEntries.length > 0 ? (
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={9}
                style={{ height: 380, width: '100%', borderRadius: 20, overflow: 'hidden' }}
                scrollWheelZoom
              >
                <FlyToLocation center={[mapCenter.lat, mapCenter.lng]} zoom={9} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapEntries.map((entry) => (
                  <CircleMarker
                    key={entry.id}
                    center={[entry.point.lat, entry.point.lng]}
                    radius={entry.kind === 'nearby' ? 9 : 7}
                    color={entry.kind === 'nearby' ? '#d4a129' : '#2f5a45'}
                    fillColor={entry.kind === 'nearby' ? '#d4a129' : '#2f5a45'}
                    fillOpacity={0.9}
                  >
                    <Popup>
                      <Text fw={700}>{entry.title}</Text>
                      <Text size="sm" c="dimmed">{entry.subtitle}</Text>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            ) : (
              <Paper withBorder p="md" radius="16px" bg={publicUi.background.surfaceSoft}>
                <Text c="dimmed">
                  {t('destinationPage.map.empty', {
                    defaultValue: 'Map coordinates are not available for this destination yet. You can still browse places and nearby planning points below.',
                  })}
                </Text>
              </Paper>
            )}
          </Paper>
        </Container>
      </Box>

      <Box component="section" py={{ base: 22, md: 34 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.nearby.eyebrow', { defaultValue: 'Nearby points' })}
            title={t('destinationPage.nearby.title', { defaultValue: 'Start with the points that shape the destination story' })}
            description={t('destinationPage.nearby.description', {
              defaultValue: 'These points help the traveler understand how to sequence the visit before choosing an exact route.',
            })}
          />

          {nearbyPoints.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {nearbyPoints.map((point) => (
                <DestinationNearbyPointCard key={point.id} point={point} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="30px" bg="white">
              <Text c="dimmed">
                {t('destinationPage.nearby.empty', { defaultValue: 'No nearby planning points for the current filter.' })}
              </Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 22, md: 34 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.attractions.eyebrow')}
            title={t('destinationPage.attractions.title', { name: destination.name })}
            description={t('destinationPage.attractions.description')}
          />

          {hasError ? (
            <Alert color="red" variant="light" mb="xl">
              {t('destinationPage.errors.attractionsUnavailable')}
            </Alert>
          ) : null}

          {loading ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} h={420} radius="30px" />
              ))}
            </SimpleGrid>
          ) : topAttractions.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {topAttractions.map((place) => (
                <PlaceCard key={String(place.id)} place={place} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="30px" bg="white">
              <Text c="dimmed">{t('destinationPage.attractions.empty')}</Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.museums.eyebrow', { defaultValue: 'Museums and exhibitions' })}
            title={t('destinationPage.museums.title', { defaultValue: 'Museum highlights' })}
            description={t('destinationPage.museums.description', {
              defaultValue: 'Museum-focused places for travelers who want culture, collections, and context.',
            })}
          />

          {museumPlaces.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {museumPlaces.map((place) => (
                <PlaceCard key={String(place.id)} place={place} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="lg" radius="24px" bg="white">
              <Text c="dimmed">
                {t('destinationPage.museums.empty', { defaultValue: 'No museum-specific places for the current filters.' })}
              </Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.nature.eyebrow', { defaultValue: 'Nature and outdoor' })}
            title={t('destinationPage.nature.title', { defaultValue: 'Outdoor and scenic spots' })}
            description={t('destinationPage.nature.description', {
              defaultValue: 'Landscape and adventure points for open-air travel experiences in this destination.',
            })}
          />

          {naturePlaces.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {naturePlaces.map((place) => (
                <PlaceCard key={String(place.id)} place={place} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="lg" radius="24px" bg="white">
              <Text c="dimmed">
                {t('destinationPage.nature.empty', { defaultValue: 'No outdoor places for the current filters.' })}
              </Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.experiences.eyebrow')}
            title={t('destinationPage.experiences.title')}
            description={t('destinationPage.experiences.description')}
          />

          {experienceCategories.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
              {experienceCategories.map((category) => {
                const description = t(`destinationPage.experienceDescriptions.${category}`);
                const fallbackDescription = t('destinationPage.experiences.defaultDescription');
                const localizedCategory = formatCategoryLabel(category, t);

                return (
                  <Paper key={category} withBorder p="xl" radius="30px" bg="white">
                    <Stack gap="sm">
                      <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                        {localizedCategory}
                      </Badge>
                      <Title order={3}>{t('destinationPage.experiences.cardTitle', { category: localizedCategory })}</Title>
                      <Text c="dimmed" style={{ lineHeight: 1.72 }}>
                        {description !== `destinationPage.experienceDescriptions.${category}` ? description : fallbackDescription}
                      </Text>
                    </Stack>
                  </Paper>
                );
              })}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="30px" bg="white">
              <Text c="dimmed">{t('common.noResults')}</Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.accommodation.eyebrow')}
            title={t('destinationPage.accommodation.title')}
            description={t('destinationPage.accommodation.description')}
          />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {support.stays.map((item) => (
              <ServiceCard key={item.title} item={item} kind="accommodation" actionLabel={t('common.viewStay')} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.tours.eyebrow')}
            title={t('destinationPage.tours.title')}
            description={t('destinationPage.tours.description')}
          />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {[...support.tours, ...support.guides].map((item) => (
              <ServiceCard key={item.title} item={item} kind="guides" actionLabel={t('common.openService')} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 30 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.food.eyebrow')}
            title={t('destinationPage.food.title')}
            description={t('destinationPage.food.description')}
          />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {support.food.map((item) => (
              <ServiceCard key={item.title} item={item} kind="food" actionLabel={t('common.seeFoodStop')} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 18, md: 54 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('destinationPage.transport.eyebrow', { defaultValue: 'Transport' })}
            title={t('destinationPage.transport.title', { defaultValue: 'Move around this destination' })}
            description={t('destinationPage.transport.description', {
              defaultValue: 'Transport support cards to make destination planning practical for independent and assisted travelers.',
            })}
          />

          {transportCards.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {transportCards.slice(0, 2).map((item) => (
                <ServiceCard
                  key={item.title}
                  item={item}
                  kind="transport"
                  actionLabel={t('destinationPage.transport.cardAction', { defaultValue: 'Open transport option' })}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="lg" radius="24px" bg="white">
              <Text c="dimmed">
                {t('destinationPage.transport.empty', {
                  defaultValue: 'Transport cards will appear when service data is available.',
                })}
              </Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 14, md: 56 }}>
        <Container size="xl">
          <Paper
            withBorder
            radius={publicUi.radius.panel}
            p={{ base: 'xl', md: '2rem' }}
            style={{
              borderColor: publicUi.border.accent,
              background: publicUi.background.accent,
            }}
          >
            <Stack gap="md">
              <Badge color="forest" variant="light" radius="xl" w="fit-content">
                {t('destinationPage.finalCta.eyebrow', { defaultValue: 'Ready for your route?' })}
              </Badge>
              <Title order={2}>
                {t('destinationPage.finalCta.title', { defaultValue: `Build a smart route for ${destination.name}` })}
              </Title>
              <Text c="dimmed" maw={760} style={{ lineHeight: 1.72 }}>
                {t('destinationPage.finalCta.description', {
                  defaultValue: 'Use this destination as the base, pick your interests, and get a practical itinerary with map-ready stops.',
                })}
              </Text>
              <Group gap="sm" wrap="wrap">
                <Button component={Link} to={`${routePaths.routeGenerator}?city=${encodeURIComponent(destination.cities[0] ?? destination.name)}`} color="sun" c="#2d2208">
                  {t('destinationPage.hero.planRoute')}
                </Button>
                <Button component={Link} to={`${routePaths.map}?city=${encodeURIComponent(destination.cities[0] ?? destination.name)}`} variant="light" color="forest">
                  {t('destinationPage.map.openFull', { defaultValue: 'Open full map' })}
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
