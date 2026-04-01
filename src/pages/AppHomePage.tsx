import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { DestinationImage } from '../components/DestinationImage';
import { PageSection } from '../components/layout/PageSection';
import { PlaceCard } from '../components/PlaceCard';
import { getLocalizedDestinations } from '../data/destinations';
import { guideProfiles } from '../data/guides';
import { getLocalizedServiceSections } from '../data/services';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import type { Category, Place } from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';

const ALL_CATEGORY = 'all';

interface CategoryOption {
  id: string;
  label: string;
}

export function AppHomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPlaces, setFeaturedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasDataError, setHasDataError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [selectedDestination, setSelectedDestination] = useState('nukus');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces({ featured: true }),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (placesResult.status === 'fulfilled') {
        setFeaturedPlaces(placesResult.value);
      }

      if (categoriesResult.status === 'rejected' || placesResult.status === 'rejected') {
        console.error('Failed to load app home data', {
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
        });
        setHasDataError(true);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  const destinations = useMemo(() => getLocalizedDestinations(t), [t]);
  const selectedDestinationData = useMemo(
    () => destinations.find((item) => item.slug === selectedDestination) ?? destinations[0],
    [destinations, selectedDestination],
  );

  const categoryOptions = useMemo<CategoryOption[]>(
    () => [
      {
        id: ALL_CATEGORY,
        label: t('pages.appHome.categories.all', { defaultValue: 'All categories' }),
      },
      ...categories.map((category) => ({
        id: String(category.id),
        label: formatCategoryLabel(String(category.id), t),
      })),
    ],
    [categories, t],
  );

  const destinationOptions = useMemo(
    () => destinations.map((destination) => ({ value: destination.slug, label: destination.name })),
    [destinations],
  );

  const visiblePlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return featuredPlaces
      .filter((place) => {
        const matchesCategory =
          selectedCategory === ALL_CATEGORY ||
          place.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          place.name.toLowerCase().includes(query) ||
          (place.description ?? '').toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .slice(0, 4);
  }, [featuredPlaces, search, selectedCategory]);

  const featuredDestinations = useMemo(() => destinations.slice(0, 3), [destinations]);
  const localizedDate = useMemo(
    () =>
      new Date().toLocaleDateString(i18n.resolvedLanguage ?? 'en', {
        month: 'short',
        day: 'numeric',
      }),
    [i18n.resolvedLanguage],
  );

  const serviceSections = useMemo(() => getLocalizedServiceSections(t), [t]);
  const serviceCount = useMemo(
    () => serviceSections.reduce((sum, section) => sum + section.items.length, 0),
    [serviceSections],
  );

  const navigateToRouteBuilder = () => {
    const query = new URLSearchParams();
    const city = selectedDestinationData?.cities[0];
    if (city) {
      query.set('city', city);
    }

    if (selectedCategory !== ALL_CATEGORY) {
      query.set('interest', selectedCategory);
    }

    navigate(`${routePaths.appRouteBuilder}${query.toString() ? `?${query.toString()}` : ''}`);
  };

  return (
    <PageSection py={{ base: 16, md: 24 }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('pages.appHome.greeting', { defaultValue: 'Good to see you' })}
            </Text>
            <Text fw={800} size="1.2rem" lh={1.15}>
              {t('common.appName')}
            </Text>
          </Stack>
          <Badge variant="light" color="sun" radius="xl" c="#5a420b">
            {localizedDate}
          </Badge>
        </Group>

        <Paper
          withBorder
          p={{ base: 'md', md: 'xl' }}
          radius="30px"
          style={{
            borderColor: 'rgba(219, 189, 139, 0.32)',
            background:
              'linear-gradient(140deg, rgba(255,248,233,0.98), rgba(255,254,249,0.98))',
            boxShadow: '0 16px 36px rgba(59, 45, 24, 0.08)',
          }}
        >
          <Stack gap="md">
            <Badge color="sun" variant="light" radius="xl" c="#5a420b" w="fit-content">
              {t('pages.appHome.hero.eyebrow', { defaultValue: 'Route planner' })}
            </Badge>
            <Text fw={800} size="clamp(1.4rem, 6vw, 1.95rem)" lh={1.08}>
              {t('pages.appHome.hero.title', {
                defaultValue: 'Build a practical route in a few taps',
              })}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Select
                label={t('common.destination')}
                data={destinationOptions}
                value={selectedDestination}
                onChange={(value) => setSelectedDestination(value ?? 'nukus')}
              />
              <Button
                color="sun"
                c="#2d2208"
                onClick={navigateToRouteBuilder}
                mt={{ base: 0, sm: 24 }}
                radius="xl"
              >
                {t('common.generateRoute')}
              </Button>
            </SimpleGrid>
          </Stack>
        </Paper>

        {hasDataError ? (
          <Alert color="yellow" variant="light">
            {t('homepage.errors.dataUnavailable')}
          </Alert>
        ) : null}

        <Paper withBorder p="md" radius="24px" bg="white">
          <Stack gap="sm">
            <TextInput
              placeholder={t('pages.appHome.filters.searchPlaceholder', {
                defaultValue: 'Search museums, nature, food...',
              })}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              radius="xl"
            />
            <Group gap="xs" wrap="wrap">
              {categoryOptions.slice(0, 8).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'filled' : 'light'}
                  color={selectedCategory === category.id ? 'sun' : 'gray'}
                  c={selectedCategory === category.id ? '#2d2208' : undefined}
                  radius="xl"
                  size="compact-sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </Group>
          </Stack>
        </Paper>

        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={800} size="lg">
              {t('pages.appHome.featured.title', { defaultValue: 'Featured places' })}
            </Text>
            <Button variant="subtle" component={Link} to={routePaths.appExplore}>
              {t('common.viewAllPlaces')}
            </Button>
          </Group>

          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} h={360} radius="24px" />
              ))}
            </SimpleGrid>
          ) : visiblePlaces.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {visiblePlaces.map((place) => (
                <PlaceCard key={String(place.id)} place={place} variant="immersive" />
              ))}
            </SimpleGrid>
          ) : (
            <Paper withBorder p="lg" radius="18px" bg={publicUi.background.surfaceSoft}>
              <Text c="dimmed">{t('homepage.places.empty')}</Text>
            </Paper>
          )}
        </Stack>

        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Text fw={800} size="lg">
              {t('pages.appHome.destinations.title', { defaultValue: 'Top destinations' })}
            </Text>
            <Button variant="subtle" component={Link} to={routePaths.appDestinations}>
              {t('common.viewAllDestinations', { defaultValue: 'All destinations' })}
            </Button>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            {featuredDestinations.map((destination) => (
              <Paper
                key={destination.slug}
                component={Link}
                to={routePaths.appDestinationDetails(destination.slug)}
                withBorder
                radius="24px"
                p={0}
                style={{
                  overflow: 'hidden',
                  textDecoration: 'none',
                  borderColor: publicUi.border.default,
                  boxShadow: publicUi.shadow.cardSoft,
                }}
              >
                <DestinationImage
                  src={destination.heroImage}
                  name={destination.name}
                  city={destination.city}
                  category={destination.heroCategory}
                  aspectRatio="4 / 5"
                  height="auto"
                  radius={0}
                >
                  <div style={{ position: 'absolute', inset: 'auto 14px 14px 14px', zIndex: 1 }}>
                    <Text size="xs" fw={700} c="rgba(255,255,255,0.88)" tt="uppercase">
                      {destination.city}
                    </Text>
                    <Text fw={800} size="lg" c="white" mt={4} lh={1.2}>
                      {destination.name}
                    </Text>
                  </div>
                </DestinationImage>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Paper withBorder radius="24px" p="lg" bg="white">
            <Stack gap={6}>
              <Text size="xs" fw={700} c="sun.8" tt="uppercase">
                {t('pages.appHome.support.servicesEyebrow', { defaultValue: 'Services' })}
              </Text>
              <Text fw={800} size="lg">
                {t('pages.appHome.support.servicesTitle', { defaultValue: 'Local travel support' })}
              </Text>
              <Text c="dimmed" size="sm">
                {t('pages.appHome.support.servicesDescription', {
                  defaultValue: '{{count}} options for stays, transport, tours, and tickets.',
                  count: serviceCount,
                })}
              </Text>
              <Button component={Link} to={routePaths.appServices} variant="light" color="forest" radius="xl" mt="xs">
                {t('routeResult.actions.exploreServices', { defaultValue: 'Explore services' })}
              </Button>
            </Stack>
          </Paper>

          <Paper withBorder radius="24px" p="lg" bg="white">
            <Stack gap={6}>
              <Text size="xs" fw={700} c="sun.8" tt="uppercase">
                {t('pages.appHome.support.guidesEyebrow', { defaultValue: 'Guides' })}
              </Text>
              <Text fw={800} size="lg">
                {t('pages.appHome.support.guidesTitle', { defaultValue: 'Local experts' })}
              </Text>
              <Text c="dimmed" size="sm">
                {t('pages.appHome.support.guidesDescription', {
                  defaultValue: '{{count}} guides available across key cities.',
                  count: guideProfiles.length,
                })}
              </Text>
              <Button component={Link} to={routePaths.appGuides} variant="light" color="forest" radius="xl" mt="xs">
                {t('layout.navigation.guides', { defaultValue: 'Guides' })}
              </Button>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </PageSection>
  );
}
