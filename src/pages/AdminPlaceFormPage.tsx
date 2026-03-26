import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../api/api';
import {
  createAdminPlace,
  deleteAdminPlace,
  generateRuEnFromUz,
  getAdminPlace,
  updateAdminPlace,
} from '../api/admin';
import { AdminPlaceForm, emptyAdminPlaceFormValues } from '../components/AdminPlaceForm';
import type { Category } from '../types/api';
import type { AdminPersistenceMode, AdminPlaceFormValues, AdminPlaceRecord } from '../types/admin';

const mapRecordToFormValues = (record: AdminPlaceRecord): AdminPlaceFormValues => ({
  city: record.city,
  region: record.region,
  category: record.category,
  image: record.image,
  durationMinutes: String(record.durationMinutes || 60),
  featured: record.featured,
  latitude: record.coordinates.lat !== undefined ? String(record.coordinates.lat) : '',
  longitude: record.coordinates.lng !== undefined ? String(record.coordinates.lng) : '',
  name_uz: record.name_uz,
  description_uz: record.description_uz,
  name_kaa: record.name_kaa,
  description_kaa: record.description_kaa,
  name_ru: record.name_ru,
  description_ru: record.description_ru,
  name_en: record.name_en,
  description_en: record.description_en,
});

export function AdminPlaceFormPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesFallback, setCategoriesFallback] = useState(false);
  const [initialValues, setInitialValues] = useState<AdminPlaceFormValues>(emptyAdminPlaceFormValues);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastPersistence, setLastPersistence] = useState<AdminPersistenceMode | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      const categoriesPromise = getCategories();
      const placePromise = isEditMode && id ? getAdminPlace(id) : Promise.resolve(null);
      const [categoriesResult, placeResult] = await Promise.allSettled([categoriesPromise, placePromise]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
        setCategoriesFallback(false);
      } else {
        console.error('Failed to load categories for admin form', categoriesResult.reason);
        setCategoriesFallback(true);
      }

      if (placeResult.status === 'rejected') {
        console.error('Failed to load admin place', placeResult.reason);
        setLoadError(t('admin.form.messages.notFound'));
      } else if (placeResult.value) {
        setInitialValues(mapRecordToFormValues(placeResult.value));
      } else if (isEditMode) {
        setLoadError(t('admin.form.messages.notFound'));
      }

      setLoading(false);
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [id, isEditMode, t]);

  const pageTitle = useMemo(
    () => (isEditMode ? t('admin.form.pageEditTitle') : t('admin.form.pageCreateTitle')),
    [isEditMode, t],
  );

  const handleSubmit = async (values: AdminPlaceFormValues) => {
    setSaving(true);
    setSubmitError(null);

    try {
      const result = isEditMode && id ? await updateAdminPlace(id, values) : await createAdminPlace(values);
      setLastPersistence(result.persistence);
      setInitialValues(mapRecordToFormValues(result.place));

      notifications.show({
        color: 'green',
        title: isEditMode ? t('admin.form.messages.updated') : t('admin.form.messages.created'),
        message: t('admin.notices.backendSave'),
      });

      if (!isEditMode) {
        navigate(`/admin/places/${result.place.id}/edit`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to save admin place', error);
      const message = error instanceof Error ? error.message : t('admin.form.messages.saveFailed');
      setSubmitError(message);
      notifications.show({
        color: 'red',
        title: t('admin.form.messages.saveFailed'),
        message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    setDeleting(true);
    setSubmitError(null);

    try {
      await deleteAdminPlace(id);
      notifications.show({
        color: 'green',
        title: t('admin.form.messages.deleted'),
        message: t('admin.notices.backendSave'),
      });
      navigate('/admin/places');
    } catch (error) {
      console.error('Failed to delete admin place', error);
      const message = error instanceof Error ? error.message : t('admin.form.messages.deleteFailed');
      setSubmitError(message);
      notifications.show({
        color: 'red',
        title: t('admin.form.messages.deleteFailed'),
        message,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleGenerateTranslations = async (nameUz: string, descriptionUz: string) => {
    try {
      return await generateRuEnFromUz(nameUz, descriptionUz);
    } catch (error) {
      console.error('Failed to generate RU/EN fields', error);
      const message = error instanceof Error ? error.message : t('admin.form.messages.translationFailed');
      notifications.show({
        color: 'red',
        title: t('admin.form.messages.translationFailed'),
        message,
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <Stack gap="md">
        <Skeleton h={64} radius="md" />
        <Skeleton h={280} radius="md" />
        <Skeleton h={420} radius="md" />
      </Stack>
    );
  }

  if (loadError) {
    return (
      <Paper withBorder shadow="xs" p="lg" style={{ borderColor: '#e5e7eb' }}>
        <Stack gap="md">
          <Text fw={700} size="lg">
            {pageTitle}
          </Text>
          <Alert color="red" variant="light">
            {loadError}
          </Alert>
          <Stack gap="xs">
            <Button component={Link} to="/admin/places">
              {t('admin.nav.places')}
            </Button>
            <Button component={Link} to="/admin" variant="default">
              {t('admin.nav.overview')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <AdminPlaceForm
      mode={isEditMode ? 'edit' : 'create'}
      initialValues={initialValues}
      categories={categories}
      categoriesFallback={categoriesFallback}
      saving={saving}
      deleting={deleting}
      submitError={submitError}
      lastPersistence={lastPersistence}
      onSubmit={handleSubmit}
      onDelete={isEditMode ? handleDelete : undefined}
      onGenerateTranslations={handleGenerateTranslations}
    />
  );
}
