import type { RoutePlanningResult } from '../../route/model/planningTypes';
import { hotelCatalog } from '../model/catalog';
import type { HotelRecommendationContext, HotelStay } from '../model/types';

const normalize = (value: string | undefined | null): string =>
  (value ?? '').trim().toLowerCase();

const includesNormalized = (value: string | undefined, expected: string): boolean =>
  normalize(value).includes(expected);

const buildContext = (result: RoutePlanningResult): HotelRecommendationContext => ({
  city: result.route.city,
  interests: result.request.interests,
  tripStyle: result.request.tripStyle,
  budgetLevel: result.request.budgetLevel,
  stopNames: result.route.items.map((item) => item.place.name),
});

const scoreHotel = (hotel: HotelStay, context: HotelRecommendationContext): number => {
  const normalizedCity = normalize(context.city);
  const stopCorpus = context.stopNames.map(normalize);
  const interests = context.interests.map(normalize);

  let score = 0;

  if (normalize(hotel.city) === normalizedCity) {
    score += 42;
  } else if (includesNormalized(hotel.location, normalizedCity)) {
    score += 30;
  }

  if (hotel.recommendedBudgets.includes(context.budgetLevel)) {
    score += 14;
  }

  if (hotel.recommendedTripStyles.includes(context.tripStyle)) {
    score += 10;
  }

  score += hotel.nearbyKeywords.reduce((total, keyword) => {
    const normalizedKeyword = normalize(keyword);

    if (interests.some((interest) => interest.includes(normalizedKeyword) || normalizedKeyword.includes(interest))) {
      return total + 4;
    }

    if (stopCorpus.some((stopName) => stopName.includes(normalizedKeyword))) {
      return total + 3;
    }

    return total;
  }, 0);

  return score;
};

export const getHotels = (): HotelStay[] => hotelCatalog;

export const getHotelBySlug = (slug: string): HotelStay | null =>
  hotelCatalog.find((hotel) => hotel.slug === slug) ?? null;

export const getRecommendedHotelsForRoute = (
  result: RoutePlanningResult,
  limit = 4,
): HotelStay[] => {
  const context = buildContext(result);

  return [...hotelCatalog]
    .map((hotel) => ({ hotel, score: scoreHotel(hotel, context) }))
    .sort((left, right) => right.score - left.score || right.hotel.rating - left.hotel.rating)
    .slice(0, limit)
    .map((entry) => entry.hotel);
};
