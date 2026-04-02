import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import {
  Autocomplete,
  Badge,
  Button,
  Paper,
  Group,
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
  getTransportPreferenceLabel,
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
      <Stack gap="lg">
        <Paper withBorder radius="22px" p="md" bg="#fff8ef">
          <Stack gap="sm">
            <div>
              <Text fw={700}>{t('routeGenerator.summary.title', { defaultValue: 'Route setup' })}</Text>
              <Text size="sm" c="dimmed" mt={4} style={{ lineHeight: 1.6 }}>
                {t('routeGenerator.summary.description', {
                  defaultValue: 'Choose the destination and route mood first. The planner will do the rest.',
                })}
              </Text>
            </div>

            <Group gap="xs" wrap="wrap">
              <Badge color="forest" variant="light" radius="xl">
                {city || t('routeGenerator.summary.pendingCity', { defaultValue: 'Choose a city' })}
              </Badge>
              <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                {selectedInterestsLabel ||
                  t('routeGenerator.summary.pendingInterests', {
                    defaultValue: 'Choose interests',
                  })}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {tripStyle ? getTripStyleLabel(tripStyle, t) : '-'}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {transportPreference
                  ? getTransportPreferenceLabel(transportPreference, t)
                  : '-'}
              </Badge>
            </Group>
          </Stack>
        </Paper>

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
          radius="xl"
          size="md"
          styles={{
            input: {
              minHeight: 52,
              background: '#fff',
              borderColor: 'rgba(94, 72, 53, 0.12)',
              boxShadow: '0 12px 26px rgba(60, 44, 31, 0.08)',
            },
          }}
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
          compact
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
          compact
          value={tripStyle}
          onToggle={(value) => {
            setTripStyle(value as RoutePlanningPreferences['tripStyle']);
            setErrors((current) => ({ ...current, tripStyle: undefined }));
          }}
          error={errors.tripStyle}
        />

        <PlannerOptionGroup
          label={t('routeGenerator.form.transportLabel', {
            defaultValue: 'Transport preference',
          })}
          description={t('routeGenerator.form.transportHelp', {
            defaultValue: 'How the traveler will move.',
          })}
          options={transportOptions}
          compact
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
          compact
          value={budgetLevel}
          onToggle={(value) => {
            setBudgetLevel(value as RoutePlanningPreferences['budgetLevel']);
            setErrors((current) => ({ ...current, budgetLevel: undefined }));
          }}
          error={errors.budgetLevel}
        />

        <Paper withBorder radius="22px" p="md" bg="#fffdf8" style={{ borderColor: 'rgba(188, 146, 111, 0.18)' }}>
          <Stack gap="lg">
            <div>
              <Text fw={700}>{t('routeGenerator.form.optionalTitle', { defaultValue: 'Optional preferences' })}</Text>
              <Text size="sm" c="dimmed" mt={4} style={{ lineHeight: 1.6 }}>
                {t('routeGenerator.form.optionalDescription', {
                  defaultValue: 'Use these only if you want the route to feel more specific.',
                })}
              </Text>
            </div>

            <PlannerOptionGroup
              label={t('routeGenerator.form.durationLabel')}
              description={t('routeGenerator.form.durationHelp', {
                defaultValue: 'Optional. Leave flexible if needed.',
              })}
              options={durationOptions}
              compact
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
              compact
              value={travelPace ?? null}
              onToggle={(value) =>
                setTravelPace((current) =>
                  current === value ? null : (value as RoutePlanningPreferences['travelPace']),
                )
              }
            />

            <Group gap="xs" wrap="wrap">
              <Badge color="gray" variant="light" radius="xl">
                {budgetLevel ? getBudgetLevelLabel(budgetLevel, t) : '-'}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {getDurationLabel(duration, t)}
              </Badge>
              <Badge color="gray" variant="light" radius="xl">
                {getTravelPaceLabel(travelPace, t)}
              </Badge>
            </Group>
          </Stack>
        </Paper>

        <Button
          type="submit"
          size="lg"
          fullWidth
          color="sun"
          c="#2d2208"
          loading={submitting}
          disabled={loading || submitting}
          style={{ boxShadow: '0 14px 28px rgba(229, 182, 47, 0.22)' }}
        >
          {t('routeGenerator.form.submit', { defaultValue: 'Build route' })}
        </Button>
      </Stack>
    </form>
  );
}
