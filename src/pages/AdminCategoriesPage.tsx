import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getAdminPlaces,
  updateAdminCategory,
} from '../api/admin';
import { AdminCategoryModal, emptyAdminCategoryFormValues } from '../components/AdminCategoryModal';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { DestinationImage } from '../components/DestinationImage';
import type { AdminCategoryFormValues, AdminCategoryRecord, AdminPlaceRecord } from '../types/admin';

export function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [places, setPlaces] = useState<AdminPlaceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getAdminCategories(),
        getAdminPlaces(),
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
        console.error('Failed to load admin categories', {
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

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const haystack = `${category.name} ${category.description}`.toLowerCase();
      return !query || haystack.includes(query);
    });
  }, [categories, search]);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId, categories],
  );

  const modalValues: AdminCategoryFormValues = activeCategory
    ? {
        name: activeCategory.name,
        description: activeCategory.description,
        image: activeCategory.image,
      }
    : emptyAdminCategoryFormValues;

  const openCreateModal = () => {
    setModalMode('create');
    setActiveCategoryId(null);
    setModalOpened(true);
  };

  const openEditModal = (id: string) => {
    setModalMode('edit');
    setActiveCategoryId(id);
    setModalOpened(true);
  };

  const handleSubmit = async (values: AdminCategoryFormValues) => {
    setSaving(true);

    try {
      const result =
        modalMode === 'create'
          ? await createAdminCategory(values)
          : await updateAdminCategory(activeCategoryId ?? '', values);

      setCategories((current) => {
        const next = [...current.filter((item) => item.id !== result.category.id), result.category];
        return next.sort((left, right) => left.name.localeCompare(right.name));
      });

      notifications.show({
        color: result.persistence === 'backend' ? 'green' : 'yellow',
        title:
          modalMode === 'create'
            ? t('admin.categories.messages.created')
            : t('admin.categories.messages.updated'),
        message:
          result.persistence === 'backend'
            ? t('admin.notices.backendSave')
            : t('admin.notices.localSave'),
      });
      setModalOpened(false);
    } catch (error) {
      console.error('Failed to save admin category', error);
      notifications.show({
        color: 'red',
        title: t('admin.categories.messages.saveFailed'),
        message: t('admin.categories.messages.saveFailed'),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t('admin.categories.deleteConfirm'));
    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const result = await deleteAdminCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
      notifications.show({
        color: result.persistence === 'backend' ? 'green' : 'yellow',
        title: t('admin.categories.messages.deleted'),
        message:
          result.persistence === 'backend'
            ? t('admin.notices.backendSave')
            : t('admin.notices.localSave'),
      });
    } catch (error) {
      console.error('Failed to delete admin category', error);
      notifications.show({
        color: 'red',
        title: t('admin.categories.messages.deleteFailed'),
        message: t('admin.categories.messages.deleteFailed'),
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Stack gap="lg">
        <AdminPageHeader
          title={t('admin.categories.pageTitle')}
          description={t('admin.categories.pageDescription')}
          action={<Button onClick={openCreateModal}>{t('admin.categories.actions.new')}</Button>}
        />

      {hasError ? (
        <Alert color="yellow" variant="light">
          {t('admin.categories.dataUnavailable')}
        </Alert>
      ) : null}

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="sm">
        <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Text size="xs" tt="uppercase" fw={700} c="#6b7280">
            {t('admin.dashboard.categories')}
          </Text>
          <Text fw={700} size="1.4rem" mt={6}>
            {categories.length}
          </Text>
        </Paper>
        <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Text size="xs" tt="uppercase" fw={700} c="#6b7280">
            {t('admin.dashboard.totalPlaces')}
          </Text>
          <Text fw={700} size="1.4rem" mt={6}>
            {places.length}
          </Text>
        </Paper>
        <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Text size="xs" tt="uppercase" fw={700} c="#6b7280">
            {t('admin.dashboard.localDrafts')}
          </Text>
          <Text fw={700} size="1.4rem" mt={6}>
            {categories.filter((category) => category.persistence === 'local-demo').length}
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder shadow="xs" p="md" style={{ borderColor: '#e5e7eb' }}>
          <Stack gap="md">
            <Group justify="space-between" align="end">
              <TextInput
                label={t('admin.categories.searchLabel')}
                placeholder={t('admin.categories.searchPlaceholder')}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                style={{ maxWidth: 340, width: '100%' }}
              />
              <Text size="sm" c="#6b7280">
                {t('admin.categories.totalLabel', { count: filteredCategories.length })}
              </Text>
            </Group>

            <ScrollArea>
              {loading ? (
                <Stack gap="sm">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} h={52} radius="sm" />
                  ))}
                </Stack>
              ) : filteredCategories.length > 0 ? (
                <Table
                  verticalSpacing="xs"
                  horizontalSpacing="sm"
                  miw={920}
                  striped
                  highlightOnHover
                  withTableBorder
                  withColumnBorders
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('admin.categories.table.name')}</Table.Th>
                      <Table.Th>{t('admin.categories.table.description')}</Table.Th>
                      <Table.Th>{t('admin.categories.table.places')}</Table.Th>
                      <Table.Th>{t('admin.categories.table.storage')}</Table.Th>
                      <Table.Th>{t('admin.categories.table.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredCategories.map((category) => {
                      const placeCount = places.filter(
                        (place) => place.category === category.id || place.category === category.name,
                      ).length;

                      return (
                        <Table.Tr key={category.id}>
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <DestinationImage
                                src={category.image}
                                name={category.name}
                                category={category.name}
                                height={40}
                                width={60}
                                radius={8}
                              />
                              <Stack gap={1}>
                                <Text fw={600} size="sm">
                                  {category.name}
                                </Text>
                                <Text size="xs" c="#6b7280">
                                  {category.id}
                                </Text>
                              </Stack>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="#374151" lineClamp={2}>
                              {category.description || t('admin.categories.emptyDescription')}
                            </Text>
                          </Table.Td>
                          <Table.Td>{placeCount}</Table.Td>
                          <Table.Td>
                            <Badge color={category.persistence === 'backend' ? 'blue' : 'gray'} variant="light" radius="sm">
                              {category.persistence === 'backend'
                                ? t('admin.categories.storage.backend')
                                : t('admin.categories.storage.localDemo')}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Button variant="default" onClick={() => openEditModal(category.id)}>
                                {t('admin.shared.edit')}
                              </Button>
                              <Button
                                color="red"
                                variant="subtle"
                                loading={deletingId === category.id}
                                onClick={() => void handleDelete(category.id)}
                              >
                                {t('admin.shared.delete')}
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text size="sm" c="#6b7280">
                  {t('admin.categories.empty')}
                </Text>
              )}
            </ScrollArea>
          </Stack>
        </Paper>
      </Stack>

      <AdminCategoryModal
        opened={modalOpened}
        mode={modalMode}
        initialValues={modalValues}
        saving={saving}
        onClose={() => setModalOpened(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
