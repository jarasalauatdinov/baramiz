import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GuideCard } from '../components/GuideCard';
import { PageHeaderBlock } from '../components/layout/PageHeaderBlock';
import { PageSection } from '../components/layout/PageSection';
import { getGuideCityOptions, getGuideSpecialtyOptions, guideProfiles } from '../data/guides';
import { routePaths } from '../router/paths';

const ALL_OPTION = 'all';

export function GuidesPage() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState(ALL_OPTION);
  const [selectedSpecialty, setSelectedSpecialty] = useState(ALL_OPTION);

  const cityOptions = useMemo(
    () => [
      {
        value: ALL_OPTION,
        label: t('guidesPage.filters.allCities', { defaultValue: 'All cities' }),
      },
      ...getGuideCityOptions().map((city) => ({ value: city, label: city })),
    ],
    [t],
  );

  const specialtyOptions = useMemo(
    () => [
      {
        value: ALL_OPTION,
        label: t('guidesPage.filters.allSpecialties', { defaultValue: 'All specialties' }),
      },
      ...getGuideSpecialtyOptions().map((specialty) => ({ value: specialty, label: specialty })),
    ],
    [t],
  );

  const visibleGuides = useMemo(() => {
    return guideProfiles.filter((guide) => {
      const matchesCity = selectedCity === ALL_OPTION || guide.availableCities.includes(selectedCity);
      const matchesSpecialty =
        selectedSpecialty === ALL_OPTION || guide.specialties.includes(selectedSpecialty);

      return matchesCity && matchesSpecialty;
    });
  }, [selectedCity, selectedSpecialty]);

  return (
    <PageSection py={{ base: 18, md: 28 }}>
      <PageHeaderBlock
        eyebrow={t('guidesPage.eyebrow', { defaultValue: 'Local guides' })}
        title={t('guidesPage.title', {
          defaultValue: 'Local guides for your trip',
        })}
        description={t('guidesPage.description', {
          defaultValue:
            'Find guides by city and specialization.',
        })}
        size="section"
        action={
          <Button component={Link} to={routePaths.appServices} variant="light" color="forest">
            {t('guidesPage.action', { defaultValue: 'Browse services' })}
          </Button>
        }
      />

      <Paper withBorder p="lg" radius="24px" mb="xl" bg="white">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <div>
              <Text fw={700} fz="1.05rem">
                {t('guidesPage.filters.title', { defaultValue: 'Filter guides' })}
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                {t('guidesPage.filters.description', {
                  defaultValue: 'Narrow by city and specialization.',
                })}
              </Text>
            </div>
            <Text size="sm" c="dimmed">
              {t('guidesPage.results.title', {
                count: visibleGuides.length,
                defaultValue: '{{count}} guides available',
              })}
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <Select
              label={t('guidesPage.filters.cityLabel', { defaultValue: 'City' })}
              data={cityOptions}
              value={selectedCity}
              onChange={(value) => setSelectedCity(value ?? ALL_OPTION)}
            />
            <Select
              label={t('guidesPage.filters.specialtyLabel', { defaultValue: 'Specialization' })}
              data={specialtyOptions}
              value={selectedSpecialty}
              onChange={(value) => setSelectedSpecialty(value ?? ALL_OPTION)}
            />
          </SimpleGrid>
        </Stack>
      </Paper>

      <Group gap="xs" mb="lg" wrap="wrap">
        <Badge color="sun" variant="light" c="#5a420b">
          {t('guidesPage.badges.languages', {
            defaultValue: 'Multilingual communication',
          })}
        </Badge>
        <Badge color="forest" variant="light">
          {t('guidesPage.badges.routes', {
            defaultValue: 'Destination and route support',
          })}
        </Badge>
        <Badge color="gray" variant="light">
          {t('guidesPage.badges.contact', { defaultValue: 'Direct contact options' })}
        </Badge>
      </Group>

      {visibleGuides.length > 0 ? (
        <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="lg">
          {visibleGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </SimpleGrid>
      ) : (
        <Paper withBorder p="xl" radius="24px" bg="white">
          <Stack gap="sm">
            <Text fw={700}>
              {t('guidesPage.empty.title', { defaultValue: 'No guides match the current filters' })}
            </Text>
            <Text c="dimmed">
              {t('guidesPage.empty.description', {
                defaultValue:
                  'Try another city or specialization, or continue with destinations and services while guide coverage expands.',
              })}
            </Text>
          </Stack>
        </Paper>
      )}
    </PageSection>
  );
}
