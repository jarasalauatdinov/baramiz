import { useMemo } from 'react';
import {
  Alert,
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
import { Link } from 'react-router-dom';
import { DestinationImage, PageSection } from '../../../shared/ui';
import { publicUi } from '../../../shared/config/publicUi';
import type { Place } from '../../../entities/place';
import { formatCategoryLabel, formatMinutesLabel, PlaceCard } from '../../../entities/place';
import { routePaths } from '../../../router/paths';

interface SelectOption {
  value: string;
  label: string;
}

interface CategoryOption {
  id: string;
  label: string;
}

interface PlacesExplorerScreenProps {
  loading: boolean;
  hasError: boolean;
  places: Place[];
  search: string;
  selectedCity: string;
  selectedCategory: string;
  cityOptions: SelectOption[];
  categoryOptions: CategoryOption[];
  routeBuilderQuery: string;
  onSearchChange: (value: string) => void;
  onSelectCity: (value: string) => void;
  onSelectCategory: (value: string) => void;
}

export function PlacesExplorerScreen({
  loading,
  hasError,
  places,
  search,
  selectedCity,
  selectedCategory,
  cityOptions,
  categoryOptions,
  routeBuilderQuery,
  onSearchChange,
  onSelectCity,
  onSelectCategory,
}: PlacesExplorerScreenProps) {
  const { t } = useTranslation();

  const hasActiveFilters =
    search.trim().length > 0 || selectedCity !== 'all' || selectedCategory !== 'all';
  const spotlightPlace = places[0] ?? null;
  const remainingPlaces = spotlightPlace ? places.slice(1) : places;

  const resultBadge = useMemo(
    () => (!loading && hasActiveFilters ? t('placesPage.results.title', { count: places.length }) : null),
    [hasActiveFilters, loading, places.length, t],
  );

  return (
    <PageSection py={{ base: 14, md: 22 }}>
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end" wrap="wrap">
          <Stack gap={2}>
            <Text size="xs" fw={700} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
              {t('placesPage.pageEyebrow', { defaultValue: 'Explore' })}
            </Text>
            <Text fw={800} size="1.45rem" lh={1.08}>
              {t('placesPage.pageTitle', { defaultValue: 'Explore places' })}
            </Text>
          </Stack>

          {resultBadge ? (
            <Badge color="gray" variant="light" radius="xl">
              {resultBadge}
            </Badge>
          ) : null}
        </Group>

        {hasError ? <Alert color="yellow" variant="light">{t('placesPage.errors.dataUnavailable')}</Alert> : null}

        <Paper withBorder p="md" radius="26px" bg={publicUi.background.surfaceWarm}>
          <Stack gap="md">
            <TextInput
              placeholder={t('placesPage.filters.searchPlaceholder', {
                defaultValue: 'Search place name',
              })}
              value={search}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              radius="xl"
              size="md"
              styles={{
                input: {
                  minHeight: 52,
                  background: '#fff',
                  borderColor: publicUi.border.default,
                  boxShadow: publicUi.shadow.cardSoft,
                },
              }}
            />

            <Group grow>
              <Select
                data={cityOptions}
                placeholder={t('placesPage.filters.cityLabel', { defaultValue: 'Destination' })}
                value={selectedCity}
                onChange={(value) => onSelectCity(value ?? 'all')}
                radius="xl"
              />
            </Group>

            {hasActiveFilters ? (
              <Group gap="xs" wrap="wrap">
                {selectedCity !== 'all' ? (
                  <Badge color="forest" variant="light" radius="xl">
                    {selectedCity}
                  </Badge>
                ) : null}
                {selectedCategory !== 'all' ? (
                  <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                    {formatCategoryLabel(selectedCategory, t)}
                  </Badge>
                ) : null}
              </Group>
            ) : null}

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
                    onClick={() => onSelectCategory(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </Group>
            </ScrollArea>
          </Stack>
        </Paper>

        {loading ? (
          <Stack gap="md">
            <Skeleton h={260} radius="32px" />
            <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="md">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} h={420} radius="32px" />
              ))}
            </SimpleGrid>
          </Stack>
        ) : places.length > 0 ? (
          <Stack gap="md">
            {spotlightPlace ? (
              <Paper
                component={Link}
                to={routePaths.appPlaceDetails(String(spotlightPlace.id))}
                withBorder
                radius="30px"
                p={0}
                style={{
                  overflow: 'hidden',
                  textDecoration: 'none',
                  borderColor: publicUi.border.default,
                  boxShadow: publicUi.shadow.card,
                  background: publicUi.background.surfaceWarm,
                }}
              >
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
                  <DestinationImage
                    src={spotlightPlace.imageUrl}
                    name={spotlightPlace.name}
                    city={spotlightPlace.city}
                    category={spotlightPlace.category}
                    aspectRatio="4 / 3"
                    height="100%"
                    radius={0}
                  />
                  <Stack p={{ base: 'lg', md: 'xl' }} gap="md" justify="space-between">
                    <Stack gap="xs">
                      <Group gap="xs" wrap="wrap">
                        <Badge color="gray" variant="filled" radius="xl">
                          {t('placesPage.spotlight.badge', { defaultValue: 'Spotlight' })}
                        </Badge>
                        <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                          {spotlightPlace.city}
                        </Badge>
                        <Badge color="forest" variant="light" radius="xl">
                          {formatCategoryLabel(spotlightPlace.category, t)}
                        </Badge>
                      </Group>
                      <Text fw={800} size="1.4rem" lh={1.12}>
                        {spotlightPlace.name}
                      </Text>
                      <Text c="dimmed" size="sm" style={{ lineHeight: 1.65 }} lineClamp={3}>
                        {spotlightPlace.description}
                      </Text>
                    </Stack>
                    <Group justify="space-between" align="center" wrap="wrap">
                      <Text size="sm" fw={700} c="forest.8">
                        {formatMinutesLabel(spotlightPlace.durationMinutes, t)}
                      </Text>
                      <Button
                        variant="filled"
                        color="sun"
                        c="#2d2208"
                        radius="xl"
                        style={{ boxShadow: '0 12px 24px rgba(229, 182, 47, 0.18)' }}
                      >
                        {t('common.explorePlace', { defaultValue: 'Explore place' })}
                      </Button>
                    </Group>
                  </Stack>
                </SimpleGrid>
              </Paper>
            ) : null}

            {remainingPlaces.length > 0 ? (
              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                {remainingPlaces.map((place) => (
                  <PlaceCard key={String(place.id)} place={place} variant="immersive" />
                ))}
              </SimpleGrid>
            ) : null}
          </Stack>
        ) : (
          <Paper withBorder p="xl" radius="32px" bg="white">
            <Text c="dimmed">{t('placesPage.results.empty')}</Text>
          </Paper>
        )}

        <Paper withBorder p="lg" radius="28px" bg={publicUi.background.surfaceWarm}>
          <Stack gap="sm">
            <Text fw={800} size="lg">
              {t('placesPage.cta.title', { defaultValue: 'Ready to turn this into a route?' })}
            </Text>
            <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
              {t('placesPage.cta.description', {
                defaultValue: 'Keep discovery light, then move into route planning or local support when you are ready.',
              })}
            </Text>
            <SimpleGrid cols={2} spacing="sm">
              <Button component={Link} to={routeBuilderQuery} color="sun" c="#2d2208" radius="xl">
                {t('common.generateRoute')}
              </Button>
              <Button component={Link} to={routePaths.appGuides} variant="light" color="forest" radius="xl">
                {t('pages.appNav.guides')}
              </Button>
            </SimpleGrid>
          </Stack>
        </Paper>
      </Stack>
    </PageSection>
  );
}