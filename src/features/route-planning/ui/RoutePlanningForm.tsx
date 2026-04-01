import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  Autocomplete,
  Button,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { PlannerOptionGroup } from './PlannerOptionGroup';
import {
  getBudgetLevelLabel,
  getBudgetOptions,
  getDurationLabel,
  getDurationOptions,
  getTransportOptions,
  getTravelPaceLabel,
  getTravelPaceOptions,
  getTripStyleLabel,
  getTripStyleOptions,
} from '../model/options';
import type { RoutePlanningPreferences } from '../model/types';
import { formatCategoryLabel } from '../../../utils/placeArtwork';

interface InterestOption {
  id: string;
}

interface RoutePlanningFormProps {
  cityOptions: string[];
  interestOptions: InterestOption[];
  loading: boolean;
  submitting: boolean;
  initialValues: Partial<RoutePlanningPreferences>;
  onSubmit: (values: RoutePlanningPreferences) => Promise<void> | void;
}

interface FieldErrors {
  city?: string;
  interests?: string;
  tripStyle?: string;
  transportPreference?: string;
  budgetLevel?: string;
}

export function RoutePlanningForm({
  cityOptions,
  interestOptions,
  loading,
  submitting,
  initialValues,
  onSubmit,
}: RoutePlanningFormProps) {
  const { t } = useTranslation();
  const [city, setCity] = useState(initialValues.city ?? '');
  const [interests, setInterests] = useState<string[]>(initialValues.interests ?? []);
  const [tripStyle, setTripStyle] = useState<RoutePlanningPreferences['tripStyle'] | null>(
    initialValues.tripStyle ?? 'balanced',
  );
  const [transportPreference, setTransportPreference] = useState<RoutePlanningPreferences['transportPreference'] | null>(
    initialValues.transportPreference ?? 'car',
  );
  const [budgetLevel, setBudgetLevel] = useState<RoutePlanningPreferences['budgetLevel'] | null>(
    initialValues.budgetLevel ?? 'comfortable',
  );
  const [duration, setDuration] = useState<RoutePlanningPreferences['duration']>(
    initialValues.duration ?? null,
  );
  const [travelPace, setTravelPace] = useState<RoutePlanningPreferences['travelPace']>(
    initialValues.travelPace ?? null,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const tripStyleOptions = useMemo(() => getTripStyleOptions(t), [t]);
  const transportOptions = useMemo(() => getTransportOptions(t), [t]);
  const budgetOptions = useMemo(() => getBudgetOptions(t), [t]);
  const durationOptions = useMemo(() => getDurationOptions(t), [t]);
  const paceOptions = useMemo(() => getTravelPaceOptions(t), [t]);

  const selectedInterestsLabel = useMemo(
    () => interests.map((interestId) => formatCategoryLabel(interestId, t)).join(', '),
    [interests, t],
  );

  const toggleInterest = (interestId: string) => {
    setInterests((current) =>
      current.includes(interestId)
        ? current.filter((item) => item !== interestId)
        : [...current, interestId],
    );
    setErrors((current) => ({ ...current, interests: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      city: city.trim() ? undefined : t('routeGenerator.validation.city'),
      interests: interests.length > 0 ? undefined : t('routeGenerator.validation.interests'),
      tripStyle: tripStyle ? undefined : t('routeGenerator.validation.tripStyle', { defaultValue: 'Choose a trip style.' }),
      transportPreference: transportPreference
        ? undefined
        : t('routeGenerator.validation.transport', { defaultValue: 'Choose how the traveler moves.' }),
      budgetLevel: budgetLevel
        ? undefined
        : t('routeGenerator.validation.budget', { defaultValue: 'Choose a budget level.' }),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean) || !tripStyle || !transportPreference || !budgetLevel) {
      return;
    }

    await onSubmit({
      city: city.trim(),
      interests,
      tripStyle,
      transportPreference,
      budgetLevel,
      duration,
      travelPace,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg">
        <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="26px" bg="white">
          <Stack gap="lg">
            <Autocomplete
              label={t('routeGenerator.form.destinationLabel')}
              placeholder={t('routeGenerator.form.destinationPlaceholder')}
              data={cityOptions}
              value={city}
              onChange={(value) => {
                setCity(value);
                setErrors((current) => ({ ...current, city: undefined }));
              }}
              error={errors.city}
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.interestsLabel')}
              description={t('routeGenerator.form.interestsHelp', {
                defaultValue: 'Pick what matters most.',
              })}
              options={interestOptions.map((option) => ({
                value: option.id,
                label: formatCategoryLabel(option.id, t),
              }))}
              multiple
              value={interests}
              onToggle={toggleInterest}
              error={errors.interests}
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.tripStyleLabel', { defaultValue: 'Trip style' })}
              description={t('routeGenerator.form.tripStyleHelp', {
                defaultValue: 'Set the overall route feel.',
              })}
              options={tripStyleOptions}
              value={tripStyle}
              onToggle={(value) => {
                setTripStyle(value as RoutePlanningPreferences['tripStyle']);
                setErrors((current) => ({ ...current, tripStyle: undefined }));
              }}
              error={errors.tripStyle}
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.transportLabel', { defaultValue: 'Transport preference' })}
              description={t('routeGenerator.form.transportHelp', {
                defaultValue: 'How the traveler will move.',
              })}
              options={transportOptions}
              value={transportPreference}
              onToggle={(value) => {
                setTransportPreference(value as RoutePlanningPreferences['transportPreference']);
                setErrors((current) => ({ ...current, transportPreference: undefined }));
              }}
              error={errors.transportPreference}
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.budgetLabel', { defaultValue: 'Budget level' })}
              description={t('routeGenerator.form.budgetHelp', {
                defaultValue: 'Set travel comfort level.',
              })}
              options={budgetOptions}
              value={budgetLevel}
              onToggle={(value) => {
                setBudgetLevel(value as RoutePlanningPreferences['budgetLevel']);
                setErrors((current) => ({ ...current, budgetLevel: undefined }));
              }}
              error={errors.budgetLevel}
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.durationLabel')}
              description={t('routeGenerator.form.durationHelp', {
                defaultValue: 'Optional. Leave flexible if needed.',
              })}
              options={durationOptions}
              value={duration ?? null}
              onToggle={(value) =>
                setDuration((current) =>
                  current === value ? null : (value as RoutePlanningPreferences['duration']),
                )
              }
            />

            <PlannerOptionGroup
              label={t('routeGenerator.form.paceLabel', { defaultValue: 'Travel pace' })}
              description={t('routeGenerator.form.paceHelp', {
                defaultValue: 'Optional. Controls route density.',
              })}
              options={paceOptions}
              value={travelPace ?? null}
              onToggle={(value) =>
                setTravelPace((current) =>
                  current === value ? null : (value as RoutePlanningPreferences['travelPace']),
                )
              }
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              color="sun"
              c="#2d2208"
              loading={submitting}
              disabled={loading || submitting}
            >
              {t('routeGenerator.form.submit', { defaultValue: 'Build route' })}
            </Button>
          </Stack>
        </Paper>

        <Stack gap="lg">
          <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="26px" bg="white">
            <Stack gap="sm">
              <Text fw={700}>{t('routeGenerator.summary.title', { defaultValue: 'Planning summary' })}</Text>
              <Text c="dimmed" style={{ lineHeight: 1.68 }}>
                {t('routeGenerator.summary.description', {
                  defaultValue: 'The system uses your route priorities to shape stop order, route density, and travel logic.',
                })}
              </Text>
              <Stack gap={8} mt="sm">
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.city', { defaultValue: 'Starting city' })}:</Text> {city || t('routeGenerator.summary.pendingCity', { defaultValue: 'Choose a city' })}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.interests', { defaultValue: 'Interests' })}:</Text> {selectedInterestsLabel || t('routeGenerator.summary.pendingInterests', { defaultValue: 'Choose at least one interest' })}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.tripStyle', { defaultValue: 'Trip style' })}:</Text> {tripStyle ? getTripStyleLabel(tripStyle, t) : '-'}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.transport', { defaultValue: 'Transport' })}:</Text> {transportPreference ? getTransportOptions(t).find((item) => item.value === transportPreference)?.label : '-'}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.budget', { defaultValue: 'Budget' })}:</Text> {budgetLevel ? getBudgetLevelLabel(budgetLevel, t) : '-'}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.duration', { defaultValue: 'Duration' })}:</Text> {getDurationLabel(duration, t)}</Text>
                <Text size="sm"><Text span fw={700}>{t('routeGenerator.summary.pace', { defaultValue: 'Pace' })}:</Text> {getTravelPaceLabel(travelPace, t)}</Text>
              </Stack>
            </Stack>
          </Paper>

          <Paper withBorder p={{ base: 'lg', md: 'xl' }} radius="26px" bg="white">
            <Stack gap="sm">
              <Text fw={700}>{t('routeGenerator.output.title', { defaultValue: 'What the result will include' })}</Text>
              <Text c="dimmed" style={{ lineHeight: 1.68 }}>
                {t('routeGenerator.output.description', {
                  defaultValue: 'The result screen gives a clear route plan.',
                })}
              </Text>
              <Stack gap={8} mt="sm">
                <Text size="sm">- {t('routeGenerator.output.item1', { defaultValue: 'Stop-by-stop timeline with reasons.' })}</Text>
                <Text size="sm">- {t('routeGenerator.output.item2', { defaultValue: 'Map-ready stops when coordinates exist.' })}</Text>
                <Text size="sm">- {t('routeGenerator.output.item3', { defaultValue: 'Quick links to places and support.' })}</Text>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </SimpleGrid>
    </form>
  );
}
