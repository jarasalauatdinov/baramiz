import type { GeneratedRoute, RouteDuration, RouteLanguage } from '../../../types/api';

export type TripStyle = 'balanced' | 'culture' | 'scenic' | 'family';
export type TransportPreference = 'walking' | 'car' | 'driver';
export type BudgetLevel = 'light' | 'comfortable' | 'premium';
export type TravelPace = 'easy' | 'steady' | 'full';

export interface RoutePlanningPreferences {
  city: string;
  interests: string[];
  tripStyle: TripStyle;
  transportPreference: TransportPreference;
  budgetLevel: BudgetLevel;
  language?: RouteLanguage | null;
  duration?: RouteDuration | null;
  travelPace?: TravelPace | null;
}

export interface RoutePlanningRequest extends RoutePlanningPreferences {
  language: RouteLanguage;
}

export interface RoutePlanningResult {
  route: GeneratedRoute;
  request: RoutePlanningRequest;
  source: 'backend' | 'mock';
}

export interface PlannerOptionDefinition<T extends string> {
  value: T;
  labelKey: string;
  defaultLabel: string;
  descriptionKey?: string;
  defaultDescription?: string;
}
