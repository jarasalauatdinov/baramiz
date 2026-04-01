import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DestinationCard } from '../components/DestinationCard';
import { GuideCard } from '../components/GuideCard';
import { HeroDestinationShowcase } from '../components/layout/HeroDestinationShowcase';
import { HeroSection } from '../components/layout/HeroSection';
import { PageSection } from '../components/layout/PageSection';
import { PlaceCard } from '../components/PlaceCard';
import { SectionHeading } from '../components/SectionHeading';
import { ServiceCard } from '../components/ServiceCard';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { featuredDestinations, getLocalizedDestinations } from '../data/destinations';
import { guideProfiles } from '../data/guides';
import { getLocalizedServiceSections } from '../data/services';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import type { Category, Place } from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';

const fallbackCategoryIds = ['history', 'culture', 'museum', 'nature', 'adventure', 'food'];

interface HomeCategoryShowcase {
  id: string;
  label: string;
}

interface HomeStoryCard {
  title: string;
  description: string;
}

const cardSurfaceStyle = {
  borderColor: publicUi.border.default,
  background: publicUi.background.surface,
  boxShadow: publicUi.shadow.cardSoft,
} as const;

const cardSoftStyle = {
  borderColor: publicUi.border.soft,
  background: publicUi.background.surfaceSoft,
} as const;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDataError, setHasDataError] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('nukus');
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

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
  const heroDestinations = useMemo(() => localizedDestinations.slice(0, 4), [localizedDestinations]);
  const featuredDestinationCards = useMemo(
    () => localizedDestinations.slice(0, 2),
    [localizedDestinations],
  );

  const selectedDestinationData =
    localizedDestinations.find((destination) => destination.slug === selectedDestination) ??
    localizedDestinations[0];

  const categoryShowcase = useMemo<HomeCategoryShowcase[]>(() => {
    const options =
      categories.length > 0
        ? categories.map((category) => ({
            value: String(category.id),
            label: formatCategoryLabel(String(category.id), t),
          }))
        : fallbackCategoryIds.map((id) => ({
            value: id,
            label: formatCategoryLabel(id, t),
          }));

    return options.slice(0, 6).map((option) => ({
      id: option.value,
      label: option.label,
    }));
  }, [categories, t]);

  const destinationCounts = useMemo(() => {
    return Object.fromEntries(
      featuredDestinations.map((destination) => [
        destination.slug,
        allPlaces.filter((place) => destination.cities.includes(place.city ?? '')).length,
      ]),
    );
  }, [allPlaces]);

  const featuredPlacesPreview = useMemo(
    () => (featuredPlaces.length > 0 ? featuredPlaces.slice(0, 2) : allPlaces.slice(0, 2)),
    [allPlaces, featuredPlaces],
  );

  const popularServices = useMemo(
    () =>
      localizedServiceSections
        .filter((section) => ['accommodation', 'transport', 'agencies'].includes(section.id))
        .map((section) => ({
          ...section,
          item: section.items[0],
        }))
        .filter((section) => Boolean(section.item))
        .slice(0, 2),
    [localizedServiceSections],
  );

  const featuredGuides = useMemo(() => guideProfiles.slice(0, 2), []);

  const routeSteps = useMemo(
    () => [
      {
        number: '01',
        title: t('pages.home.story.steps.destinationTitle', {
          defaultValue: 'Pick the destination',
        }),
        description: t('pages.home.story.steps.destinationDescription', {
          defaultValue: 'Start with Nukus, Moynaq, or another city that fits the trip.',
        }),
      },
      {
        number: '02',
        title: t('pages.home.story.steps.interestsTitle', {
          defaultValue: 'Add what matters',
        }),
        description: t('pages.home.story.steps.interestsDescription', {
          defaultValue: 'Mix history, museums, nature, food, and local culture.',
        }),
      },
      {
        number: '03',
        title: t('pages.home.story.steps.resultTitle', {
          defaultValue: 'Move into the route',
        }),
        description: t('pages.home.story.steps.resultDescription', {
          defaultValue: 'Open the plan, review stops, and continue into navigation.',
        }),
      },
    ],
    [t],
  );

  const storyPillars = useMemo<HomeStoryCard[]>(
    () => [
      {
        title: t('pages.home.story.pillars.discoveryTitle', {
          defaultValue: 'Destination-first discovery',
        }),
        description: t('pages.home.story.pillars.discoveryDescription', {
          defaultValue: 'Start with where to go, then move into places and routes.',
        }),
      },
      {
        title: t('pages.home.story.pillars.supportTitle', {
          defaultValue: 'Local support in the same flow',
        }),
        description: t('pages.home.story.pillars.supportDescription', {
          defaultValue: 'Guides, stays, transport, and tours stay close to the trip.',
        }),
      },
      {
        title: t('pages.home.story.pillars.contextTitle', {
          defaultValue: 'Regional context stays visible',
        }),
        description: t('pages.home.story.pillars.contextDescription', {
          defaultValue: 'Museums, heritage, and local identity are not flattened away.',
        }),
      },
    ],
    [t],
  );

  const heroHighlights = useMemo(
    () =>
      [selectedDestinationData?.city, ...(selectedDestinationData?.bestFor ?? [])]
        .filter((item): item is string => Boolean(item))
        .slice(0, 2),
    [selectedDestinationData],
  );

  const selectedInterestLabel = selectedInterest
    ? categoryShowcase.find((item) => item.id === selectedInterest)?.label ??
      formatCategoryLabel(selectedInterest, t)
    : t('homepage.quickBuilder.noInterest', { defaultValue: 'No interest selected yet' });

  const handleExploreDestination = () => {
    const query = new URLSearchParams();
    if (selectedInterest) {
      query.set('interest', selectedInterest);
    }

    navigate(
      `${routePaths.destinationDetails(selectedDestination)}${
        query.toString() ? `?${query.toString()}` : ''
      }`,
    );
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

    navigate(`${routePaths.places}${query.toString() ? `?${query.toString()}` : ''}`);
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

    navigate(`${routePaths.routeGenerator}${query.toString() ? `?${query.toString()}` : ''}`);
  };

  return (
    <>
      <PageSection py={{ base: 26, md: 60 }}>
        <HeroSection
          eyebrow={t('pages.home.hero.eyebrow', {
            defaultValue: 'Karakalpakstan travel',
          })}
          title={t('pages.home.hero.title', {
            defaultValue: 'Explore Karakalpakstan with routes and local support',
          })}
          description={t('pages.home.hero.description', {
            defaultValue:
              'Choose a destination, open live places, and plan the trip in a few taps.',
          })}
          actions={
            <Stack gap="md">
              <Group gap="xs" wrap="wrap">
                {heroHighlights.map((item) => (
                  <Badge key={item} color="forest" variant="light" radius="xl">
                    {item}
                  </Badge>
                ))}
              </Group>

              <Group gap="sm" wrap="wrap">
                <Button color="sun" c="#2d2208" size="lg" radius="xl" onClick={handleExploreDestination}>
                  {t('pages.home.hero.primaryCta', { defaultValue: 'Explore destination' })}
                </Button>
                <Button variant="subtle" color="forest" size="lg" radius="xl" onClick={handleBuildRoute}>
                  {t('pages.home.hero.secondaryCta', { defaultValue: 'Build route' })}
                </Button>
              </Group>
            </Stack>
          }
          visual={
            <HeroDestinationShowcase
              destinations={heroDestinations}
              activeSlug={selectedDestination}
              onSelect={setSelectedDestination}
            />
          }
        />

        <Paper
          withBorder
          radius={publicUi.radius.panel}
          p={{ base: 'lg', md: '1.4rem' }}
          mt="lg"
          style={{
            borderColor: 'rgba(221, 193, 152, 0.34)',
            background:
              'linear-gradient(180deg, rgba(255,250,241,0.98), rgba(255,253,249,0.96))',
            boxShadow: '0 18px 36px rgba(58, 41, 19, 0.05)',
          }}
        >
          <Group justify="space-between" align="flex-end" gap="md" mb="lg" wrap="wrap">
            <Stack gap={4}>
              <Text size="xs" fw={800} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.12em' }}>
                {t('pages.home.quickBuilder.eyebrow', {
                  defaultValue: 'Plan fast',
                })}
              </Text>
              <Text fw={800} size="xl" style={{ lineHeight: 1.12, letterSpacing: '-0.02em' }}>
                {t('pages.home.quickBuilder.title', {
                  defaultValue: 'Choose a city, add an interest, and go',
                })}
              </Text>
            </Stack>

            <Badge color="forest" variant="light" radius="xl">
              {selectedDestinationData?.name ?? t('common.appName')}
            </Badge>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
            <Paper withBorder p="lg" radius="24px" style={cardSurfaceStyle}>
              <Stack gap="sm">
                <Text size="sm" fw={700}>
                  {t('homepage.quickBuilder.destinationLabel', {
                    defaultValue: 'Destination',
                  })}
                </Text>
                <Group gap="sm" wrap="wrap">
                  {heroDestinations.map((destination) => {
                    const active = destination.slug === selectedDestination;
                    return (
                      <Button
                        key={destination.slug}
                        variant={active ? 'filled' : 'light'}
                        color={active ? 'sun' : 'forest'}
                        c={active ? '#2d2208' : undefined}
                        radius="xl"
                        onClick={() => setSelectedDestination(destination.slug)}
                      >
                        {destination.name}
                      </Button>
                    );
                  })}
                </Group>
              </Stack>
            </Paper>

            <Paper withBorder p="lg" radius="24px" style={cardSurfaceStyle}>
              <Stack gap="sm">
                <Text size="sm" fw={700}>
                  {t('homepage.quickBuilder.interestsLabel', {
                    defaultValue: 'Interest',
                  })}
                </Text>
                <Group gap="sm" wrap="wrap">
                  {categoryShowcase.map((category) => {
                    const active = category.id === selectedInterest;
                    return (
                      <Button
                        key={category.id}
                        variant={active ? 'filled' : 'light'}
                        color={active ? 'sun' : 'gray'}
                        c={active ? '#2d2208' : undefined}
                        radius="xl"
                        onClick={() =>
                          setSelectedInterest((current) =>
                            current === category.id ? null : category.id,
                          )
                        }
                      >
                        {category.label}
                      </Button>
                    );
                  })}
                </Group>
              </Stack>
            </Paper>

            <Paper withBorder p="lg" radius="24px" style={cardSurfaceStyle}>
              <Stack gap="sm" h="100%" justify="space-between">
                <Stack gap={6}>
                  <Text size="sm" c="dimmed">
                    {t('pages.home.quickBuilder.summaryBadge', {
                      defaultValue: 'Next step',
                    })}
                  </Text>
                  <Text fw={800} size="lg">
                    {selectedInterestLabel}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {t('pages.home.quickBuilder.summaryText', {
                      defaultValue: 'Open the destination, browse places, or go straight to the route.',
                    })}
                  </Text>
                </Stack>

                <Stack gap="xs">
                  <Button color="sun" c="#2d2208" size="md" onClick={handleBuildRoute} fullWidth>
                    {t('common.generateRoute')}
                  </Button>
                  <Button variant="light" color="forest" size="md" onClick={handleExploreDestination} fullWidth>
                    {t('homepage.quickBuilder.destinationAction', {
                      defaultValue: 'Open destination',
                    })}
                  </Button>
                  <Button variant="subtle" size="md" onClick={handleExplorePlaces} fullWidth>
                    {t('homepage.quickBuilder.placesAction', {
                      defaultValue: 'Browse places',
                    })}
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Paper>
      </PageSection>

      {hasDataError ? (
        <PageSection py={0}>
          <Alert color="yellow" variant="light" mb="xl">
            {t('homepage.errors.dataUnavailable')}
          </Alert>
        </PageSection>
      ) : null}

      <PageSection>
        <SectionHeading
          eyebrow={t('pages.home.discover.eyebrow', {
            defaultValue: 'Start exploring',
          })}
          title={t('pages.home.discover.title', {
            defaultValue: 'Pick a destination or open live places',
          })}
          action={
            <Group gap="sm" wrap="wrap">
              <Button variant="light" color="forest" onClick={() => navigate(routePaths.destinations)}>
                {t('common.exploreDestination')}
              </Button>
              <Button variant="subtle" onClick={() => navigate(routePaths.places)}>
                {t('common.viewAllPlaces')}
              </Button>
            </Group>
          }
        />

        <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xl">
          <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="26px" style={cardSurfaceStyle}>
            <Stack gap="lg">
              <Text size="sm" fw={700} c="forest.8">
                {t('pages.home.discover.destinationsLabel', {
                  defaultValue: 'Featured destinations',
                })}
              </Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {featuredDestinationCards.map((destination) => (
                  <DestinationCard
                    key={destination.slug}
                    destination={destination}
                    placeCount={destinationCounts[destination.slug]}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          </Paper>

          <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="26px" style={cardSurfaceStyle}>
            <Stack gap="lg">
              <Text size="sm" fw={700} c="forest.8">
                {t('pages.home.discover.placesLabel', {
                  defaultValue: 'Live place highlights',
                })}
              </Text>
              {loading ? (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} h={380} radius="24px" />
                  ))}
                </SimpleGrid>
              ) : featuredPlacesPreview.length > 0 ? (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                  {featuredPlacesPreview.map((place) => (
                    <PlaceCard key={String(place.id)} place={place} />
                  ))}
                </SimpleGrid>
              ) : (
                <Paper withBorder p="xl" radius="24px" bg="white">
                  <Text c="dimmed">{t('homepage.places.empty')}</Text>
                </Paper>
              )}
            </Stack>
          </Paper>
        </SimpleGrid>
      </PageSection>

      <PageSection>
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
            eyebrow={t('pages.home.support.eyebrow', {
              defaultValue: 'Local support',
            })}
            title={t('pages.home.support.title', {
              defaultValue: 'Find stays, transport, and people who know the region',
            })}
          />

          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xl">
            <Stack gap="lg">
              <Group justify="space-between" align="center" gap="sm" wrap="wrap">
                <Text size="sm" fw={700} c="forest.8">
                  {t('pages.home.support.servicesLabel', {
                    defaultValue: 'Popular services',
                  })}
                </Text>
                <Button variant="subtle" color="forest" onClick={() => navigate(routePaths.services)}>
                  {t('common.browseServices')}
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {popularServices.map((section) => (
                  <ServiceCard
                    key={section.id}
                    item={section.item}
                    kind={section.id}
                    actionLabel={t('homepage.services.cardAction', {
                      defaultValue: 'Open service',
                    })}
                  />
                ))}
              </SimpleGrid>
            </Stack>

            <Stack gap="lg">
              <Group justify="space-between" align="center" gap="sm" wrap="wrap">
                <Text size="sm" fw={700} c="forest.8">
                  {t('pages.home.support.guidesLabel', {
                    defaultValue: 'Local guides',
                  })}
                </Text>
                <Button variant="subtle" color="forest" onClick={() => navigate(routePaths.guides)}>
                  {t('homepage.guides.actionLabel', { defaultValue: 'Guides' })}
                </Button>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                {featuredGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </SimpleGrid>
            </Stack>
          </SimpleGrid>
        </Paper>
      </PageSection>

      <PageSection>
        <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xl">
          <Paper withBorder p={{ base: 'xl', md: '2rem' }} radius={publicUi.radius.panel} style={cardSurfaceStyle}>
            <SectionHeading
              eyebrow={t('pages.home.story.eyebrow', {
                defaultValue: 'Why Baramiz',
              })}
              title={t('pages.home.story.title', {
                defaultValue: 'Built for real travel decisions',
              })}
            />

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              {storyPillars.map((item, index) => (
                <Paper key={item.title} withBorder p="lg" radius="22px" style={cardSoftStyle}>
                  <Stack gap="sm">
                    <Badge color="sun" variant="light" c="#5a420b" w="fit-content">
                      0{index + 1}
                    </Badge>
                    <Text fw={700} size="lg">
                      {item.title}
                    </Text>
                    <Text c="dimmed" size="sm" style={{ lineHeight: 1.65 }}>
                      {item.description}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>

          <Paper withBorder p={{ base: 'xl', md: '2rem' }} radius={publicUi.radius.panel} style={cardSurfaceStyle}>
            <Stack gap="lg" h="100%">
              <Stack gap={6}>
                <Text size="xs" fw={800} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.12em' }}>
                  {t('pages.home.story.stepsEyebrow', {
                    defaultValue: 'How it works',
                  })}
                </Text>
                <Text fw={800} size="1.8rem" style={{ lineHeight: 1.12, letterSpacing: '-0.03em' }}>
                  {t('pages.home.story.stepsTitle', {
                    defaultValue: 'Three clear moves into a route',
                  })}
                </Text>
              </Stack>

              <Stack gap="md">
                {routeSteps.map((step) => (
                  <Group key={step.number} align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon size={38} radius="xl" color="sun" c="#2d2208" variant="filled">
                      {step.number}
                    </ThemeIcon>
                    <Stack gap={4}>
                      <Text fw={700}>{step.title}</Text>
                      <Text c="dimmed" size="sm" style={{ lineHeight: 1.65 }}>
                        {step.description}
                      </Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>

              <Button color="sun" c="#2d2208" onClick={handleBuildRoute} w="fit-content">
                {t('common.generateRoute')}
              </Button>
            </Stack>
          </Paper>
        </SimpleGrid>
      </PageSection>

      <PageSection py={{ base: 22, md: 52 }}>
        <Paper
          withBorder
          p={{ base: 'xl', md: '2rem' }}
          radius={publicUi.radius.panel}
          style={{
            borderColor: publicUi.border.accent,
            background: publicUi.background.accent,
          }}
        >
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
            <Stack gap="sm">
              <Badge color="forest" variant="light" radius="xl" w="fit-content">
                {t('pages.home.final.eyebrow', { defaultValue: 'Ready to start?' })}
              </Badge>
              <Text fw={800} size="clamp(1.8rem, 4vw, 2.8rem)" style={{ lineHeight: 1.06, letterSpacing: '-0.03em' }}>
                {t('pages.home.final.title', {
                  defaultValue: 'Start with a place. Leave with a route.',
                })}
              </Text>
              <Text c="dimmed" style={{ lineHeight: 1.65, maxWidth: 520 }}>
                {t('pages.home.final.description', {
                  defaultValue: 'Open the destination now or jump straight into planning.',
                })}
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" h="fit-content">
              <Button color="sun" c="#2d2208" onClick={handleBuildRoute} fullWidth>
                {t('common.generateRoute')}
              </Button>
              <Button variant="light" color="forest" onClick={handleExploreDestination} fullWidth>
                {t('homepage.finalCta.destinationAction', {
                  defaultValue: 'Open destination',
                })}
              </Button>
              <Button variant="subtle" onClick={handleExplorePlaces} fullWidth>
                {t('homepage.quickBuilder.placesAction', {
                  defaultValue: 'Browse places',
                })}
              </Button>
            </SimpleGrid>
          </SimpleGrid>
        </Paper>
      </PageSection>
    </>
  );
}
