import { useEffect, useState, type FormEvent } from 'react';
import { Button, Group, Modal, SimpleGrid, Stack, TextInput, Textarea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DestinationImage } from './DestinationImage';
import type { AdminCategoryFormValues } from '../types/admin';

interface AdminCategoryModalProps {
  opened: boolean;
  mode: 'create' | 'edit';
  initialValues: AdminCategoryFormValues;
  saving?: boolean;
  onClose: () => void;
  onSubmit: (values: AdminCategoryFormValues) => Promise<void>;
}

interface CategoryFieldErrors {
  name?: string;
}

export const emptyAdminCategoryFormValues: AdminCategoryFormValues = {
  name: '',
  description: '',
  image: '',
};

export function AdminCategoryModal({
  opened,
  mode,
  initialValues,
  saving = false,
  onClose,
  onSubmit,
}: AdminCategoryModalProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<AdminCategoryFormValues>(initialValues);
  const [errors, setErrors] = useState<CategoryFieldErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.name.trim()) {
      setErrors({ name: t('admin.categories.validation.name') });
      return;
    }

    await onSubmit(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? t('admin.categories.modal.createTitle') : t('admin.categories.modal.editTitle')}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <Stack gap="md">
              <TextInput
                label={t('admin.categories.fields.name')}
                value={values.name}
                onChange={(event) => {
                  setValues((current) => ({ ...current, name: event.currentTarget.value }));
                  setErrors({});
                }}
                error={errors.name}
              />
              <TextInput
                label={t('admin.categories.fields.image')}
                value={values.image}
                onChange={(event) => setValues((current) => ({ ...current, image: event.currentTarget.value }))}
              />
              <Textarea
                label={t('admin.categories.fields.description')}
                value={values.description}
                onChange={(event) => setValues((current) => ({ ...current, description: event.currentTarget.value }))}
                minRows={5}
                autosize
              />
            </Stack>

            <DestinationImage
              src={values.image}
              name={values.name || t('admin.categories.previewFallback')}
              category={values.name}
              height={220}
              radius={12}
            />
          </SimpleGrid>

          <Group justify="space-between">
            <Button type="button" variant="default" onClick={onClose}>
              {t('admin.shared.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {mode === 'create' ? t('admin.categories.actions.create') : t('admin.categories.actions.update')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
