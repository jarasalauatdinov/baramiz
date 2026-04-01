import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
import { useSearchParams } from 'react-router-dom';
import { PageSection } from '../components/layout/PageSection';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { PlaceCard } from '../components/PlaceCard';
import type { Category, Place } from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';

export function PlacesPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city')?.trim() ?? '';
  const queryCategory = searchParams.get('category')?.trim().toLowerCase() ?? '';
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedCity, setSelectedCity] = useState(queryCity || 'all');
  const [selectedCategory, setSelectedCategory] = useState(queryCategory || 'all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces(),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (placesResult.status === 'fulfilled') {
        setPlaces(placesResult.value);
      }

      if (categoriesResult.status === 'rejected' || placesResult.status === 'rejected') {
        console.error('Failed to load places browser', {
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
        });
        setHasError(true);
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (queryCity) {
      setSelectedCity(queryCity);
    }
    if (queryCategory) {
      setSelectedCategory(queryCategory);
    }
  }, [queryCategory, queryCity]);

  const cityOptions = useMemo(() => {
    const values = Array.from(new Set(places.map((place) => place.city).filter(Boolean))) as string[];
    return [{ value: 'all', label: t('common.allDestinations') }, ...values.map((city) => ({ value: city, label: city }))];
  }, [places, t]);

  const categoryOptions = useMemo(
    () => [
      { id: 'all', label: t('common.allCategories') },
      ...categories.map((category) => ({ id: String(category.id), label: formatCategoryLabel(String(category.id), t) })),
    ],
    [categories, t],
  );

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCity = selectedCity === 'all' || place.city === selectedCity;
      const matchesCategory =
        selectedCategory === 'all' ||
        place.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        (place.description ?? '').toLowerCase().includes(query);

      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [places, search, selectedCategory, selectedCity]);

  return (
    <PageSection py={{ base: 14, md: 22 }}>
      <Stack gap="md">
        <Stack gap={2}>
          <Text size="xs" fw={700} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
            {t('placesPage.pageEyebrow', { defaultValue: 'Explore' })}
          </Text>
          <Text fw={800} size="1.45rem" lh={1.12}>
            {t('placesPage.pageTitle', { defaultValue: 'Explore places' })}
          </Text>
        </Stack>

        {hasError ? (
          <Alert color="yellow" variant="light">
            {t('placesPage.errors.dataUnavailable')}
          </Alert>
        ) : null}

        <Paper withBorder p="md" radius="24px" bg="white">
          <Stack gap="sm">
            <TextInput
              placeholder={t('placesPage.filters.searchPlaceholder', {
                defaultValue: 'Search place name',
              })}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              radius="xl"
            />

            <Group grow>
              <Select
                label={t('placesPage.filters.cityLabel', { defaultValue: 'Destination' })}
                data={cityOptions}
                value={selectedCity}
                onChange={(value) => setSelectedCity(value ?? 'all')}
              />
            </Group>

            <ScrollArea type="never" offsetScrollbars>
              <Group gap="xs" wrap="nowrap" pb={4}>
                {categoryOptions.map((category) => (
                  <Button
                    key={category.id}
                    radius="xl"
                    size="compact-sm"
                    variant={selectedCategory === category.id ? 'filled' : 'light'}
                    color={selectedCategory === category.id ? 'sun' : 'gray'}
                    c={selectedCategory === category.id ? '#2d2208' : undefined}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </Group>
            </ScrollArea>
          </Stack>
        </Paper>

        {!loading ? (
          <Text c="dimmed" size="sm">
            {t('placesPage.results.title', { count: filteredPlaces.length })}
          </Text>
        ) : null}

        {loading ? (
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} h={420} radius="32px" />
            ))}
          </SimpleGrid>
        ) : filteredPlaces.length > 0 ? (
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
            {filteredPlaces.map((place) => (
              <PlaceCard key={String(place.id)} place={place} variant="immersive" />
            ))}
          </SimpleGrid>
        ) : (
          <Paper withBorder p="xl" radius="32px" bg="white">
            <Text c="dimmed">{t('placesPage.results.empty')}</Text>
          </Paper>
        )}
      </Stack>
    </PageSection>
  );
}
