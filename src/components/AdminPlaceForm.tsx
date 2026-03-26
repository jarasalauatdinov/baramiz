import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DestinationImage } from './DestinationImage';
import type { Category } from '../types/api';
import type {
  AdminPersistenceMode,
  AdminPlaceFormValues,
  TranslationGenerationResult,
} from '../types/admin';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import classes from './AdminPlaceForm.module.css';

const FALLBACK_CATEGORY_IDS = ['history', 'culture', 'museum', 'nature', 'adventure', 'food', 'family'];

type FieldErrors = Partial<Record<keyof AdminPlaceFormValues, string>>;

interface AdminPlaceFormProps {
  mode: 'create' | 'edit';
  initialValues: AdminPlaceFormValues;
  categories: Category[];
  categoriesFallback?: boolean;
  loading?: boolean;
  saving?: boolean;
  deleting?: boolean;
  submitError?: string | null;
  lastPersistence?: AdminPersistenceMode | null;
  onSubmit: (values: AdminPlaceFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
  onGenerateTranslations: (
    nameUz: string,
    descriptionUz: string,
  ) => Promise<TranslationGenerationResult>;
}

export const emptyAdminPlaceFormValues: AdminPlaceFormValues = {
  city: '',
  region: '',
  category: 'history',
  image: '',
  durationMinutes: '90',
  featured: false,
  latitude: '',
  longitude: '',
  name_uz: '',
  description_uz: '',
  name_kaa: '',
  description_kaa: '',
  name_ru: '',
  description_ru: '',
  name_en: '',
  description_en: '',
};

const Section = ({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <Paper withBorder className={classes.panel}>
    <div className={classes.panelHeader}>
      <div>
        <Text className={classes.panelTitle}>{title}</Text>
        <Text className={classes.panelDescription}>{description}</Text>
      </div>
      {action}
    </div>
    <div className={classes.panelBody}>{children}</div>
  </Paper>
);

export function AdminPlaceForm({
  mode,
  initialValues,
  categories,
  categoriesFallback = false,
  loading = false,
  saving = false,
  deleting = false,
  submitError,
  lastPersistence,
  onSubmit,
  onDelete,
  onGenerateTranslations,
}: AdminPlaceFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<AdminPlaceFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [translationNotice, setTranslationNotice] = useState<TranslationGenerationResult['source'] | null>(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTranslationNotice(null);
  }, [initialValues]);

  const categoryOptions =
    categories.length > 0
      ? categories.map((category) => ({
          value: String(category.id),
          label: formatCategoryLabel(String(category.id), t),
        }))
      : FALLBACK_CATEGORY_IDS.map((categoryId) => ({
          value: categoryId,
          label: formatCategoryLabel(categoryId, t),
        }));

  const previewName =
    values.name_uz || values.name_kaa || values.name_ru || values.name_en || t('admin.shared.preview');

  const validate = (draft: AdminPlaceFormValues): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!draft.city.trim()) {
      nextErrors.city = t('admin.form.validation.city');
    }

    if (!draft.region.trim()) {
      nextErrors.region = t('admin.form.validation.region');
    }

    if (!draft.category.trim()) {
      nextErrors.category = t('admin.form.validation.category');
    }

    if (!draft.image.trim()) {
      nextErrors.image = t('admin.form.validation.image');
    }

    if (!draft.durationMinutes.trim()) {
      nextErrors.durationMinutes = t('admin.form.validation.durationMinutes');
    } else if (!Number.isFinite(Number(draft.durationMinutes)) || Number(draft.durationMinutes) <= 0) {
      nextErrors.durationMinutes = t('admin.form.validation.durationMinutes');
    }

    if (!draft.name_uz.trim()) {
      nextErrors.name_uz = t('admin.form.validation.nameUz');
    }

    if (!draft.description_uz.trim()) {
      nextErrors.description_uz = t('admin.form.validation.descriptionUz');
    }

    if (!draft.name_kaa.trim()) {
      nextErrors.name_kaa = t('admin.form.validation.nameKaa');
    }

    if (!draft.description_kaa.trim()) {
      nextErrors.description_kaa = t('admin.form.validation.descriptionKaa');
    }

    if (draft.latitude.trim() && Number.isNaN(Number(draft.latitude))) {
      nextErrors.latitude = t('admin.form.validation.latitude');
    }

    if (draft.longitude.trim() && Number.isNaN(Number(draft.longitude))) {
      nextErrors.longitude = t('admin.form.validation.longitude');
    }

    return nextErrors;
  };

  const updateValue = <K extends keyof AdminPlaceFormValues>(key: K, value: AdminPlaceFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit(values);
  };

  const handleGenerateTranslations = async () => {
    if (!values.name_uz.trim() || !values.description_uz.trim()) {
      setErrors((current) => ({
        ...current,
        name_uz: values.name_uz.trim() ? undefined : t('admin.form.validation.uzSource'),
        description_uz: values.description_uz.trim() ? undefined : t('admin.form.validation.uzSource'),
      }));
      return;
    }

    setTranslating(true);

    try {
      const result = await onGenerateTranslations(values.name_uz, values.description_uz);
      setValues((current) => ({
        ...current,
        name_ru: result.name_ru,
        description_ru: result.description_ru,
        name_en: result.name_en,
        description_en: result.description_en,
      }));
      setTranslationNotice(result.source);
    } catch {
      setTranslationNotice(null);
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmed = window.confirm(t('admin.places.deleteConfirm'));
    if (!confirmed) {
      return;
    }

    await onDelete();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Paper withBorder className={classes.actionBar}>
          <div className={classes.actionMain}>
            <Text className={classes.eyebrow}>
              {mode === 'create' ? t('admin.layout.titles.newPlace') : t('admin.layout.titles.editPlace')}
            </Text>
            <Text className={classes.title}>
              {mode === 'create' ? t('admin.form.pageCreateTitle') : t('admin.form.pageEditTitle')}
            </Text>
            <Text className={classes.description}>
              {mode === 'create' ? t('admin.form.pageCreateDescription') : t('admin.form.pageEditDescription')}
            </Text>
            <Group gap="xs" mt="md">
              <Badge color="gray" variant="light" radius="sm">
                {formatCategoryLabel(values.category, t)}
              </Badge>
              <Badge color="gray" variant="light" radius="sm">
                {formatMinutesLabel(Number(values.durationMinutes), t)}
              </Badge>
              <Badge color={values.featured ? 'blue' : 'gray'} variant="light" radius="sm">
                {values.featured ? t('common.featured') : t('admin.form.notFeatured')}
              </Badge>
              {lastPersistence === 'backend' ? (
                <Badge color="green" variant="light" radius="sm">
                  {t('admin.places.storage.backend')}
                </Badge>
              ) : null}
            </Group>
          </div>

          <Group gap="sm" className={classes.actionButtons}>
            {mode === 'edit' && onDelete ? (
              <Button type="button" color="red" variant="subtle" onClick={handleDelete} loading={deleting}>
                {t('admin.shared.delete')}
              </Button>
            ) : null}
            <Button component={Link} to="/admin/places" variant="default">
              {t('admin.shared.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {mode === 'create' ? t('admin.shared.create') : t('admin.shared.update')}
            </Button>
          </Group>
        </Paper>

        {categoriesFallback ? (
          <Alert color="yellow" variant="light">
            {t('admin.notices.categoriesFallback')}
          </Alert>
        ) : null}

        {lastPersistence === 'backend' ? (
          <Alert color="green" variant="light">
            {t('admin.notices.backendSave')}
          </Alert>
        ) : null}

        {lastPersistence === 'local-demo' ? (
          <Alert color="yellow" variant="light">
            {t('admin.notices.localSave')}
          </Alert>
        ) : null}

        {translationNotice === 'backend' ? (
          <Alert color="green" variant="light">
            {t('admin.form.messages.translationReady')}
          </Alert>
        ) : null}

        {translationNotice === 'fallback-copy' ? (
          <Alert color="yellow" variant="light">
            {t('admin.notices.translationFallback')}
          </Alert>
        ) : null}

        {submitError ? (
          <Alert color="red" variant="light">
            {submitError}
          </Alert>
        ) : null}

        <div className={classes.layoutGrid}>
          <div className={classes.mainColumn}>
            <Section
              title={t('admin.form.basicTitle')}
              description={t('admin.form.basicDescription')}
            >
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                <TextInput
                  label={t('admin.form.fields.city')}
                  value={values.city}
                  onChange={(event) => updateValue('city', event.currentTarget.value)}
                  error={errors.city}
                  disabled={loading}
                />
                <TextInput
                  label={t('admin.form.fields.region')}
                  value={values.region}
                  onChange={(event) => updateValue('region', event.currentTarget.value)}
                  error={errors.region}
                  disabled={loading}
                />
                <Select
                  label={t('admin.form.fields.category')}
                  data={categoryOptions}
                  value={values.category}
                  onChange={(value) => updateValue('category', value ?? '')}
                  error={errors.category}
                  disabled={loading}
                  searchable
                />
                <TextInput
                  label={t('admin.form.fields.durationMinutes')}
                  value={values.durationMinutes}
                  onChange={(event) => updateValue('durationMinutes', event.currentTarget.value)}
                  error={errors.durationMinutes}
                  disabled={loading}
                />
                <TextInput
                  label={t('admin.form.fields.latitude')}
                  value={values.latitude}
                  onChange={(event) => updateValue('latitude', event.currentTarget.value)}
                  error={errors.latitude}
                  disabled={loading}
                />
                <TextInput
                  label={t('admin.form.fields.longitude')}
                  value={values.longitude}
                  onChange={(event) => updateValue('longitude', event.currentTarget.value)}
                  error={errors.longitude}
                  disabled={loading}
                />
                <TextInput
                  label={t('admin.form.fields.image')}
                  value={values.image}
                  onChange={(event) => updateValue('image', event.currentTarget.value)}
                  error={errors.image}
                  disabled={loading}
                  className={classes.imageField}
                />
              </SimpleGrid>

              <Switch
                className={classes.featuredSwitch}
                checked={values.featured}
                onChange={(event) => updateValue('featured', event.currentTarget.checked)}
                label={t('admin.form.fields.featured')}
                description={t('admin.form.helpers.featured')}
                disabled={loading}
              />
            </Section>

            <Section
              title={t('admin.form.uzTitle')}
              description={t('admin.form.uzDescription')}
              action={
                <Badge color="blue" variant="light" radius="sm">
                  {t('admin.form.languagePrimary')}
                </Badge>
              }
            >
              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                <TextInput
                  label={t('admin.form.fields.nameUz')}
                  value={values.name_uz}
                  onChange={(event) => updateValue('name_uz', event.currentTarget.value)}
                  error={errors.name_uz}
                  disabled={loading}
                />
                <div />
                <Textarea
                  label={t('admin.form.fields.descriptionUz')}
                  value={values.description_uz}
                  onChange={(event) => updateValue('description_uz', event.currentTarget.value)}
                  error={errors.description_uz}
                  minRows={7}
                  autosize
                  disabled={loading}
                  className={classes.fullWidthField}
                />
              </SimpleGrid>
            </Section>

            <Section
              title={t('admin.form.kaaTitle')}
              description={t('admin.form.kaaDescription')}
              action={
                <Badge color="gray" variant="light" radius="sm">
                  {t('admin.form.languageManual')}
                </Badge>
              }
            >
              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                <TextInput
                  label={t('admin.form.fields.nameKaa')}
                  value={values.name_kaa}
                  onChange={(event) => updateValue('name_kaa', event.currentTarget.value)}
                  error={errors.name_kaa}
                  disabled={loading}
                />
                <div />
                <Textarea
                  label={t('admin.form.fields.descriptionKaa')}
                  value={values.description_kaa}
                  onChange={(event) => updateValue('description_kaa', event.currentTarget.value)}
                  error={errors.description_kaa}
                  minRows={7}
                  autosize
                  disabled={loading}
                  className={classes.fullWidthField}
                />
              </SimpleGrid>
            </Section>

            <Section
              title={t('admin.form.translationsTitle')}
              description={t('admin.form.translationsDescription')}
              action={
                <Button type="button" variant="default" onClick={handleGenerateTranslations} loading={translating}>
                  {t('admin.form.actions.generateTranslations')}
                </Button>
              }
            >
              <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md">
                <div className={classes.translationColumn}>
                  <Text className={classes.translationTitle}>{t('languages.ru.name')}</Text>
                  <TextInput
                    label={t('admin.form.fields.nameRu')}
                    value={values.name_ru}
                    onChange={(event) => updateValue('name_ru', event.currentTarget.value)}
                    disabled={loading}
                  />
                  <Textarea
                    label={t('admin.form.fields.descriptionRu')}
                    value={values.description_ru}
                    onChange={(event) => updateValue('description_ru', event.currentTarget.value)}
                    minRows={7}
                    autosize
                    disabled={loading}
                  />
                </div>

                <div className={classes.translationColumn}>
                  <Text className={classes.translationTitle}>{t('languages.en.name')}</Text>
                  <TextInput
                    label={t('admin.form.fields.nameEn')}
                    value={values.name_en}
                    onChange={(event) => updateValue('name_en', event.currentTarget.value)}
                    disabled={loading}
                  />
                  <Textarea
                    label={t('admin.form.fields.descriptionEn')}
                    value={values.description_en}
                    onChange={(event) => updateValue('description_en', event.currentTarget.value)}
                    minRows={7}
                    autosize
                    disabled={loading}
                  />
                </div>
              </SimpleGrid>
            </Section>
          </div>

          <div className={classes.sideColumn}>
            <Section
              title={t('admin.form.imageTitle')}
              description={t('admin.form.imageDescription')}
            >
              <DestinationImage
                src={values.image}
                name={previewName}
                city={values.city || values.region}
                category={values.category}
                height={220}
                radius={10}
              />

              <div className={classes.previewMeta}>
                <Text className={classes.previewName}>{previewName}</Text>
                <Text className={classes.previewSubline}>{values.city || values.region || t('common.unknownCity')}</Text>
                <Text className={classes.previewSubline}>{formatCategoryLabel(values.category, t)}</Text>
                <Text className={classes.previewSubline}>{formatMinutesLabel(Number(values.durationMinutes), t)}</Text>
              </div>
            </Section>

            <Section
              title={t('admin.form.rulesTitle')}
              description={t('admin.form.rulesDescription')}
            >
              <div className={classes.workflowList}>
                <div className={classes.workflowItem}>
                  <Badge color="blue" variant="light" radius="sm">
                    UZ
                  </Badge>
                  <Text size="sm">{t('admin.form.helpers.uzSource')}</Text>
                </div>
                <div className={classes.workflowItem}>
                  <Badge color="gray" variant="light" radius="sm">
                    KAA
                  </Badge>
                  <Text size="sm">{t('admin.form.helpers.kaaManual')}</Text>
                </div>
                <div className={classes.workflowItem}>
                  <Badge color="dark" variant="light" radius="sm">
                    RU / EN
                  </Badge>
                  <Text size="sm">{t('admin.form.helpers.ruEnEditable')}</Text>
                </div>
                <div className={classes.workflowItem}>
                  <Badge color="gray" variant="light" radius="sm">
                    GEO
                  </Badge>
                  <Text size="sm">{t('admin.form.helpers.coordinates')}</Text>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </Stack>
    </form>
  );
}
