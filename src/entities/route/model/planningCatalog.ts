import type { RouteDuration } from '../../../types/api';
import type {
  BudgetLevel,
  PlannerOptionDefinition,
  TravelPace,
  TransportPreference,
  TripStyle,
} from './planningTypes';

export const tripStyleDefinitions: PlannerOptionDefinition<TripStyle>[] = [
  {
    value: 'balanced',
    labelKey: 'routeGenerator.options.tripStyle.balanced.label',
    defaultLabel: 'Balanced route',
    descriptionKey: 'routeGenerator.options.tripStyle.balanced.description',
    defaultDescription: 'Mix landmarks, local atmosphere, and practical stop order.',
  },
  {
    value: 'culture',
    labelKey: 'routeGenerator.options.tripStyle.culture.label',
    defaultLabel: 'Culture first',
    descriptionKey: 'routeGenerator.options.tripStyle.culture.description',
    defaultDescription: 'Prioritize museums, heritage, and places with stronger context.',
  },
  {
    value: 'scenic',
    labelKey: 'routeGenerator.options.tripStyle.scenic.label',
    defaultLabel: 'Scenic and outdoor',
    descriptionKey: 'routeGenerator.options.tripStyle.scenic.description',
    defaultDescription: 'Favor viewpoints, open-air stops, and destination atmosphere.',
  },
  {
    value: 'family',
    labelKey: 'routeGenerator.options.tripStyle.family.label',
    defaultLabel: 'Family-friendly',
    descriptionKey: 'routeGenerator.options.tripStyle.family.description',
    defaultDescription: 'Keep the route easier to follow and more comfortable to pace.',
  },
];

export const transportPreferenceDefinitions: PlannerOptionDefinition<TransportPreference>[] = [
  {
    value: 'walking',
    labelKey: 'routeGenerator.options.transport.walking.label',
    defaultLabel: 'Mostly walking',
    descriptionKey: 'routeGenerator.options.transport.walking.description',
    defaultDescription: 'Prefer shorter hops and a lighter city rhythm.',
  },
  {
    value: 'car',
    labelKey: 'routeGenerator.options.transport.car.label',
    defaultLabel: 'Own car',
    descriptionKey: 'routeGenerator.options.transport.car.description',
    defaultDescription: 'Allow wider movement across the destination and nearby points.',
  },
  {
    value: 'driver',
    labelKey: 'routeGenerator.options.transport.driver.label',
    defaultLabel: 'Driver or transfer',
    descriptionKey: 'routeGenerator.options.transport.driver.description',
    defaultDescription: 'Useful when the traveler wants support with sequencing and movement.',
  },
];

export const budgetLevelDefinitions: PlannerOptionDefinition<BudgetLevel>[] = [
  {
    value: 'light',
    labelKey: 'routeGenerator.options.budget.light.label',
    defaultLabel: 'Light budget',
    descriptionKey: 'routeGenerator.options.budget.light.description',
    defaultDescription: 'Prioritize accessible stops and practical pacing.',
  },
  {
    value: 'comfortable',
    labelKey: 'routeGenerator.options.budget.comfortable.label',
    defaultLabel: 'Comfortable',
    descriptionKey: 'routeGenerator.options.budget.comfortable.description',
    defaultDescription: 'Keep the route balanced and convenient for most travelers.',
  },
  {
    value: 'premium',
    labelKey: 'routeGenerator.options.budget.premium.label',
    defaultLabel: 'Premium feel',
    descriptionKey: 'routeGenerator.options.budget.premium.description',
    defaultDescription: 'Lean toward standout stops and smoother travel flow.',
  },
];

export const durationDefinitions: PlannerOptionDefinition<RouteDuration>[] = [
  {
    value: '3_hours',
    labelKey: 'routeGenerator.durations.3_hours.label',
    defaultLabel: '3 hours',
    descriptionKey: 'routeGenerator.durations.3_hours.helper',
    defaultDescription: 'Short and focused route.',
  },
  {
    value: 'half_day',
    labelKey: 'routeGenerator.durations.half_day.label',
    defaultLabel: 'Half day',
    descriptionKey: 'routeGenerator.durations.half_day.helper',
    defaultDescription: 'Balanced half-day planning window.',
  },
  {
    value: '1_day',
    labelKey: 'routeGenerator.durations.1_day.label',
    defaultLabel: '1 day',
    descriptionKey: 'routeGenerator.durations.1_day.helper',
    defaultDescription: 'Full-day route with more variety.',
  },
];

export const travelPaceDefinitions: PlannerOptionDefinition<TravelPace>[] = [
  {
    value: 'easy',
    labelKey: 'routeGenerator.options.pace.easy.label',
    defaultLabel: 'Easy pace',
    descriptionKey: 'routeGenerator.options.pace.easy.description',
    defaultDescription: 'Fewer stops and more breathing room.',
  },
  {
    value: 'steady',
    labelKey: 'routeGenerator.options.pace.steady.label',
    defaultLabel: 'Steady pace',
    descriptionKey: 'routeGenerator.options.pace.steady.description',
    defaultDescription: 'A balanced route for most travelers.',
  },
  {
    value: 'full',
    labelKey: 'routeGenerator.options.pace.full.label',
    defaultLabel: 'Full schedule',
    descriptionKey: 'routeGenerator.options.pace.full.description',
    defaultDescription: 'Fit more stops into the same trip window.',
  },
];

export const routeDurationMinutes: Record<RouteDuration, number> = {
  '3_hours': 180,
  half_day: 300,
  '1_day': 480,
};

export const routeStartMinutesByDuration: Record<RouteDuration, number> = {
  '3_hours': 10 * 60,
  half_day: 9 * 60,
  '1_day': 9 * 60,
};

export const defaultDurationByPace: Record<TravelPace, RouteDuration> = {
  easy: '3_hours',
  steady: 'half_day',
  full: '1_day',
};

export const tripStyleCategoryKeywords: Record<TripStyle, string[]> = {
  balanced: ['culture', 'museum', 'history', 'food'],
  culture: ['museum', 'history', 'culture'],
  scenic: ['nature', 'adventure', 'outdoor'],
  family: ['museum', 'culture', 'food', 'nature'],
};

export const travelPaceStopAdjustments: Record<TravelPace, number> = {
  easy: -1,
  steady: 0,
  full: 1,
};

export const defaultStopDurationByPace: Record<TravelPace, number> = {
  easy: 70,
  steady: 60,
  full: 55,
};

export const budgetReasonTranslationKeys: Record<BudgetLevel, string> = {
  light: 'routeGenerator.mock.budget.light',
  comfortable: 'routeGenerator.mock.budget.comfortable',
  premium: 'routeGenerator.mock.budget.premium',
};

