import type { TFunction } from 'i18next';
import { getPlaces } from '../../../entities/place/api/placeApi';
import { generateRoute } from '../../../entities/route/api/routeApi';
import {
  budgetReasonTranslationKeys,
  defaultDurationByPace,
  defaultStopDurationByPace,
  routeDurationMinutes,
  routeStartMinutesByDuration,
  travelPaceStopAdjustments,
  tripStyleCategoryKeywords,
} from '../../../entities/route/model/planningCatalog';
import type {
  GeneratedRoute,
  GeneratedRouteItem,
  Place,
  RouteDuration,
} from '../../../types/api';
import { resolveAssetUrl } from '../../../utils/placeArtwork';
import type { RoutePlanningRequest, RoutePlanningResult } from './types';

interface PlannerDeps {
  t: TFunction;
}

const normalizeCategory = (place: Place): string =>
  place.category.toLowerCase();

const resolveDuration = (request: RoutePlanningRequest): RouteDuration => {
  if (request.duration) {
    return request.duration;
  }

  if (request.travelPace) {
    return defaultDurationByPace[request.travelPace];
  }

  return 'half_day';
};

const pickStopCount = (duration: RouteDuration, request: RoutePlanningRequest): number => {
  const base = duration === '3_hours' ? 3 : duration === 'half_day' ? 4 : 5;
  const adjusted = base + (request.travelPace ? travelPaceStopAdjustments[request.travelPace] : 0);
  return Math.max(3, Math.min(6, adjusted));
};

const buildTimeSlots = (duration: RouteDuration, count: number): string[] => {
  const startMinutes = routeStartMinutesByDuration[duration];
  const totalMinutes = routeDurationMinutes[duration];
  const interval = Math.max(45, Math.floor(totalMinutes / count));

  return Array.from({ length: count }).map((_, index) => {
    const current = startMinutes + interval * index;
    const hours = Math.floor(current / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (current % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });
};

const parseClockToMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map((part) => Number(part));
  return hours * 60 + minutes;
};

const formatClock = (minutes: number): string => {
  const safeMinutes = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (safeMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const scorePlace = (place: Place, request: RoutePlanningRequest): number => {
  const category = normalizeCategory(place);
  const interestMatches = request.interests.filter((interest) => category.includes(interest.toLowerCase())).length;
  const styleMatches = tripStyleCategoryKeywords[request.tripStyle].filter((keyword) => category.includes(keyword)).length;
  const featuredBonus = place.featured ? 2 : 0;
  const walkingBonus = request.transportPreference === 'walking' && (place.durationMinutes ?? 90) <= 90 ? 1 : 0;
  const familyBonus = request.tripStyle === 'family' && (place.durationMinutes ?? 90) <= 75 ? 1 : 0;
  const premiumBonus = request.budgetLevel === 'premium' && place.featured ? 1 : 0;

  return interestMatches * 4 + styleMatches * 2 + featuredBonus + walkingBonus + familyBonus + premiumBonus;
};

const buildReason = (place: Place, request: RoutePlanningRequest, t: TFunction): string => {
  const category = place.category || t('common.tourism', { defaultValue: 'tourism' });
  const firstInterest = request.interests[0] ?? category;
  const budgetNote = t(budgetReasonTranslationKeys[request.budgetLevel], {
    defaultValue:
      request.budgetLevel === 'light'
        ? 'It keeps the plan practical and accessible.'
        : request.budgetLevel === 'premium'
          ? 'It adds a stronger flagship stop to the route.'
          : 'It keeps the route balanced and comfortable.',
  });

  return t('routeGenerator.mock.reasonTemplate', {
    defaultValue:
      '{{name}} fits a {{interest}}-led route, matches the {{style}} style, and works well for {{transport}} travel. {{budgetNote}}',
    name: place.name,
    interest: firstInterest,
    style: request.tripStyle,
    transport: request.transportPreference,
    budgetNote,
  });
};

const buildMockRoute = async (
  request: RoutePlanningRequest,
  deps: PlannerDeps,
): Promise<GeneratedRoute> => {
  const duration = resolveDuration(request);
  const places = await getPlaces({ city: request.city });
  const candidatePlaces = (places.length > 0 ? places : await getPlaces())
    .map((place) => ({ place, score: scorePlace(place, request) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, pickStopCount(duration, request))
    .map((entry) => entry.place);

  if (candidatePlaces.length === 0) {
    throw new Error('No places available for route generation');
  }

  const timeSlots = buildTimeSlots(duration, candidatePlaces.length);
  const items: GeneratedRouteItem[] = candidatePlaces.map((place, index) => ({
    time: timeSlots[index] ?? `Stop ${index + 1}`,
    reason: buildReason(place, request, deps.t),
    estimatedDurationMinutes:
      place.durationMinutes ??
      (request.travelPace ? defaultStopDurationByPace[request.travelPace] : defaultStopDurationByPace.steady),
    place: {
      id: String(place.id),
      name: place.name,
      city: place.city || request.city,
      category: place.category || deps.t('common.tourism', { defaultValue: 'Tourism' }),
      imageUrl: resolveAssetUrl(place.imageUrl) ?? '',
      coordinates: place.coordinates,
      description: place.description,
    },
  }));

  return {
    city: request.city,
    duration,
    language: request.language,
    totalMinutes: items.reduce((sum, item) => sum + item.estimatedDurationMinutes, 0),
    items,
    summary: {
      stopCount: items.length,
      estimatedStartTime: items[0]?.time ?? '09:00',
      estimatedEndTime: items.length
        ? formatClock(
            parseClockToMinutes(items[items.length - 1].time) +
              items[items.length - 1].estimatedDurationMinutes,
          )
        : '09:00',
      usedDuration: duration,
      interests: request.interests,
      tripStyle: request.tripStyle,
      transportPreference: request.transportPreference,
      budgetLevel: request.budgetLevel,
      travelPace: request.travelPace ?? undefined,
    },
  };
};

export const createRoutePlanningResult = async (
  request: RoutePlanningRequest,
  deps: PlannerDeps,
): Promise<RoutePlanningResult> => {
  const effectiveDuration = resolveDuration(request);

  try {
    const backendRoute = await generateRoute({
      city: request.city,
      interests: request.interests,
      language: request.language,
      duration: effectiveDuration,
      tripStyle: request.tripStyle,
      transportPreference: request.transportPreference,
      budgetLevel: request.budgetLevel,
      travelPace: request.travelPace ?? undefined,
    });

    if (backendRoute.items.length > 0) {
      return {
        route: backendRoute,
        request: {
          ...request,
          duration: request.duration ?? effectiveDuration,
        },
        source: 'backend',
      };
    }
  } catch (error) {
    console.error('Backend route generation failed, using local planner fallback', error);
  }

  const mockRoute = await buildMockRoute(
    {
      ...request,
      duration: request.duration ?? effectiveDuration,
    },
    deps,
  );

  return {
    route: mockRoute,
    request: {
      ...request,
      duration: request.duration ?? effectiveDuration,
    },
    source: 'mock',
  };
};

