import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import { PageHeaderBlock } from '../components/layout/PageHeaderBlock';
import { PageSection } from '../components/layout/PageSection';
import { getPlaces } from '../entities/place/api/placeApi';
import { DestinationCard } from '../components/DestinationCard';
import { getLocalizedDestinations } from '../data/destinations';
import type { Place } from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';

const ALL_OPTION = '__all__';

export function DestinationsPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(ALL_OPTION);
  const [selectedCategory, setSelectedCategory] = useState(ALL_OPTION);

  useEffect(() => {
    let active = true;

    const loadPlaces = async () => {
      try {
        const data = await getPlaces();

        if (!active) {
          return;
        }

        setPlaces(data);
      } catch (error) {
        console.error('Failed to load destination counts', error);
        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadPlaces();

    return () => {
      active = false;
    };
  }, []);

  const localizedDestinations = useMemo(() => getLocalizedDestinations(t), [t]);

  const cityOptions = useMemo(
    () => [
      { value: ALL_OPTION, label: t('destinationsPage.filters.allCities', { defaultValue: 'All cities' }) },
      ...Array.from(new Set(localizedDestinations.map((destination) => destination.city))).map((city) => ({
        value: city,
        label: city,
      })),
    ],
    [localizedDestinations, t],
  );

  const categoryOptions = useMemo(
    () => [
      {
        value: ALL_OPTION,
        label: t('destinationsPage.filters.allCategories', { defaultValue: 'All categories' }),
      },
      ...Array.from(new Set(localizedDestinations.map((destination) => destination.category))).map((category) => ({
        value: category,
        label: formatCategoryLabel(category, t),
      })),
    ],
    [localizedDestinations, t],
  );

  const filteredDestinations = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return localizedDestinations.filter((destination) => {
      const matchesSearch =
        normalized.length === 0 ||
        [
          destination.name,
          destination.kicker,
          destination.summary,
          destination.overview,
          destination.city,
          destination.region,
          destination.category,
          ...destination.tags,
          ...destination.bestFor,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      const matchesCity = selectedCity === ALL_OPTION || destination.city === selectedCity;
      const matchesCategory =
        selectedCategory === ALL_OPTION || destination.category === selectedCategory;

      return matchesSearch && matchesCity && matchesCategory;
    });
  }, [localizedDestinations, search, selectedCategory, selectedCity]);

  const destinationCounts = useMemo(() => {
    return Object.fromEntries(
      localizedDestinations.map((destination) => [
        destination.slug,
        places.filter((place) => destination.cities.includes(place.city ?? '')).length,
      ]),
    );
  }, [localizedDestinations, places]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCity(ALL_OPTION);
    setSelectedCategory(ALL_OPTION);
  };

  return (
    <PageSection py={{ base: 28, md: 40 }}>
      <PageHeaderBlock
        eyebrow={t('destinationsPage.eyebrow', { defaultValue: 'Destinations' })}
        title={t('destinationsPage.title', {
          defaultValue: 'Explore Karakalpakstan through destination-led travel pages',
        })}
        description={t('destinationsPage.description', {
          defaultValue:
            'Browse the main destinations first, then move into places, nearby points, local services, and route planning with clearer travel context.',
        })}
      />

      <Paper withBorder p="lg" radius="24px" mb="xl" bg="white">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <div>
              <Text fw={700} fz="1.05rem">
                {t('destinationsPage.filters.title', { defaultValue: 'Filter destinations' })}
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {t('destinationsPage.filters.description', {
                  defaultValue: 'Use city, category, or a search term to move faster to the right destination page.',
                })}
              </Text>
            </div>
            <Button variant="subtle" color="gray" onClick={clearFilters}>
              {t('common.clearFilters', { defaultValue: 'Clear filters' })}
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <TextInput
              label={t('destinationsPage.filters.searchLabel', { defaultValue: 'Search' })}
              placeholder={t('destinationsPage.filters.searchPlaceholder', {
                defaultValue: 'Search by destination, region, or travel focus',
              })}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
            <Select
              label={t('destinationsPage.filters.cityLabel', { defaultValue: 'City' })}
              data={cityOptions}
              value={selectedCity}
              onChange={(value) => setSelectedCity(value ?? ALL_OPTION)}
            />
            <Select
              label={t('destinationsPage.filters.categoryLabel', { defaultValue: 'Category' })}
              data={categoryOptions}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value ?? ALL_OPTION)}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      {hasError ? (
        <Alert color="yellow" variant="light" mb="lg">
          {t('destinationsPage.errors.countsUnavailable')}
        </Alert>
      ) : null}

      {!loading ? (
        <Text c="dimmed" size="sm" mb="md">
          {t('destinationsPage.resultsCount', {
            count: filteredDestinations.length,
            defaultValue: '{{count}} destinations',
          })}
        </Text>
      ) : null}

      {loading ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} h={460} radius="32px" />
          ))}
        </SimpleGrid>
      ) : filteredDestinations.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.slug}
              destination={destination}
              placeCount={destinationCounts[destination.slug]}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl" radius="32px" bg="white">
          <Stack gap="sm">
            <Text fw={700}>
              {t('destinationsPage.empty.title', { defaultValue: 'No destinations match the current filters' })}
            </Text>
            <Text c="dimmed">
              {t('destinationsPage.empty.description', {
                defaultValue: 'Try another city or category to continue exploring the region.',
              })}
            </Text>
          </Stack>
        </Paper>
      )}
    </PageSection>
  );
}
