import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Container,
  Paper,
  SimpleGrid,
  Skeleton,
  Group,
  Text,
  TextInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { getPlaces } from '../entities/place/api/placeApi';
import { DestinationCard } from '../components/DestinationCard';
import { featuredDestinations, getLocalizedDestinations } from '../data/destinations';
import type { Place } from '../types/api';

export function DestinationsPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');

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
        if (!active) {
          return;
        }
        setHasError(true);
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
  const filteredDestinations = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return localizedDestinations;
    }

    return localizedDestinations.filter((destination) => {
      const haystack = [
        destination.name,
        destination.kicker,
        destination.summary,
        destination.overview,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [localizedDestinations, search]);

  const destinationCounts = useMemo(() => {
    return Object.fromEntries(
      featuredDestinations.map((destination) => [
        destination.slug,
        places.filter((place) => destination.cities.includes(place.city ?? '')).length,
      ]),
    );
  }, [places]);

  return (
    <Container size="xl" py={{ base: 28, md: 40 }}>
      <Paper
        withBorder
        radius="24px"
        p={{ base: 'md', md: 'lg' }}
        mb="lg"
        style={{
          border: '1px solid rgba(23, 49, 42, 0.08)',
          background: 'white',
        }}
      >
        <Group justify="space-between" align="flex-end" gap="sm" wrap="wrap">
          <div>
            <Text fw={800} fz="1.25rem">
              {t('nav.destinations')}
            </Text>
            <Text size="sm" c="dimmed">
              {t('destinationsPage.section.eyebrow')}
            </Text>
          </div>
          <TextInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder={t('destinationsPage.searchPlaceholder', {
              defaultValue: 'Search destination...',
            })}
            w={{ base: '100%', sm: 320 }}
            aria-label={t('common.search')}
          />
        </Group>
      </Paper>

      {hasError ? (
        <Alert color="yellow" variant="light" mb="lg">
          {t('destinationsPage.errors.countsUnavailable')}
        </Alert>
      ) : null}

      {!loading && filteredDestinations.length > 0 ? (
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
            <Skeleton key={index} h={420} radius="32px" />
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
          <Text c="dimmed">
            {t('common.noResults')}
          </Text>
        </Paper>
      )}
    </Container>
  );
}
