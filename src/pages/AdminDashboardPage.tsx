import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAdminCategories, getAdminPlaces } from '../api/admin';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { DestinationImage } from '../components/DestinationImage';
import type { AdminCategoryRecord, AdminPlaceRecord } from '../types/admin';
import { formatCategoryLabel } from '../utils/placeArtwork';

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<AdminPlaceRecord[]>([]);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [placesResult, categoriesResult] = await Promise.allSettled([
        getAdminPlaces(),
        getAdminCategories(),
      ]);

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
        console.error('Failed to load admin dashboard data', {
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

  const stats = useMemo(
    () => [
      { label: t('admin.dashboard.totalPlaces'), value: places.length },
      { label: t('admin.dashboard.featuredPlaces'), value: places.filter((place) => place.featured).length },
      { label: t('admin.dashboard.categories'), value: categories.length },
      {
        label: t('admin.dashboard.localDrafts'),
        value:
          places.filter((place) => place.persistence === 'local-demo').length +
          categories.filter((category) => category.persistence === 'local-demo').length,
      },
    ],
    [categories, places, t],
  );

  const recentPlaces = places.slice(0, 5);
  const categoryRows = categories.slice(0, 6).map((category) => ({
    ...category,
    placeCount: places.filter((place) => place.category === category.id || place.category === category.name)
      .length,
  }));

  return (
      <Stack gap="lg">
      <AdminPageHeader
        title={t('admin.dashboard.pageTitle')}
        description={t('admin.dashboard.pageDescription')}
        action={
          <Group>
            <Button component={Link} to="/admin/categories" variant="default">
              {t('admin.nav.categories')}
            </Button>
            <Button component={Link} to="/admin/places/new">
              {t('admin.shared.newPlace')}
            </Button>
          </Group>
        }
      />

      {hasError ? (
        <Alert color="yellow" variant="light">
          {t('admin.places.dataUnavailable')}
        </Alert>
      ) : null}

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="sm">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} h={96} radius="sm" />)
          : stats.map((item) => (
              <Paper key={item.label} withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
                <Text size="xs" tt="uppercase" fw={700} c="#6b7280">
                  {item.label}
                </Text>
                <Text fw={700} size="1.6rem" mt={8} c="#111827">
                  {item.value}
                </Text>
              </Paper>
            ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="sm">
        <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Stack gap="md">
            <AdminPageHeader
              title={t('admin.dashboard.recentTitle')}
              description={t('admin.dashboard.recentDescription')}
              action={
                <Button component={Link} to="/admin/places" variant="subtle" size="sm">
                  {t('admin.nav.places')}
                </Button>
              }
            />

            {loading ? (
              <Stack gap="sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} h={56} radius="sm" />
                ))}
              </Stack>
            ) : recentPlaces.length > 0 ? (
              <Table
                verticalSpacing="xs"
                horizontalSpacing="sm"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('admin.places.table.place')}</Table.Th>
                    <Table.Th>{t('admin.places.table.city')}</Table.Th>
                    <Table.Th>{t('admin.places.table.category')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentPlaces.map((place) => {
                    const displayName = place.name_uz || place.name_kaa || place.name_ru || place.name_en;

                    return (
                      <Table.Tr key={place.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <DestinationImage
                              src={place.image}
                              name={displayName}
                              city={place.city}
                              category={place.category}
                              height={40}
                              width={60}
                              radius={8}
                            />
                            <Text fw={600} size="sm">
                              {displayName}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>{place.city || '-'}</Table.Td>
                        <Table.Td>{formatCategoryLabel(place.category, t)}</Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            ) : (
              <Text size="sm" c="#6b7280">
                {t('admin.dashboard.empty')}
              </Text>
            )}
          </Stack>
        </Paper>

        <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Stack gap="md">
            <AdminPageHeader
              title={t('admin.dashboard.categoryTitle')}
              description={t('admin.dashboard.categoryDescription')}
              action={
                <Button component={Link} to="/admin/categories" variant="subtle" size="sm">
                  {t('admin.nav.categories')}
                </Button>
              }
            />

            {loading ? (
              <Stack gap="sm">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} h={44} radius="sm" />
                ))}
              </Stack>
            ) : categoryRows.length > 0 ? (
              <Table
                verticalSpacing="xs"
                horizontalSpacing="sm"
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('admin.categories.table.name')}</Table.Th>
                    <Table.Th>{t('admin.categories.table.places')}</Table.Th>
                    <Table.Th>{t('admin.categories.table.storage')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {categoryRows.map((category) => (
                    <Table.Tr key={category.id}>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text fw={600} size="sm">
                            {category.name}
                          </Text>
                          <Text size="xs" c="#6b7280" lineClamp={1}>
                            {category.description || t('admin.categories.emptyDescription')}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>{category.placeCount}</Table.Td>
                      <Table.Td>
                        <Badge color={category.persistence === 'backend' ? 'blue' : 'gray'} variant="light" radius="sm">
                          {category.persistence === 'backend'
                            ? t('admin.categories.storage.backend')
                            : t('admin.categories.storage.localDemo')}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text size="sm" c="#6b7280">
                {t('admin.categories.empty')}
              </Text>
            )}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
