import { useEffect, useMemo, useState } from 'react';
import { Alert, Container, Paper, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeaderBlock } from '../components/layout/PageHeaderBlock';
import { PageSection } from '../components/layout/PageSection';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { setCurrentRouteResult } from '../features/route-planning/model/currentRoute';
import { createRoutePlanningResult } from '../features/route-planning/model/plannerService';
import { resolvePlannerLanguage } from '../features/route-planning/model/options';
import type { RoutePlanningPreferences } from '../features/route-planning/model/types';
import { RoutePlanningForm } from '../features/route-planning/ui/RoutePlanningForm';
import { getRouteBuilderAssistantPrompts } from '../features/travel-assistant/model/promptSuggestions';
import { TravelAssistantPanel } from '../features/travel-assistant/ui/TravelAssistantPanel';
import { routePaths } from '../router/paths';
import type { Category, Place } from '../types/api';

const fallbackInterests = ['history', 'culture', 'museum', 'nature', 'adventure', 'food'];

interface InterestOption {
  id: string;
}

const deriveCityOptions = (places: Place[]) =>
  Array.from(new Set(places.map((place) => place.city).filter(Boolean))) as string[];

export function RouteGeneratorPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city')?.trim() ?? '';
  const queryInterest = searchParams.get('interest')?.trim().toLowerCase() ?? '';

  const [interestOptions, setInterestOptions] = useState<InterestOption[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasDataError, setHasDataError] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadForm = async () => {
      const [categoriesResult, placesResult] = await Promise.allSettled([
        getCategories(),
        getPlaces(),
      ]);

      if (!active) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setInterestOptions(
          categoriesResult.value.map((category: Category) => ({
            id: String(category.id),
          })),
        );
      } else {
        console.error('Failed to load route interests', categoriesResult.reason);
        setInterestOptions(fallbackInterests.map((id) => ({ id })));
        setHasDataError(true);
      }

      if (placesResult.status === 'fulfilled') {
        setCityOptions(deriveCityOptions(placesResult.value));
      } else {
        console.error('Failed to load route cities', placesResult.reason);
        setHasDataError(true);
      }

      setLoading(false);
    };

    void loadForm();

    return () => {
      active = false;
    };
  }, []);

  const initialValues = useMemo<Partial<RoutePlanningPreferences>>(
    () => ({
      city: queryCity,
      interests: queryInterest ? [queryInterest] : [],
    }),
    [queryCity, queryInterest],
  );

  const assistantPrompts = useMemo(
    () =>
      getRouteBuilderAssistantPrompts(t, {
        city: queryCity || undefined,
        interest: queryInterest || undefined,
      }),
    [queryCity, queryInterest, t],
  );

  const handleSubmit = async (values: RoutePlanningPreferences) => {
    try {
      setSubmitting(true);
      setHasSubmitError(false);

      const result = await createRoutePlanningResult(
        {
          ...values,
          language: resolvePlannerLanguage(i18n.resolvedLanguage),
        },
        { t },
      );

      notifications.show({
        title: t('routeGenerator.notification.title'),
        message: t('routeGenerator.notification.message', { city: values.city }),
        color: 'forest',
      });

      setCurrentRouteResult(result);

      navigate(routePaths.appRouteResult, {
        state: result,
      });
    } catch (error) {
      console.error('Failed to generate route', error);
      setHasSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageSection py={{ base: 14, md: 22 }}>
      <Container size="xl">
        <PageHeaderBlock
          eyebrow={t('routeGenerator.form.eyebrow')}
          title={t('routeGenerator.form.title')}
          description={t('routeGenerator.form.description')}
          size="section"
        />

        <Stack gap="lg">
          {hasDataError ? (
            <Alert color="yellow" variant="light">
              {t('routeGenerator.errors.partialData', {
                defaultValue:
                  'Some live planning data could not be loaded. You can still build a route using the available planner options.',
              })}
            </Alert>
          ) : null}

          {hasSubmitError ? (
            <Alert color="red" variant="light">
              {t('routeGenerator.errors.generateFailed')}
            </Alert>
          ) : null}

          <Paper
            withBorder
            radius="30px"
            p={{ base: 'lg', md: '2rem' }}
            bg="white"
            style={{
              borderColor: 'rgba(23, 49, 42, 0.1)',
              boxShadow: '0 20px 46px rgba(24, 34, 28, 0.08)',
            }}
          >
            <RoutePlanningForm
              cityOptions={cityOptions}
              interestOptions={interestOptions}
              initialValues={initialValues}
              loading={loading}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
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
          />

          <Paper withBorder radius="24px" p="lg" bg="white">
            <Text fw={700}>
              {t('routeGenerator.integrations.title', { defaultValue: 'Route generation flow' })}
            </Text>
            <Text c="dimmed" mt={6} size="sm">
              {t('routeGenerator.integrations.description', {
                defaultValue:
                  'Backend route API is used first. Local fallback is only for failures.',
              })}
            </Text>
          </Paper>
        </Stack>
      </Container>
    </PageSection>
  );
}
