import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
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
import { PlaceCard } from '../components/PlaceCard';
import { PageSection } from '../components/layout/PageSection';
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
      { id: ALL_CATEGORY, label: t('pages.appHome.categories.all') },
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

  const highlightedDestinations = useMemo(() => destinations.slice(0, 3), [destinations]);
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
    <PageSection py={{ base: 14, md: 20 }}>
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              {t('pages.appHome.greeting')}
            </Text>
            <Text fw={800} size="1.22rem" lh={1.12}>
              {t('common.appName')}
            </Text>
          </Stack>
          <Group gap="xs" wrap="nowrap">
            <Badge variant="light" color="sun" radius="xl" c="#5a420b">
              {localizedDate}
            </Badge>
            <Avatar radius="xl" size={34} color="dune" c="#5f3824">
              BA
            </Avatar>
          </Group>
        </Group>

        <TextInput
          placeholder={t('pages.appHome.filters.searchPlaceholder')}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          radius="xl"
          size="md"
          styles={{
            input: {
              background: '#fff',
              borderColor: 'rgba(187, 145, 109, 0.28)',
              boxShadow: '0 10px 24px rgba(61, 46, 30, 0.08)',
            },
          }}
        />

        <Paper
          withBorder
          radius={publicUi.radius.hero}
          p={0}
          style={{
            borderColor: 'rgba(193, 148, 117, 0.28)',
            overflow: 'hidden',
            boxShadow: publicUi.shadow.hero,
          }}
        >
          <DestinationImage
            src={selectedDestinationData?.heroImage}
            name={selectedDestinationData?.name ?? t('common.appName')}
            city={selectedDestinationData?.city}
            category={selectedDestinationData?.heroCategory}
            height={210}
            radius={0}
          >
            <div style={{ position: 'absolute', inset: 16, zIndex: 1, display: 'grid', alignContent: 'space-between' }}>
              <Badge color="sun" variant="light" radius="xl" c="#5a420b" w="fit-content">
                {t('pages.appHome.hero.eyebrow')}
              </Badge>
              <Stack gap={4}>
                <Text fw={800} c="white" size="clamp(1.4rem, 6vw, 1.95rem)" lh={1.05}>
                  {t('pages.appHome.hero.title')}
                </Text>
                <Text size="sm" c="rgba(255,255,255,0.88)">
                  {t('pages.appHome.hero.description')}
                </Text>
              </Stack>
            </div>
          </DestinationImage>
          <Stack p="md" gap="sm" bg="#fffdf8">
            <Select
              label={t('common.destination')}
              data={destinationOptions}
              value={selectedDestination}
              onChange={(value) => setSelectedDestination(value ?? 'nukus')}
            />
            <Button color="sun" c="#2d2208" radius="xl" onClick={navigateToRouteBuilder}>
              {t('common.generateRoute')}
            </Button>
          </Stack>
        </Paper>

        <ScrollArea type="never" offsetScrollbars>
          <Group gap="xs" wrap="nowrap" pb={4}>
            {categoryOptions.map((category) => (
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
        </ScrollArea>

        {hasDataError ? (
          <Alert color="yellow" variant="light">
            {t('homepage.errors.dataUnavailable')}
          </Alert>
        ) : null}

        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text fw={800} size="lg">
              {t('pages.appHome.featured.title')}
            </Text>
            <Button variant="subtle" component={Link} to={routePaths.appExplore}>
              {t('common.viewAllPlaces')}
            </Button>
          </Group>

          {loading ? (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} h={352} radius="24px" />
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

        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text fw={800} size="lg">
              {t('pages.appHome.destinations.title')}
            </Text>
            <Button variant="subtle" component={Link} to={routePaths.appDestinations}>
              {t('common.browseDestinations')}
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
            {highlightedDestinations.map((destination) => (
              <Paper
                key={destination.slug}
                component={Link}
                to={routePaths.appDestinationDetails(destination.slug)}
                withBorder
                radius="22px"
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
                  <div style={{ position: 'absolute', inset: 'auto 12px 12px 12px', zIndex: 1 }}>
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

        <Paper withBorder radius="24px" p="lg" bg="white">
          <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
            <Stack gap={2}>
              <Text size="xs" fw={700} c="sun.8" tt="uppercase">
                {t('pages.appHome.support.servicesEyebrow')}
              </Text>
              <Text fw={800}>{t('pages.appHome.support.servicesTitle')}</Text>
              <Text c="dimmed" size="sm">
                {t('pages.appHome.support.servicesDescription', {
                  services: serviceCount,
                  guides: guideProfiles.length,
                })}
              </Text>
            </Stack>
            <Button component={Link} to={routePaths.appServices} radius="xl" color="forest" variant="light">
              {t('layout.navigation.services')}
            </Button>
          </Group>
        </Paper>
      </Stack>
    </PageSection>
  );
}
