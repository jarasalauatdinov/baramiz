import type { TFunction } from 'i18next';
import type { RouteDuration, RouteLanguage } from '../../../types/api';
import {
  budgetLevelDefinitions,
  durationDefinitions,
  transportPreferenceDefinitions,
  travelPaceDefinitions,
  tripStyleDefinitions,
} from '../../../entities/route/model/planningCatalog';
import type {
  BudgetLevel,
  PlannerOptionDefinition,
  TransportPreference,
  TravelPace,
  TripStyle,
} from '../../../entities/route/model/planningTypes';

export interface PlannerOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

const localizeDefinitions = <T extends string>(
  definitions: PlannerOptionDefinition<T>[],
  t: TFunction,
): PlannerOption<T>[] =>
  definitions.map((definition) => ({
    value: definition.value,
    label: t(definition.labelKey, { defaultValue: definition.defaultLabel }),
    description: definition.descriptionKey
      ? t(definition.descriptionKey, {
          defaultValue: definition.defaultDescription,
        })
      : undefined,
  }));

export const getTripStyleOptions = (t: TFunction): PlannerOption<TripStyle>[] =>
  localizeDefinitions(tripStyleDefinitions, t);

export const getTransportOptions = (t: TFunction): PlannerOption<TransportPreference>[] =>
  localizeDefinitions(transportPreferenceDefinitions, t);

export const getBudgetOptions = (t: TFunction): PlannerOption<BudgetLevel>[] =>
  localizeDefinitions(budgetLevelDefinitions, t);

export const getDurationOptions = (t: TFunction): PlannerOption<RouteDuration>[] =>
  localizeDefinitions(durationDefinitions, t);

export const getTravelPaceOptions = (t: TFunction): PlannerOption<TravelPace>[] =>
  localizeDefinitions(travelPaceDefinitions, t);

export const getTripStyleLabel = (value: TripStyle, t: TFunction): string =>
  getTripStyleOptions(t).find((option) => option.value === value)?.label ?? value;

export const getTransportPreferenceLabel = (value: TransportPreference, t: TFunction): string =>
  getTransportOptions(t).find((option) => option.value === value)?.label ?? value;

export const getBudgetLevelLabel = (value: BudgetLevel, t: TFunction): string =>
  getBudgetOptions(t).find((option) => option.value === value)?.label ?? value;

export const getTravelPaceLabel = (value: TravelPace | null | undefined, t: TFunction): string => {
  if (!value) {
    return t('routeGenerator.options.pace.flexible', { defaultValue: 'Flexible pace' });
  }

  return getTravelPaceOptions(t).find((option) => option.value === value)?.label ?? value;
};

export const getDurationLabel = (value: RouteDuration | null | undefined, t: TFunction): string => {
  if (!value) {
    return t('routeGenerator.form.durationFlexible', { defaultValue: 'Flexible duration' });
  }

  return getDurationOptions(t).find((option) => option.value === value)?.label ?? value;
};

export const resolvePlannerLanguage = (language: string | undefined): RouteLanguage => {
  if (language === 'kaa' || language === 'en' || language === 'ru') {
    return language;
  }

  return 'uz';
};

