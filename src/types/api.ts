export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  category: string;
  durationMinutes: number;
  imageUrl: string;
  coordinates: Coordinates;
  featured: boolean;
}

export type RouteDuration = '3_hours' | 'half_day' | '1_day';
export type RouteLanguage = 'kaa' | 'uz' | 'ru' | 'en';
export type TripStyle = 'balanced' | 'culture' | 'scenic' | 'family';
export type TransportPreference = 'walking' | 'car' | 'driver';
export type BudgetLevel = 'light' | 'comfortable' | 'premium';
export type TravelPace = 'easy' | 'steady' | 'full';

export interface RouteGenerationInput {
  city: string;
  duration: RouteDuration;
  interests: string[];
  language: RouteLanguage;
  tripStyle?: TripStyle;
  transportPreference?: TransportPreference;
  budgetLevel?: BudgetLevel;
  travelPace?: TravelPace;
}

export interface GeneratedRoutePlace {
  id: string;
  name: string;
  city: string;
  category: string;
  imageUrl: string;
  coordinates: Coordinates;
  description: string;
}

export interface GeneratedRouteItem {
  time: string;
  place: GeneratedRoutePlace;
  reason: string;
  estimatedDurationMinutes: number;
}

export interface RouteSummary {
  stopCount: number;
  estimatedStartTime: string;
  estimatedEndTime: string;
  usedDuration: RouteDuration;
  interests: string[];
  tripStyle?: TripStyle;
  transportPreference?: TransportPreference;
  budgetLevel?: BudgetLevel;
  travelPace?: TravelPace;
}

export interface GeneratedRoute {
  city: string;
  duration: RouteDuration;
  language: RouteLanguage;
  totalMinutes: number;
  items: GeneratedRouteItem[];
  summary: RouteSummary;
}

export interface ChatMessageRequest {
  message: string;
  language: RouteLanguage;
}

export interface ChatMessageResponse {
  reply: string;
  source: 'fallback' | 'openai';
  suggestions?: string[];
}
