import { Container, SimpleGrid, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceCard } from '../components/ServiceCard';
import { getLocalizedServiceSections } from '../data/services';

export function ServicesPage() {
  const { t } = useTranslation();
  const localizedSections = useMemo(() => getLocalizedServiceSections(t), [t]);

  return (
    <Container size="xl" py={{ base: 28, md: 40 }}>
      <Stack gap={42}>
        {localizedSections.map((section) => (
          <Stack key={section.id} gap="md">
            <div>
              <Text size="xs" fw={700} tt="uppercase" c="sun.8" style={{ letterSpacing: '0.08em' }}>
                {t('servicesPage.eyebrow')}
              </Text>
              <Text fw={800} fz="1.4rem" mt={4}>
                {section.title}
              </Text>
              <Text c="dimmed" mt={6} maw={760} style={{ lineHeight: 1.68 }}>
                {section.description}
              </Text>
            </div>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {section.items.map((item) => (
                <ServiceCard key={item.title} item={item} actionLabel={t('common.viewService')} />
              ))}
            </SimpleGrid>
          </Stack>
        ))}
      </Stack>
    </Container>
  );
}
