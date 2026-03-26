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
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import heroIllustration from '../assets/right.svg';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { GuideCard } from '../components/GuideCard';
import { PlaceCard } from '../components/PlaceCard';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { DestinationCard } from '../components/DestinationCard';
import { featuredDestinations, getLocalizedDestinations } from '../data/destinations';
import { guideProfiles } from '../data/guides';
import { getLocalizedServiceSections } from '../data/services';
import { publicUi } from '../shared/config/publicUi';
import type { Category, Place } from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';
import styles from './HomePage.module.css';

const fallbackCategoryIds = ['history', 'culture', 'museum', 'nature', 'adventure', 'food'];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDataError, setHasDataError] = useState(false);
  const [selectedDestination] = useState('nukus');
  const [selectedInterest] = useState('history');

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      const [categoriesResult, featuredResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces({ featured: true }),
        getPlaces(),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (featuredResult.status === 'fulfilled') {
        setFeaturedPlaces(featuredResult.value);
      }

      if (placesResult.status === 'fulfilled') {
        setAllPlaces(placesResult.value);
      }

      if (
        categoriesResult.status === 'rejected' ||
        featuredResult.status === 'rejected' ||
        placesResult.status === 'rejected'
      ) {
        console.error('Failed to fully load home page', {
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
          featured: featuredResult.status === 'rejected' ? featuredResult.reason : null,
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
        });
        setHasDataError(true);
      }

      setLoading(false);
    };

    void loadHome();

    return () => {
      active = false;
    };
  }, []);

  const localizedDestinations = useMemo(() => getLocalizedDestinations(t), [t]);
  const localizedServiceSections = useMemo(() => getLocalizedServiceSections(t), [t]);
  const interestOptions = categories.length > 0
    ? categories.map((category) => ({
        value: String(category.id),
        label: formatCategoryLabel(String(category.id), t),
      }))
    : fallbackCategoryIds.map((id) => ({
        value: id,
        label: formatCategoryLabel(id, t),
      }));
  const categoryShowcase = useMemo(() => {
    return interestOptions.slice(0, 6).map((option) => {
      const descriptionKey = `categoryDescriptions.${option.value}`;
      const description = t(descriptionKey);
      const fallbackDescription = t('homeV2.categories.defaultDescription', {
        defaultValue: 'A practical interest area to guide destination discovery and route planning.',
      });

      return {
        id: option.value,
        label: option.label,
        description:
          typeof description === 'string' && description !== descriptionKey
            ? description
            : fallbackDescription,
      };
    });
  }, [interestOptions, t]);
  const selectedDestinationData =
    localizedDestinations.find((destination) => destination.slug === selectedDestination) ?? localizedDestinations[0];

  const destinationCounts = useMemo(() => {
    return Object.fromEntries(
      featuredDestinations.map((destination) => [
        destination.slug,
        allPlaces.filter((place) => destination.cities.includes(place.city ?? '')).length,
      ]),
    );
  }, [allPlaces]);
  const routeSteps = [
    {
      number: '01',
      title: t('homeV2.route.steps.cityTitle', { defaultValue: 'Choose a city' }),
      description: t('homeV2.route.steps.cityDescription', {
        defaultValue: 'Start from Nukus, Moynaq, Ellikqala, or another destination in the region.',
      }),
    },
    {
      number: '02',
      title: t('homeV2.route.steps.interestsTitle', { defaultValue: 'Select interests' }),
      description: t('homeV2.route.steps.interestsDescription', {
        defaultValue: 'Mix museums, history, nature, food, and local culture into a route that feels practical.',
      }),
    },
    {
      number: '03',
      title: t('homeV2.route.steps.itineraryTitle', { defaultValue: 'Get your itinerary' }),
      description: t('homeV2.route.steps.itineraryDescription', {
        defaultValue: 'Baramiz returns a readable route with stops, timing, and reasons for each recommendation.',
      }),
    },
  ];

  const whyItems = [
    {
      title: t('homeV2.why.items.aiTitle', { defaultValue: 'Route planning that stays practical' }),
      description: t('homeV2.why.items.aiDescription', {
        defaultValue: 'Baramiz focuses on useful travel plans, not abstract demos. Routes are built for real tourism decisions.',
      }),
    },
    {
      title: t('homeV2.why.items.localTitle', { defaultValue: 'Localized Karakalpakstan tourism focus' }),
      description: t('homeV2.why.items.localDescription', {
        defaultValue: 'Destinations, guides, and services are structured around how travelers actually explore the region.',
      }),
    },
    {
      title: t('homeV2.why.items.liveTitle', { defaultValue: 'Live attractions from the backend' }),
      description: t('homeV2.why.items.liveDescription', {
        defaultValue: 'Featured places and tourism categories use real backend data and degrade gracefully when requests fail.',
      }),
    },
    {
      title: t('homeV2.why.items.servicesTitle', { defaultValue: 'Services that make the platform feel complete' }),
      description: t('homeV2.why.items.servicesDescription', {
        defaultValue: 'Hotels, transport, tours, and local guides help Baramiz feel like a tourism platform rather than a simple itinerary page.',
      }),
    },
  ];

  const servicesShowcase = localizedServiceSections.filter((section) =>
    ['accommodation', 'transport', 'agencies'].includes(section.id),
  );

  const handleExploreDestination = () => {
    const query = new URLSearchParams();
    if (selectedInterest) {
      query.set('interest', selectedInterest);
    }

    navigate(`/destinations/${selectedDestination}${query.toString() ? `?${query.toString()}` : ''}`);
  };

  const handleExplorePlaces = () => {
    const query = new URLSearchParams();
    const city = selectedDestinationData?.cities[0];
    if (city) {
      query.set('city', city);
    }
    if (selectedInterest) {
      query.set('category', selectedInterest);
    }

    navigate(`/places${query.toString() ? `?${query.toString()}` : ''}`);
  };

  const handleBuildRoute = () => {
    const query = new URLSearchParams();
    const city = selectedDestinationData?.cities[0];
    if (city) {
      query.set('city', city);
    }
    if (selectedInterest) {
      query.set('interest', selectedInterest);
    }

    navigate(`/route-generator${query.toString() ? `?${query.toString()}` : ''}`);
  };

  const handleOpenDestination = (slug: string) => {
    const query = new URLSearchParams();
    if (selectedInterest) {
      query.set('interest', selectedInterest);
    }

    navigate(`/destinations/${slug}${query.toString() ? `?${query.toString()}` : ''}`);
  };

  return (
    <Box>
      <Box component="section" py={{ base: 44, md: 72 }}>
        <Container size="xl">
          <Paper
            className={styles.heroShell}
            p={{ base: 'xl', md: '2.8rem' }}
            radius={publicUi.radius.hero}
          >
            <SimpleGrid
              cols={{ base: 1, lg: 2 }}
              spacing={{ base: 'xl', lg: '2.3rem' }}
              className={styles.heroMainGrid}
            >
              <Stack gap="150px" className={styles.heroContent}>
                <div>
                
                  <Title order={1} mt="md" fz="94" className={styles.heroTitle}>
                    {t('homeV2.hero.title', {
                      defaultValue: 'Discover Karakalpakstan with Baramiz',
                    })}
                  </Title>
               
                </div>

            
                <Group gap="sm" wrap="wrap">
                  <Button color="sun" c="#2d2208" size="lg" onClick={handleExplorePlaces}>
                    {t('homeV2.hero.secondaryCta', { defaultValue: 'Explore places' })}
                  </Button>
                  <Button variant="default" size="lg" onClick={handleBuildRoute}>
                    {t('homeV2.hero.routeCta', { defaultValue: 'Build route' })}
                  </Button>
                  <Button variant="subtle" size="md" onClick={handleExploreDestination}>
                    {t('homeV2.planner.exploreButton', { defaultValue: 'Explore destination' })}
                  </Button>
                {selectedDestinationData ? (
                  <Group gap="xs">
                    {selectedDestinationData.bestFor.slice(0, 3).map((item) => (
                      <Badge key={item} color="forest" variant="light" radius="xl">
                        {item}
                      </Badge>
                    ))}
                  </Group>
                ) : null}
                </Group>

              </Stack>

              <Box className={styles.heroVisual}>
                <img
                  src={heroIllustration}
                  alt={t('homeV2.hero.visualAlt', {
                    defaultValue: 'Karakalpakstan destinations collage',
                  })}
                  className={styles.heroIllustration}
                />
              </Box>
            </SimpleGrid>

         
          </Paper>
        </Container>
      </Box>

      {hasDataError ? (
        <Container size="xl">
          <Alert color="yellow" variant="light" mb="xl">
            {t('home.errors.dataUnavailable')}
          </Alert>
        </Container>
      ) : null}

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('homeV2.destinations.eyebrow', { defaultValue: 'Popular destinations' })}
            title={t('homeV2.destinations.title', { defaultValue: 'Start with the destinations travelers ask for first' })}
            description={t('homeV2.destinations.description', {
              defaultValue: 'From Nukus museums to Moynaq and the Aral Sea story, Baramiz organizes Karakalpakstan into clear destination-led journeys.',
            })}
          />

          <Group gap="sm" mb="lg" wrap="wrap">
            {localizedDestinations.map((destination) => (
              <Button
                key={destination.slug}
                variant="light"
                color="forest"
                radius="xl"
                onClick={() => handleOpenDestination(destination.slug)}
              >
                {destination.name}
              </Button>
            ))}
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {localizedDestinations.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                placeCount={destinationCounts[destination.slug]}
              />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('homeV2.categories.eyebrow', { defaultValue: 'Quick categories' })}
            title={t('homeV2.categories.title', { defaultValue: 'Explore places by what travelers care about most' })}
            description={t('homeV2.categories.description', {
              defaultValue: 'Tourism categories come from the backend and help users jump straight to relevant places.',
            })}
            action={
              <Button variant="light" color="forest" onClick={() => navigate('/places')}>
                {t('common.viewAllPlaces')}
              </Button>
            }
          />

          <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="md">
            {categoryShowcase.map((category) => (
              <Paper
                key={category.id}
                withBorder
                p="lg"
                radius="22px"
                style={{ borderColor: 'rgba(44, 54, 46, 0.08)', background: '#fffdf8' }}
              >
                <Stack gap="sm">
                  <Badge color="sun" variant="light" c="#5a420b" w="fit-content">
                    {category.label}
                  </Badge>
                  <Text c="dimmed" style={{ lineHeight: 1.68 }}>
                    {category.description}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <Paper
            withBorder
            p={{ base: 'xl', md: '2rem' }}
            radius={publicUi.radius.panel}
            style={{
              borderColor: publicUi.border.accent,
              background: publicUi.background.accent,
            }}
          >
            <SectionHeading
              eyebrow={t('homeV2.route.eyebrow', { defaultValue: 'Route generator' })}
              title={t('homeV2.route.title', { defaultValue: 'Turn destination research into a practical route' })}
              description={t('homeV2.route.description', {
                defaultValue: 'Baramiz helps travelers move from browsing to action with a route builder designed for practical tourism planning.',
              })}
              action={
                <Button color="sun" c="#2d2208" onClick={() => navigate('/route-generator')}>
                  {t('common.generateRoute')}
                </Button>
              }
            />

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
              {routeSteps.map((step) => (
                <Paper
                  key={step.number}
                  withBorder
                  p="lg"
                  radius="22px"
                  style={{ borderColor: 'rgba(44, 54, 46, 0.08)', background: '#fffdf8' }}
                >
                  <Stack gap="sm">
                    <Badge color="sun" variant="light" c="#5a420b" w="fit-content">
                      {step.number}
                    </Badge>
                    <Text fw={700} size="lg">
                      {step.title}
                    </Text>
                    <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                      {step.description}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <Paper
            withBorder
            p={{ base: 'xl', md: '2rem' }}
            radius={publicUi.radius.panel}
            mb="xl"
            style={{
              borderColor: publicUi.border.default,
              background: publicUi.background.panel,
            }}
          >
            <SectionHeading
              eyebrow={t('homeV2.map.eyebrow', { defaultValue: 'Map and navigation' })}
              title={t('homeV2.map.title', {
                defaultValue: 'Navigate destinations with map-first travel support',
              })}
              description={t('homeV2.map.description', {
                defaultValue:
                  'Open the map to explore places by city and category, create an ordered stop list, then continue in Google Maps or Yandex Maps.',
              })}
              action={
                <Group gap="sm">
                  <Button variant="light" color="forest" onClick={() => navigate('/map')}>
                    {t('homeV2.map.openMap', { defaultValue: 'Open map' })}
                  </Button>
                  <Button color="sun" c="#2d2208" onClick={() => navigate('/route-generator')}>
                    {t('common.generateRoute')}
                  </Button>
                </Group>
              }
            />
          </Paper>

          <SectionHeading
            eyebrow={t('homeV2.featuredPlaces.eyebrow', { defaultValue: 'Featured places' })}
            title={t('homeV2.featuredPlaces.title', { defaultValue: 'Live places ready for real trip planning' })}
            description={t('homeV2.featuredPlaces.description', {
              defaultValue: 'Featured attractions come from the backend so the platform always shows concrete tourism content, not empty promo blocks.',
            })}
            action={
              <Button variant="light" color="forest" onClick={() => navigate('/places')}>
                {t('common.viewAllPlaces')}
              </Button>
            }
          />

          {loading ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="lg">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} h={420} radius="24px" />
              ))}
            </SimpleGrid>
          ) : featuredPlaces.length > 0 ? (
            <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="lg">
              {featuredPlaces.map((place) => (
                <PlaceCard key={String(place.id)} place={place} />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="xl" radius="24px" bg="white">
              <Text c="dimmed">{t('home.featuredPlaces.empty')}</Text>
            </Paper>
          )}
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('homeV2.guides.eyebrow', { defaultValue: 'Local guides directory' })}
            title={t('homeV2.guides.title', { defaultValue: 'Connect travelers with guides who know the region' })}
            description={t('homeV2.guides.description', {
              defaultValue: 'A strong tourism platform needs more than places. It needs trusted people who can translate local knowledge into a better trip.',
            })}
          />

          <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="lg">
            {guideProfiles.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 36 }}>
        <Container size="xl">
          <SectionHeading
            eyebrow={t('homeV2.services.eyebrow', { defaultValue: 'Tourism services' })}
            title={t('homeV2.services.title', { defaultValue: 'Hotels, transport, and tours in one platform flow' })}
            description={t('homeV2.services.description', {
              defaultValue: 'Baramiz should feel like a real travel product, so services sit beside destinations and route planning instead of outside the experience.',
            })}
            action={
              <Button variant="light" color="forest" onClick={() => navigate('/services')}>
                {t('common.browseServices')}
              </Button>
            }
          />

          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
            {(servicesShowcase.length > 0 ? servicesShowcase : localizedServiceSections.slice(0, 3)).map((section) => (
              <ServiceCard
                key={section.id}
                item={section.items[0]}
                actionLabel={t('homeV2.services.cardAction', { defaultValue: 'Open service' })}
              />
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Box component="section" py={{ base: 24, md: 56 }}>
        <Container size="xl">
          <Paper
            withBorder
            p={{ base: 'xl', md: '2rem' }}
            radius={publicUi.radius.panel}
            style={{ borderColor: publicUi.border.soft, background: publicUi.background.surfaceSoft }}
          >
            <SectionHeading
              eyebrow={t('homeV2.why.eyebrow', { defaultValue: 'Why Baramiz' })}
              title={t('homeV2.why.title', { defaultValue: 'A tourism platform with warm local context and practical planning' })}
              description={t('homeV2.why.description', {
                defaultValue: 'Baramiz combines destination discovery, guides, services, and route planning into one travel product for Karakalpakstan.',
              })}
            />

            <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="md">
              {whyItems.map((item, index) => (
                <Paper
                  key={item.title}
                  withBorder
                  p="lg"
                  radius="22px"
                  style={{ borderColor: 'rgba(44, 54, 46, 0.08)', background: '#ffffff' }}
                >
                  <Stack gap="sm">
                    <Badge color="sun" variant="light" c="#5a420b" w="fit-content">
                      0{index + 1}
                    </Badge>
                    <Text fw={700} size="lg">
                      {item.title}
                    </Text>
                    <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                      {item.description}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
