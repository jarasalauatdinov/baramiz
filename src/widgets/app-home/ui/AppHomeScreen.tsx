import { useMemo } from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { Category } from '../../../entities/category';
import type { DestinationConfig } from '../../../entities/destination';
import type { Place } from '../../../entities/place';
import { formatCategoryLabel, PlaceCard } from '../../../entities/place';
import { routePaths } from '../../../router/paths';
import { publicUi } from '../../../shared/config/publicUi';
import { DestinationImage, PageSection } from '../../../shared/ui';
import styles from './AppHomeScreen.module.css';

const ALL_CATEGORY = 'all';

interface AppHomeScreenProps {
  greeting: string;
  localizedDate: string;
  profileInitials: string;
  categories: Category[];
  featuredPlaces: Place[];
  selectedDestinationData: DestinationConfig | null;
  selectedCategory: string;
  search: string;
  loading: boolean;
  hasDataError: boolean;
  serviceCount: number;
  guideCount: number;
  onSearchChange: (value: string) => void;
  onSelectCategory: (value: string) => void;
  onNavigateToRouteBuilder: () => void;
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={styles.glyph}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

function TuneGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={styles.glyph}>
      <path d="M5 7h14" />
      <path d="M5 17h14" />
      <path d="M9 4v6" />
      <path d="M15 14v6" />
    </svg>
  );
}

export function AppHomeScreen({
  greeting,
  localizedDate,
  profileInitials,
  categories,
  featuredPlaces,
  selectedDestinationData,
  selectedCategory,
  search,
  loading,
  hasDataError,
  serviceCount,
  guideCount,
  onSearchChange,
  onSelectCategory,
  onNavigateToRouteBuilder,
}: AppHomeScreenProps) {
  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () => [
      { id: ALL_CATEGORY, label: t('pages.appHome.categories.all') },
      ...categories.map((category) => ({
        id: String(category.id),
        label: formatCategoryLabel(String(category.id), t),
      })),
    ],
    [categories, t],
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

  return (
    <PageSection py={{ base: 14, md: 20 }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="nowrap" className={styles.topBar}>
          <Stack className={styles.topBarCopy}>
            <Text size="sm" fw={700} c="forest.8">
              {greeting}
            </Text>
            <div className={styles.topBarMeta}>
              <Badge radius="xl" variant="light" className={styles.dateBadge}>
                {localizedDate}
              </Badge>
            </div>
          </Stack>
          <Avatar radius="xl" size={42} color="dune" className={styles.homeAvatar}>
            {profileInitials}
          </Avatar>
        </Group>

        <Paper
          radius={publicUi.radius.hero}
          p={0}
          className={styles.heroCard}
        >
          <DestinationImage
            src={selectedDestinationData?.heroImage}
            name={selectedDestinationData?.name ?? t('common.appName')}
            city={selectedDestinationData?.city}
            category={selectedDestinationData?.heroCategory}
            height={282}
            radius={0}
          >
            <div className={styles.heroOverlay}>
              <div className={styles.heroTop}>
                <Badge color="sun" variant="light" radius="xl" c="#5a420b" className={styles.heroEyebrow}>
                  {t('pages.appHome.hero.eyebrow')}
                </Badge>
                {selectedDestinationData?.city ? (
                  <Badge color="forest" variant="light" radius="xl">
                    {selectedDestinationData.city}
                  </Badge>
                ) : null}
              </div>

              <Stack className={styles.heroBottom}>
                <Stack gap={6}>
                  <Text className={styles.heroTitle}>{t('pages.appHome.hero.title')}</Text>
                  <Text size="sm" className={styles.heroDescription}>
                    {selectedDestinationData?.kicker ?? t('pages.appHome.hero.description')}
                  </Text>
                </Stack>

                <Group gap="xs" wrap="wrap">
                  {selectedDestinationData?.name ? (
                    <Badge color="dune" variant="light" radius="xl">
                      {selectedDestinationData.name}
                    </Badge>
                  ) : null}
                  {selectedCategory !== ALL_CATEGORY ? (
                    <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                      {formatCategoryLabel(selectedCategory, t)}
                    </Badge>
                  ) : null}
                </Group>

                <Button
                  color="sun"
                  c="#2d2208"
                  radius="xl"
                  size="md"
                  onClick={onNavigateToRouteBuilder}
                  className={styles.heroCta}
                >
                  {t('common.generateRoute')}
                </Button>
              </Stack>
            </div>
          </DestinationImage>
        </Paper>

        <Paper radius={publicUi.radius.panel} className={styles.searchPanel}>
          <Stack gap="sm">
            <Group wrap="nowrap" className={styles.searchRow}>
              <TextInput
                className={styles.searchInput}
                placeholder={t('pages.appHome.filters.searchPlaceholder')}
                value={search}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                radius="xl"
                size="md"
                leftSection={<SearchGlyph />}
              />
              <ActionIcon
                component={Link}
                to={routePaths.appExplore}
                variant="transparent"
                aria-label={t('common.viewAllPlaces')}
                className={styles.searchAction}
              >
                <TuneGlyph />
              </ActionIcon>
            </Group>

            <ScrollArea type="never" offsetScrollbars>
              <Group gap="xs" wrap="nowrap" className={styles.chipRow}>
                {categoryOptions.map((category) => (
                  <UnstyledButton
                    key={category.id}
                    className={styles.chipButton}
                    data-active={selectedCategory === category.id || undefined}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    {category.label}
                  </UnstyledButton>
                ))}
              </Group>
            </ScrollArea>
          </Stack>
        </Paper>

        {hasDataError ? <Alert color="yellow" variant="light">{t('homepage.errors.dataUnavailable')}</Alert> : null}

        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Text fw={800} size="lg" className={styles.sectionHeading}>
                {t('pages.appHome.featured.title')}
              </Text>
              {!loading && visiblePlaces.length > 0 ? (
                <Badge color="gray" variant="light" radius="xl">
                  {visiblePlaces.length}
                </Badge>
              ) : null}
            </Group>
            <Button variant="subtle" component={Link} to={routePaths.appExplore} size="compact-sm">
              {t('common.viewAllPlaces')}
            </Button>
          </Group>

          {loading ? (
            <ScrollArea type="never" offsetScrollbars>
              <Group gap="md" wrap="nowrap" className={styles.featuredRail}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} h={364} w={index === 0 ? 296 : 270} radius="26px" />
                ))}
              </Group>
            </ScrollArea>
          ) : visiblePlaces.length > 0 ? (
            <ScrollArea type="never" offsetScrollbars>
              <Group gap="md" wrap="nowrap" className={styles.featuredRail}>
                {visiblePlaces.map((place) => (
                  <div key={String(place.id)} className={styles.featuredCard}>
                    <PlaceCard place={place} variant="immersive" />
                  </div>
                ))}
              </Group>
            </ScrollArea>
          ) : (
            <Paper withBorder p="lg" radius="18px" bg={publicUi.background.surfaceSoft}>
              <Text c="dimmed">{t('homepage.places.empty')}</Text>
            </Paper>
          )}
        </Stack>

        <Paper radius={publicUi.radius.panel} className={styles.supportCard}>
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
              <Stack className={styles.supportHeading}>
                <Text size="xs" fw={700} c="sun.8" tt="uppercase">
                  {t('pages.appHome.support.servicesEyebrow')}
                </Text>
                <Text fw={800}>{t('pages.appHome.support.servicesTitle')}</Text>
              </Stack>

              <div className={styles.supportCounts}>
                <Badge color="gray" variant="light" radius="xl">
                  {serviceCount} {t('layout.navigation.services')}
                </Badge>
                <Badge color="gray" variant="light" radius="xl">
                  {guideCount} {t('pages.appNav.guides')}
                </Badge>
              </div>
            </Group>

            <Text c="dimmed" size="sm" lineClamp={2}>
              {t('pages.appHome.support.servicesDescription', {
                services: serviceCount,
                guides: guideCount,
              })}
            </Text>

            <div className={styles.supportActions}>
              <Button
                component={Link}
                to={routePaths.appServices}
                radius="xl"
                color="forest"
                variant="light"
                className={styles.supportButton}
              >
                {t('layout.navigation.services')}
              </Button>
              <Button
                component={Link}
                to={routePaths.appGuides}
                radius="xl"
                color="sun"
                c="#2d2208"
                variant="light"
                className={styles.supportButton}
              >
                {t('pages.appNav.guides')}
              </Button>
            </div>
          </Stack>
        </Paper>
      </Stack>
    </PageSection>
  );
}
