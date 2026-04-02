import {
  Alert,
  Badge,
  Container,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { DestinationConfig } from '../../../entities/destination';
import { formatCategoryLabel } from '../../../entities/place';
import type { RoutePlanningPreferences } from '../../../features/route-planning/model/types';
import { RoutePlanningForm } from '../../../features/route-planning/ui/RoutePlanningForm';
import { TravelAssistantPanel } from '../../../features/travel-assistant/ui/TravelAssistantPanel';
import { publicUi } from '../../../shared/config/publicUi';
import { DestinationImage, PageSection } from '../../../shared/ui';

interface InterestOption {
  id: string;
}

interface RouteBuilderScreenProps {
  previewDestination: DestinationConfig | null;
  queryCity: string;
  queryInterest: string;
  hasDataError: boolean;
  hasSubmitError: boolean;
  loading: boolean;
  submitting: boolean;
  cityOptions: string[];
  interestOptions: InterestOption[];
  initialValues: Partial<RoutePlanningPreferences>;
  assistantPrompts: string[];
  onSubmit: (values: RoutePlanningPreferences) => Promise<void> | void;
}

export function RouteBuilderScreen({
  previewDestination,
  queryCity,
  queryInterest,
  hasDataError,
  hasSubmitError,
  loading,
  submitting,
  cityOptions,
  interestOptions,
  initialValues,
  assistantPrompts,
  onSubmit,
}: RouteBuilderScreenProps) {
  const { t } = useTranslation();

  return (
    <PageSection py={{ base: 14, md: 22 }}>
      <Container size="xl">
        <Stack gap="lg">
          {previewDestination ? (
            <Paper
              withBorder
              radius={publicUi.radius.hero}
              p={0}
              style={{
                overflow: 'hidden',
                borderColor: publicUi.border.accent,
                boxShadow: publicUi.shadow.hero,
              }}
            >
              <DestinationImage
                src={previewDestination.heroImage}
                name={previewDestination.name}
                city={previewDestination.city}
                category={previewDestination.heroCategory}
                height={190}
                radius={0}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 16,
                    display: 'grid',
                    alignContent: 'space-between',
                    zIndex: 1,
                  }}
                >
                  <Badge color="sun" variant="light" radius="xl" c="#5a420b" w="fit-content">
                    {t('routeGenerator.form.eyebrow')}
                  </Badge>

                  <Stack gap={4}>
                    <Text fw={800} c="white" size="1.4rem" lh={1.08}>
                      {t('routeGenerator.form.title')}
                    </Text>
                    <Text size="sm" c="rgba(255,255,255,0.9)" maw={420}>
                      {t('routeGenerator.hero.description', {
                        defaultValue:
                          'Choose the city, interests, and travel mood. Baramiz will return a practical route.',
                      })}
                    </Text>
                  </Stack>
                </div>
              </DestinationImage>

              <Stack p="md" gap="sm" bg="#fffdf8">
                <Stack gap={0}>
                  <Text fw={700}>{previewDestination.name}</Text>
                  <Text size="sm" c="dimmed">
                    {previewDestination.city}
                  </Text>
                </Stack>

                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {previewDestination.summary}
                </Text>

                <Stack gap="xs">
                  <Badge color="forest" variant="light" radius="xl" w="fit-content">
                    {queryCity || previewDestination.city}
                  </Badge>
                  {queryInterest ? (
                    <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                      {formatCategoryLabel(queryInterest, t)}
                    </Badge>
                  ) : null}
                </Stack>
              </Stack>
            </Paper>
          ) : null}

          {hasDataError ? (
            <Alert color="yellow" variant="light">
              {t('routeGenerator.errors.partialData', {
                defaultValue:
                  'Some live planning data could not be loaded. You can still build a route using the available planner options.',
              })}
            </Alert>
          ) : null}

          {hasSubmitError ? <Alert color="red" variant="light">{t('routeGenerator.errors.generateFailed')}</Alert> : null}

          <Paper
            withBorder
            radius="30px"
            p={{ base: 'lg', md: '2rem' }}
            bg="white"
            style={{
              borderColor: publicUi.border.default,
              boxShadow: publicUi.shadow.card,
              background: publicUi.background.panel,
            }}
          >
            <Stack gap="lg">
              <Stack gap={4}>
                <Text fw={800} size="1.12rem" lh={1.08}>
                  {t('routeGenerator.form.title')}
                </Text>
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                  {t('routeGenerator.summary.description', {
                    defaultValue:
                      'Keep it simple: city first, then interests, then route mood.',
                  })}
                </Text>
              </Stack>

              <RoutePlanningForm
                cityOptions={cityOptions}
                interestOptions={interestOptions}
                initialValues={initialValues}
                loading={loading}
                submitting={submitting}
                onSubmit={onSubmit}
              />
            </Stack>
          </Paper>

          <TravelAssistantPanel
            title={t('routeGenerator.assistant.title', {
              defaultValue: 'Need a quick answer?',
            })}
            description={t('routeGenerator.assistant.description', {
              defaultValue:
                'Ask about city, timing, or interests. Messages go only to Baramiz backend.',
            })}
            placeholder={t('routeGenerator.assistant.placeholder', {
              defaultValue: 'Ask about a city, timing, or what kind of route fits best...',
            })}
            emptyHint={t('routeGenerator.assistant.emptyHint', {
              defaultValue:
                'Use this for a short answer before generating the route. The full plan still comes from the route builder.',
            })}
            suggestions={assistantPrompts}
            compact
          />
        </Stack>
      </Container>
    </PageSection>
  );
}