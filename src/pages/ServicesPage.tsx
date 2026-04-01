import { useMemo, useState } from 'react';
import {
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PageHeaderBlock } from '../components/layout/PageHeaderBlock';
import { PageSection } from '../components/layout/PageSection';
import { ServiceCard } from '../components/ServiceCard';
import {
  getLocalizedServiceSections,
  getServiceCityOptions,
  getServiceSectionOptions,
} from '../data/services';

const ALL_OPTION = 'all';

export function ServicesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(ALL_OPTION);
  const [selectedType, setSelectedType] = useState(ALL_OPTION);
  const localizedSections = useMemo(() => getLocalizedServiceSections(t), [t]);
  const flatServices = useMemo(
    () => localizedSections.flatMap((section) => section.items.map((item) => ({ ...item, kind: section.id }))),
    [localizedSections],
  );

  const cityOptions = useMemo(() => getServiceCityOptions(t, flatServices), [flatServices, t]);
  const typeOptions = useMemo(() => getServiceSectionOptions(t), [t]);

  const visibleSections = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return localizedSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchesSearch =
            normalized.length === 0 ||
            [
              item.title,
              item.description,
              item.meta,
              item.city ?? '',
              item.region ?? '',
              item.note ?? '',
              ...(item.tags ?? []),
              ...(item.availableCities ?? []),
            ]
              .join(' ')
              .toLowerCase()
              .includes(normalized);

          const matchesCity =
            selectedCity === ALL_OPTION ||
            item.availableCities?.includes(selectedCity) ||
            item.city === selectedCity;

          const matchesType = selectedType === ALL_OPTION || section.id === selectedType;

          return matchesSearch && matchesCity && matchesType;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [localizedSections, search, selectedCity, selectedType]);

  const totalResults = visibleSections.reduce((sum, section) => sum + section.items.length, 0);

  const clearFilters = () => {
    setSearch('');
    setSelectedCity(ALL_OPTION);
    setSelectedType(ALL_OPTION);
  };

  return (
    <PageSection py={{ base: 18, md: 28 }}>
      <PageHeaderBlock
        eyebrow={t('servicesPage.pageEyebrow', { defaultValue: 'Services' })}
        title={t('servicesPage.pageTitle', {
          defaultValue: 'Travel support services',
        })}
        description={t('servicesPage.pageDescription', {
          defaultValue:
            'Find stays, transport, tickets, and local support.',
        })}
        size="section"
      />

      <Paper withBorder p="lg" radius="24px" mb="xl" bg="white">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <div>
              <Text fw={700} fz="1.05rem">
                {t('servicesPage.filters.title', { defaultValue: 'Filter services' })}
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {t('servicesPage.filters.description', {
                  defaultValue: 'Filter by city, type, or travel need.',
                })}
              </Text>
            </div>
            <Button variant="subtle" color="gray" onClick={clearFilters}>
              {t('common.clearFilters', { defaultValue: 'Clear filters' })}
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <TextInput
              label={t('servicesPage.filters.searchLabel', { defaultValue: 'Search' })}
              placeholder={t('servicesPage.filters.searchPlaceholder', {
                defaultValue: 'Search by service, city, or travel need',
              })}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
            <Select
              label={t('servicesPage.filters.cityLabel', { defaultValue: 'City' })}
              data={cityOptions}
              value={selectedCity}
              onChange={(value) => setSelectedCity(value ?? ALL_OPTION)}
            />
            <Select
              label={t('servicesPage.filters.typeLabel', { defaultValue: 'Service type' })}
              data={typeOptions}
              value={selectedType}
              onChange={(value) => setSelectedType(value ?? ALL_OPTION)}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      <Text c="dimmed" size="sm" mb="lg">
        {t('servicesPage.resultsCount', {
          count: totalResults,
          defaultValue: '{{count}} service options',
        })}
      </Text>

      {visibleSections.length > 0 ? (
        <Stack gap={42}>
          {visibleSections.map((section) => (
            <Stack key={section.id} gap="md">
              <div>
                <Text size="xs" fw={700} tt="uppercase" c="sun.8" style={{ letterSpacing: '0.08em' }}>
                  {t('servicesPage.eyebrow', { defaultValue: 'Service section' })}
                </Text>
                <Text fw={800} fz="1.4rem" mt={4}>
                  {section.title}
                </Text>
                <Text c="dimmed" mt={6} maw={760} style={{ lineHeight: 1.68 }}>
                  {section.description}
                </Text>
              </div>

              <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
                {section.items.map((item) => (
                  <ServiceCard
                    key={item.id}
                    item={item}
                    kind={section.id}
                    actionLabel={item.contactLabel ?? t('common.viewService')}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Paper withBorder p="xl" radius="24px" bg="white">
          <Stack gap="sm">
            <Text fw={700}>
              {t('servicesPage.empty.title', { defaultValue: 'No services match the current filters' })}
            </Text>
            <Text c="dimmed">
              {t('servicesPage.empty.description', {
                defaultValue: 'Try another city or service type to continue planning the trip.',
              })}
            </Text>
          </Stack>
        </Paper>
      )}
    </PageSection>
  );
}
