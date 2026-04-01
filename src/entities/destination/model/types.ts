import type { GeoPoint } from '../../../shared/lib/map/geo';

export interface DestinationMetric {
  label: string;
  value: string;
}

export interface DestinationNearbyPoint {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  coordinates: GeoPoint;
  estimatedVisitMinutes: number;
  tags: string[];
}

export interface DestinationDefinition {
  slug: string;
  city: string;
  region: string;
  category: string;
  cities: string[];
  heroCategory: string;
  heroImage: string;
  tags: string[];
  estimatedVisitMinutes: number;
  bestSeason: string;
  coordinates: GeoPoint;
  nearbyPoints: DestinationNearbyPoint[];
}

export interface DestinationTextContent {
  name: string;
  kicker: string;
  summary: string;
  overview: string;
  longDescription: string;
  bestFor: string[];
  metrics: DestinationMetric[];
}

export interface DestinationConfig extends DestinationDefinition, DestinationTextContent {}

export interface DestinationSupportCard {
  title: string;
  description: string;
  meta: string;
  tags: string[];
}

export interface DestinationSupportData {
  stays: DestinationSupportCard[];
  guides: DestinationSupportCard[];
  food: DestinationSupportCard[];
  tours: DestinationSupportCard[];
}
