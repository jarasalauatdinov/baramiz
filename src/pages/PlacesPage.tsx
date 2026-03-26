import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
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
  const [search] = useState('');

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
      { value: 'all', label: t('common.allCategories') },
      ...categories.map((category) => ({ value: String(category.id), label: formatCategoryLabel(String(category.id), t) })),
    ],
    [categories, t],
  );

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCity = selectedCity === 'all' || place.city === selectedCity;
      const matchesCategory =
        selectedCategory === 'all' ||
        String(place.categoryId ?? place.categoryName ?? '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !query ||
        place.name.toLowerCase().includes(query) ||
        (place.description ?? '').toLowerCase().includes(query);

      return matchesCity && matchesCategory && matchesSearch;
    });
  }, [places, search, selectedCategory, selectedCity]);

  const mapQueryString = useMemo(() => {
    const query = new URLSearchParams();
    if (selectedCity !== 'all') {
      query.set('city', selectedCity);
    }
    if (selectedCategory !== 'all') {
      query.set('category', selectedCategory);
    }

    return query.toString() ? `?${query.toString()}` : '';
  }, [selectedCategory, selectedCity]);

  return (
    <Container size="xl" py={{ base: 28, md: 40 }}>
    
      {hasError ? (
        <Alert color="yellow" variant="light" mb="lg">
          {t('placesPage.errors.dataUnavailable')}
        </Alert>
      ) : null}

      <Group justify="space-between" align="flex-end" mb="md" wrap="wrap">
        <div>
          <Text fw={700} fz="1.15rem">
            {t('placesPage.results.title', { count: filteredPlaces.length })}
          </Text>
          <Text size="sm" c="dimmed">
            {t('placesPage.results.description')}
          </Text>
        </div>
      </Group>

      {loading ? (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} h={420} radius="32px" />
          ))}
        </SimpleGrid>
      ) : filteredPlaces.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
          {filteredPlaces.map((place) => (
            <PlaceCard key={String(place.id)} place={place} />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl" radius="32px" bg="white">
          <Text c="dimmed">{t('placesPage.results.empty')}</Text>
        </Paper>
      )}
    </Container>
  );
}
