import {
  Badge,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/layout/HeroSection';
import { PageSection } from '../components/layout/PageSection';
import { SectionHeading } from '../components/SectionHeading';
import { publicUi } from '../shared/config/publicUi';
import { routePaths } from '../router/paths';

export function AboutPage() {
  const { t } = useTranslation();

  const platformHighlights = [
    {
      title: t('pages.about.highlights.discoveryTitle'),
      description: t('pages.about.highlights.discoveryDescription'),
    },
    {
      title: t('pages.about.highlights.multilingualTitle'),
      description: t('pages.about.highlights.multilingualDescription'),
    },
    {
      title: t('pages.about.highlights.backendTitle'),
      description: t('pages.about.highlights.backendDescription'),
    },
  ];

  const responsibilities = [
    t('pages.about.responsibilities.destinations'),
    t('pages.about.responsibilities.places'),
    t('pages.about.responsibilities.services'),
    t('pages.about.responsibilities.routes'),
  ];

  return (
    <>
      <PageSection py={{ base: 34, md: 54 }}>
        <HeroSection
          eyebrow={t('pages.about.badge')}
          title={t('pages.about.title')}
          description={t('pages.about.description')}
          actions={
            <Group gap="sm" wrap="wrap">
              <Button component={Link} to={routePaths.destinations} color="sun" c="#2d2208">
                {t('pages.about.primaryAction')}
              </Button>
              <Button component={Link} to={routePaths.services} variant="light" color="forest">
                {t('pages.about.secondaryAction')}
              </Button>
              <Button component={Link} to={routePaths.routeGenerator} variant="subtle">
                {t('pages.about.routeAction')}
              </Button>
            </Group>
          }
          meta={
            <Badge color="forest" variant="light" radius="xl" w="fit-content">
              {t('pages.about.meta')}
            </Badge>
          }
        />
      </PageSection>

      <PageSection py={{ base: 20, md: 30 }}>
          <SectionHeading
            eyebrow={t('pages.about.highlightsEyebrow')}
            title={t('pages.about.highlightsTitle')}
            description={t('pages.about.highlightsDescription')}
          />

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {platformHighlights.map((item, index) => (
              <Paper
                key={item.title}
                withBorder
                p="xl"
                radius="24px"
                style={{
                  borderColor: publicUi.border.default,
                  background: publicUi.background.surface,
                }}
              >
                <Stack gap="sm">
                  <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                    0{index + 1}
                  </Badge>
                  <Text fw={700} size="lg">
                    {item.title}
                  </Text>
                  <Text c="dimmed" style={{ lineHeight: 1.72 }}>
                    {item.description}
                  </Text>
                </Stack>
              </Paper>
              ))}
            </SimpleGrid>
      </PageSection>

      <PageSection py={{ base: 20, md: 56 }}>
          <Paper
            withBorder
            radius={publicUi.radius.panel}
            p={{ base: 'xl', md: '2rem' }}
            style={{
              borderColor: publicUi.border.accent,
              background: publicUi.background.accent,
            }}
          >
            <SectionHeading
              eyebrow={t('pages.about.flowEyebrow')}
              title={t('pages.about.flowTitle')}
              description={t('pages.about.flowDescription')}
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {responsibilities.map((item) => (
                <Paper key={item} withBorder p="lg" radius="22px" bg="white">
                  <Text style={{ lineHeight: 1.68 }}>{item}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>
      </PageSection>
    </>
  );
}
