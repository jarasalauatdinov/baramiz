import { useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories, type Category } from '../entities/category';
import { getLocalizedDestinationByCity, getLocalizedDestinations } from '../entities/destination';
import { getPlaces, type Place } from '../entities/place';
import { setCurrentRouteResult } from '../features/route-planning/model/currentRoute';
import { resolvePlannerLanguage } from '../features/route-planning/model/options';
import { createRoutePlanningResult } from '../features/route-planning/model/plannerService';
import type { RoutePlanningPreferences } from '../features/route-planning/model/types';
import { getRouteBuilderAssistantPrompts } from '../features/travel-assistant/model/promptSuggestions';
import { RouteBuilderScreen } from '../widgets/route-builder';
import { routePaths } from '../router/paths';

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

  const destinations = useMemo(() => getLocalizedDestinations(t), [t]);
  const previewDestination = useMemo(
    () => getLocalizedDestinationByCity(queryCity || cityOptions[0], t) ?? destinations[0] ?? null,
    [cityOptions, destinations, queryCity, t],
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
    <RouteBuilderScreen
      previewDestination={previewDestination}
      queryCity={queryCity}
      queryInterest={queryInterest}
      hasDataError={hasDataError}
      hasSubmitError={hasSubmitError}
      loading={loading}
      submitting={submitting}
      cityOptions={cityOptions}
      interestOptions={interestOptions}
      initialValues={initialValues}
      assistantPrompts={assistantPrompts}
      onSubmit={handleSubmit}
    />
  );
}
