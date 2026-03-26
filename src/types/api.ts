export type Id = string | number;

export interface Category {
  id: Id;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Place {
  id: Id;
  name: string;
  description?: string;
  categoryId?: Id;
  categoryName?: string;
  city?: string;
  region?: string;
  imageUrl?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  rating?: number;
  featured?: boolean;
  durationMinutes?: number;
}

export type RouteDuration = '3_hours' | 'half_day' | '1_day';

export type RouteLanguage = 'uz' | 'en' | 'ru';

export interface RouteGenerationInput {
  city: string;
  duration: RouteDuration;
  interests: string[];
  language: RouteLanguage;
}

export interface GeneratedRoutePlace {
  id: string;
  name: string;
  city: string;
  category: string;
  image: string;
}

export interface GeneratedRouteItem {
  time: string;
  place: GeneratedRoutePlace;
  reason: string;
  estimatedDurationMinutes: number;
}

export interface GeneratedRoute {
  city: string;
  duration: RouteDuration;
  language: RouteLanguage;
  totalMinutes: number;
  items: GeneratedRouteItem[];
}

export interface ChatMessageRequest {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatMessageResponse {
  reply: string;
  raw?: unknown;
}
