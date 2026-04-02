import type { BudgetLevel, TripStyle } from '../../route/model/planningTypes';

export interface HotelStay {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  location: string;
  shortDescription: string;
  description: string;
  priceFrom: number;
  currency: 'USD';
  rating: number;
  images: string[];
  amenities: string[];
  tags: string[];
  recommendedTripStyles: TripStyle[];
  recommendedBudgets: BudgetLevel[];
  nearbyKeywords: string[];
}

export interface HotelRecommendationContext {
  city: string;
  interests: string[];
  tripStyle: TripStyle;
  budgetLevel: BudgetLevel;
  stopNames: string[];
}
