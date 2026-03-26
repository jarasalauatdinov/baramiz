import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Container,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
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
  const [search] = useState('');

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
