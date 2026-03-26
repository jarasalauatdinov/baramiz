import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/api';
import { deleteAdminPlace, getAdminPlaces } from '../api/admin';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { DestinationImage } from '../components/DestinationImage';
import type { Category } from '../types/api';
import type { AdminPlaceRecord } from '../types/admin';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import classes from './AdminPlacesPage.module.css';

const ALL_CATEGORIES_VALUE = 'all';

const formatUpdatedLabel = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-GB');
};

export function AdminPlacesPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<AdminPlaceRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_VALUE);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [placesResult, categoriesResult] = await Promise.allSettled([getAdminPlaces(), getCategories()]);

      if (!active) {
        return;
      }

      if (placesResult.status === 'fulfilled') {
        setPlaces(placesResult.value);
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      }

      if (placesResult.status === 'rejected' || categoriesResult.status === 'rejected') {
        console.error('Failed to load admin places', {
          places: placesResult.status === 'rejected' ? placesResult.reason : null,
          categories: categoriesResult.status === 'rejected' ? categoriesResult.reason : null,
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

  const categoryOptions = useMemo(() => {
    const sourceIds =
      categories.length > 0
        ? categories.map((category) => String(category.id))
        : Array.from(new Set(places.map((place) => place.category).filter(Boolean)));

    return [
      { value: ALL_CATEGORIES_VALUE, label: t('common.allCategories') },
      ...sourceIds.map((categoryId) => ({
        value: categoryId,
        label: formatCategoryLabel(categoryId, t),
      })),
    ];
  }, [categories, places, t]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    return places.filter((place) => {
      const searchableText = [
        place.name_uz,
        place.name_kaa,
        place.name_ru,
        place.name_en,
        place.city,
        place.region,
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES_VALUE || place.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [places, search, selectedCategory]);

  const metrics = useMemo(
    () => [
      {
        label: t('admin.dashboard.totalPlaces'),
        value: places.length,
        hint: `${filteredPlaces.length} ${t('admin.places.resultsCount')}`,
      },
      {
        label: t('admin.dashboard.featuredPlaces'),
        value: places.filter((place) => place.featured).length,
        hint: t('common.featured'),
      },
      {
        label: t('admin.places.storage.backend'),
        value: places.filter((place) => place.persistence === 'backend').length,
        hint: t('admin.places.storage.backend'),
      },
      {
        label: t('admin.dashboard.localDrafts'),
        value: places.filter((place) => place.persistence === 'local-demo').length,
        hint: t('admin.places.storage.localDemo'),
      },
    ],
    [filteredPlaces.length, places, t],
  );

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t('admin.places.deleteConfirm'));
    if (!confirmed) {
      return;
    }

    setPendingDeleteId(id);

    try {
      const result = await deleteAdminPlace(id);
      setPlaces((current) => current.filter((place) => place.id !== id));
      notifications.show({
        color: result.persistence === 'backend' ? 'green' : 'yellow',
        title: t('admin.form.messages.deleted'),
        message:
          result.persistence === 'backend'
            ? t('admin.notices.backendSave')
            : t('admin.notices.localSave'),
      });
    } catch (error) {
      console.error('Failed to delete place', error);
      notifications.show({
        color: 'red',
        title: t('admin.form.messages.deleteFailed'),
        message: t('admin.form.messages.deleteFailed'),
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <Stack gap="lg">
      <AdminPageHeader
        title={t('admin.places.pageTitle')}
        description={t('admin.places.pageDescription')}
        action={
          <Button component={Link} to="/admin/places/new">
            {t('admin.shared.newPlace')}
          </Button>
        }
      />

      {hasError ? (
        <Alert color="yellow" variant="light" radius="xs">
          {t('admin.places.dataUnavailable')}
        </Alert>
      ) : null}

      <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="sm">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} h={104} radius="xs" />)
          : metrics.map((item) => (
              <Paper key={item.label} withBorder p="md" className={classes.metricCard}>
                <div className={classes.metricLabel}>{item.label}</div>
                <div className={classes.metricValue}>{item.value}</div>
                <div className={classes.metricHint}>{item.hint}</div>
              </Paper>
            ))}
      </SimpleGrid>

      <Paper withBorder p="md" className={classes.filtersCard}>
        <div className={classes.filtersHeader}>
          <div>
            <div className={classes.filtersTitle}>{t('admin.places.filtersTitle')}</div>
            <div className={classes.filtersDescription}>{t('admin.places.filtersDescription')}</div>
          </div>
          <div className={classes.resultsText}>
            {filteredPlaces.length} {t('admin.places.resultsCount')}
          </div>
        </div>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <TextInput
            label={t('admin.places.searchLabel')}
            placeholder={t('admin.places.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Select
            label={t('admin.form.fields.category')}
            data={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value ?? ALL_CATEGORIES_VALUE)}
          />
        </SimpleGrid>
      </Paper>

      <Paper withBorder p="md" className={classes.tableCard}>
        <div className={classes.tableShell}>
          <ScrollArea>
            {loading ? (
              <Stack gap="sm">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} h={52} radius="xs" />
                ))}
              </Stack>
            ) : filteredPlaces.length > 0 ? (
              <Table
                className={classes.table}
                verticalSpacing="sm"
                horizontalSpacing="md"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('admin.places.table.place')}</Table.Th>
                    <Table.Th>{t('admin.places.table.location')}</Table.Th>
                    <Table.Th>{t('admin.places.table.category')}</Table.Th>
                    <Table.Th>{t('admin.places.table.duration')}</Table.Th>
                    <Table.Th>{t('admin.places.table.featured')}</Table.Th>
                    <Table.Th>{t('admin.places.table.source')}</Table.Th>
                    <Table.Th>{t('admin.places.table.updated')}</Table.Th>
                    <Table.Th>{t('admin.places.table.actions')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredPlaces.map((place) => {
                    const displayName = place.name_uz || place.name_kaa || place.name_ru || place.name_en;

                    return (
                      <Table.Tr key={place.id}>
                        <Table.Td>
                          <div className={classes.placeCell}>
                            <DestinationImage
                              src={place.image}
                              name={displayName}
                              city={place.city}
                              category={place.category}
                              height={48}
                              width={72}
                              radius={8}
                            />
                            <div className={classes.placeCopy}>
                              <div className={classes.placeName}>{displayName}</div>
                              <div className={classes.placeMeta}>{place.id}</div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className={classes.locationCell}>
                            <div className={classes.placeName}>{place.city || '-'}</div>
                            <div className={classes.tableMuted}>{place.region || '-'}</div>
                          </div>
                        </Table.Td>
                        <Table.Td>{formatCategoryLabel(place.category, t)}</Table.Td>
                        <Table.Td>{formatMinutesLabel(place.durationMinutes, t)}</Table.Td>
                        <Table.Td>
                          {place.featured ? (
                            <Badge color="blue" variant="light" radius="xs">
                              {t('common.featured')}
                            </Badge>
                          ) : (
                            <Text size="sm" c="#6b7280">
                              -
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            color={place.persistence === 'backend' ? 'green' : 'gray'}
                            variant={place.persistence === 'backend' ? 'light' : 'outline'}
                            radius="xs"
                          >
                            {place.persistence === 'backend'
                              ? t('admin.places.storage.backend')
                              : t('admin.places.storage.localDemo')}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <div className={classes.tableMuted}>{formatUpdatedLabel(place.updatedAt)}</div>
                        </Table.Td>
                        <Table.Td>
                          <div className={classes.actionRow}>
                            <Button component={Link} to={`/admin/places/${place.id}/edit`} variant="default" size="xs">
                              {t('admin.shared.edit')}
                            </Button>
                            <Button
                              color="red"
                              variant="light"
                              size="xs"
                              loading={pendingDeleteId === place.id}
                              onClick={() => void handleDelete(place.id)}
                            >
                              {t('admin.shared.delete')}
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            ) : (
              <div className={classes.emptyState}>{t('admin.places.noResults')}</div>
            )}
          </ScrollArea>
        </div>
      </Paper>
    </Stack>
  );
}
