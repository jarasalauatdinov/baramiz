import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCategories } from '../entities/category/api/categoryApi';
import { getPlaces } from '../entities/place/api/placeApi';
import { generateRoute } from '../entities/route/api/routeApi';
import type {
  Category,
  GeneratedRoute,
  Place,
  RouteGenerationInput,
  RouteLanguage,
} from '../types/api';
import { formatCategoryLabel } from '../utils/placeArtwork';

const fallbackInterests = ['history', 'culture', 'museum', 'nature', 'adventure', 'food'];
const ROUTE_DURATION_FALLBACK: RouteGenerationInput['duration'] = '1_day';

interface InterestOption {
  id: string;
}

interface FieldErrors {
  city?: boolean;
  interests?: boolean;
  language?: boolean;
}

const deriveCityOptions = (places: Place[]) =>
  Array.from(new Set(places.map((place) => place.city).filter(Boolean))) as string[];

export function RouteGeneratorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCity = searchParams.get('city')?.trim() ?? '';
  const queryInterest = searchParams.get('interest')?.trim().toLowerCase() ?? '';

  const [interestOptions, setInterestOptions] = useState<InterestOption[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [city, setCity] = useState(queryCity || 'Nukus');
  const [interests, setInterests] = useState<string[]>(
    queryInterest ? [queryInterest] : ['history', 'museum'],
  );
  const [language] = useState<RouteLanguage>('uz');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
        setInterestOptions(
          fallbackInterests.map((id) => ({
            id,
          })),
        );
      }

      if (placesResult.status === 'fulfilled') {
        const options = deriveCityOptions(placesResult.value);
        setCityOptions(options);
        if (queryCity && options.includes(queryCity)) {
          setCity(queryCity);
        }
      } else {
        console.error('Failed to load route cities', placesResult.reason);
      }

      setLoading(false);
    };

    void loadForm();

    return () => {
      active = false;
    };
  }, [queryCity]);

  const selectedInterestLabels = useMemo(
    () => interests.map((interestId) => formatCategoryLabel(interestId, t)),
    [interests, t],
  );

  const toggleInterest = (interestId: string) => {
    setInterests((current) =>
      current.includes(interestId)
        ? current.filter((item) => item !== interestId)
        : [...current, interestId],
    );
    setFieldErrors((current) => ({ ...current, interests: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      city: !city.trim(),
      interests: interests.length === 0,
      language: !language,
    };

    setFieldErrors(nextErrors);
    setHasSubmitError(false);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    const payload: RouteGenerationInput = {
      city: city.trim(),
      duration: ROUTE_DURATION_FALLBACK,
      interests,
      language,
    };

    try {
      setSubmitting(true);
      const route = await generateRoute(payload);
      notifications.show({
        title: t('routeGenerator.notification.title'),
        message: t('routeGenerator.notification.message', { city: payload.city }),
        color: 'forest',
      });
      navigate('/route-result', {
        state: {
          route,
          request: {
            interests: payload.interests,
            city: payload.city,
            duration: payload.duration,
          },
        } as { route: GeneratedRoute; request: Pick<RouteGenerationInput, 'interests' | 'city' | 'duration'> },
      });
    } catch (error) {
      console.error('Failed to generate route', error);
      setHasSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container size="sm" py={{ base: 34, md: 56 }}>
      <Paper
        withBorder
        radius="30px"
        p={{ base: 'lg', md: '2rem' }}
        bg="white"
        pos="relative"
        style={{
          borderColor: 'rgba(23, 49, 42, 0.1)',
          boxShadow: '0 20px 46px rgba(24, 34, 28, 0.08)',
        }}
      >
        <LoadingOverlay visible={loading} overlayProps={{ blur: 1 }} />

        <Stack gap="lg">
          <div>
            <Text fw={700} size="xs" tt="uppercase" c="sun.8" style={{ letterSpacing: '0.08em' }}>
              {t('routeGenerator.form.eyebrow')}
            </Text>
            <Title order={2} mt={6} style={{ lineHeight: 1.15 }}>
              {t('routeGenerator.form.title')}
            </Title>
            <Text mt="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
              {t('routeGenerator.form.description')}
            </Text>
          </div>

          {hasSubmitError ? (
            <Alert color="red" variant="light">
              {t('routeGenerator.errors.generateFailed')}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <Autocomplete
                label={t('routeGenerator.form.destinationLabel')}
                placeholder={t('routeGenerator.form.destinationPlaceholder')}
                data={cityOptions}
                value={city}
                onChange={(value) => {
                  setCity(value);
                  setFieldErrors((current) => ({ ...current, city: undefined }));
                }}
                error={fieldErrors.city ? t('routeGenerator.validation.city') : undefined}
              />

              <div>
                <Text fw={600}>{t('routeGenerator.form.interestsLabel')}</Text>
                <Group gap="sm" mt="sm">
                  {interestOptions.map((option) => {
                    const selected = interests.includes(option.id);
                    return (
                      <Button
                        key={option.id}
                        type="button"
                        variant={selected ? 'filled' : 'light'}
                        color={selected ? 'sun' : 'gray'}
                        c={selected ? '#2d2208' : undefined}
                        radius="xl"
                        onClick={() => toggleInterest(option.id)}
                      >
                        {formatCategoryLabel(option.id, t)}
                      </Button>
                    );
                  })}
                </Group>

                {selectedInterestLabels.length > 0 ? (
                  <Text size="sm" c="dimmed" mt="sm">
                    {t('routeGenerator.form.selectedInterests', {
                      items: selectedInterestLabels.join(', '),
                    })}
                  </Text>
                ) : null}

                {fieldErrors.interests ? (
                  <Text size="sm" c="red" mt="xs">
                    {t('routeGenerator.validation.interests')}
                  </Text>
                ) : null}
              </div>

           
              <Button
                type="submit"
                size="lg"
                fullWidth
                color="sun"
                c="#2d2208"
                loading={submitting}
                disabled={loading || submitting}
              >
                {t('common.generateRoute')}
              </Button>

              <Group justify="center">
                <Button type="button" variant="subtle" color="forest" onClick={() => navigate('/map')}>
                  {t('routeGenerator.form.openMap', { defaultValue: 'Open map navigator' })}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
