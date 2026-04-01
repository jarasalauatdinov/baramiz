import type { TFunction } from 'i18next';
import { guideProfiles } from '../../../entities/guide/model/guideDirectory';
import type { GuideProfile } from '../../../entities/guide/model/types';
import { serviceCatalog } from '../../../entities/service/model/catalog';
import type { ServiceCatalogEntry } from '../../../entities/service/model/types';
import {
  getBudgetLevelLabel,
  getDurationLabel,
  getTransportPreferenceLabel,
  getTravelPaceLabel,
  getTripStyleLabel,
} from './options';
import type { RoutePlanningRequest } from './types';
import type { GeneratedRoute } from '../../../types/api';
import { formatCategoryLabel } from '../../../utils/placeArtwork';

export interface RouteOverviewContent {
  title: string;
  description: string;
  highlights: string[];
}

export interface RouteTravelTip {
  id: string;
  title: string;
  description: string;
}

export interface RouteSupportRecommendations {
  services: ServiceCatalogEntry[];
  guides: GuideProfile[];
}

const parseTimeToMinutes = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
};

const formatClock = (minutes: number): string => {
  const safeMinutes = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (safeMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));

const buildRouteCities = (route: GeneratedRoute): string[] =>
  unique([route.city, ...route.items.map((item) => item.place.city).filter(Boolean)]);

const hasAnyKeyword = (value: string, keywords: string[]): boolean => {
  const normalized = value.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
};

export const buildRouteOverviewContent = (
  request: RoutePlanningRequest,
  route: GeneratedRoute,
  t: TFunction,
): RouteOverviewContent => {
  const interestLabels = request.interests.map((interest) => formatCategoryLabel(interest, t));
  const leadInterest = interestLabels[0] ?? t('common.tourism', { defaultValue: 'tourism' });
  const tripStyleLabel = getTripStyleLabel(request.tripStyle, t);
  const transportLabel = getTransportPreferenceLabel(request.transportPreference, t);
  const budgetLabel = getBudgetLevelLabel(request.budgetLevel, t);
  const paceLabel = getTravelPaceLabel(request.travelPace, t);
  const durationLabel = getDurationLabel(request.duration, t);

  const lastStop = route.items[route.items.length - 1];
  const fallbackStartTime = parseTimeToMinutes(route.items[0]?.time);
  const fallbackEndStartTime = parseTimeToMinutes(lastStop?.time);
  const firstStopTime =
    parseTimeToMinutes(route.summary.estimatedStartTime) ?? fallbackStartTime;
  const lastStopTime =
    parseTimeToMinutes(route.summary.estimatedEndTime) ??
    (fallbackEndStartTime !== null && lastStop
      ? fallbackEndStartTime + lastStop.estimatedDurationMinutes
      : null);
  const estimatedFinish = lastStopTime !== null ? formatClock(lastStopTime) : null;

  return {
    title: t('routeResult.summary.dynamicTitle', {
      defaultValue: '{{interest}} route for {{city}}',
      interest: leadInterest,
      city: route.city,
    }),
    description: t('routeResult.summary.dynamicDescription', {
      defaultValue:
        'Built for {{interest}} with {{style}} style, {{transport}} movement, and a {{budget}} budget tone.',
      interest: leadInterest,
      style: tripStyleLabel,
      transport: transportLabel,
      budget: budgetLabel.toLowerCase(),
    }),
    highlights: [
      t('routeResult.summary.highlightStops', {
        defaultValue: '{{count}} stops in one route.',
        count: route.items.length,
      }),
      t('routeResult.summary.highlightTiming', {
        defaultValue:
          firstStopTime !== null && estimatedFinish
          ? 'Best experienced from around {{start}} to {{finish}}.'
            : 'Planned for a {{duration}} window with {{pace}} pace.',
        start: firstStopTime !== null ? formatClock(firstStopTime) : durationLabel,
        finish: estimatedFinish ?? durationLabel,
        duration: durationLabel,
        pace: paceLabel.toLowerCase(),
      }),
      t('routeResult.summary.highlightFlow', {
        defaultValue: 'Sequence is practical and easy to follow.',
      }),
    ],
  };
};

export const buildRouteTravelTips = (
  request: RoutePlanningRequest,
  route: GeneratedRoute,
  t: TFunction,
): RouteTravelTip[] => {
  const tips: RouteTravelTip[] = [];

  tips.push({
    id: 'movement',
    title: t('routeResult.tips.movement.title', { defaultValue: 'Move through the route smoothly' }),
    description:
      request.transportPreference === 'walking'
        ? t('routeResult.tips.movement.walking', {
            defaultValue:
              'Keep comfortable shoes and water with you. This route leans toward shorter city movement and easier stop transitions.',
          })
        : request.transportPreference === 'driver'
          ? t('routeResult.tips.movement.driver', {
              defaultValue:
                'Confirm pickup points and stop order before departure so the day feels coordinated from the first stop.',
            })
          : t('routeResult.tips.movement.car', {
              defaultValue:
                'Check parking and road timing between major stops so the route stays practical during the busiest part of the day.',
            }),
  });

  tips.push({
    id: 'pace',
    title: t('routeResult.tips.pace.title', { defaultValue: 'Match the day to your pace' }),
    description:
      request.travelPace === 'easy'
        ? t('routeResult.tips.pace.easy', {
            defaultValue:
              'Leave room for photos, tea, and spontaneous pauses. The route works best when you do not rush every stop.',
          })
        : request.travelPace === 'full'
          ? t('routeResult.tips.pace.full', {
              defaultValue:
                'Start on time and keep stop transitions tight so the route can cover more without feeling chaotic.',
            })
          : t('routeResult.tips.pace.steady', {
              defaultValue:
                'A steady rhythm usually works best here: enough time to explore, but not so much that the route loses momentum.',
            }),
  });

  const cultureFocused = request.interests.some((interest) =>
    ['history', 'culture', 'museum', 'museums'].includes(interest.toLowerCase()),
  );

  tips.push({
    id: 'experience',
    title: t('routeResult.tips.experience.title', { defaultValue: 'Make the route feel local' }),
    description: cultureFocused
      ? t('routeResult.tips.experience.culture', {
          defaultValue:
            'Museum and heritage stops are stronger when you leave time for context, not only photos. Consider adding a guide or ticket support where needed.',
        })
      : t('routeResult.tips.experience.general', {
          defaultValue:
            'Use one food or service stop between landmarks so the route feels like a real travel day instead of a checklist.',
        }),
  });

  if (route.items.length >= 5) {
    tips.push({
      id: 'density',
      title: t('routeResult.tips.density.title', { defaultValue: 'Keep route density realistic' }),
      description: t('routeResult.tips.density.description', {
        defaultValue:
          'This plan covers several stops. If time shifts during the day, keep the strongest first stops and treat later ones as flexible.',
      }),
    });
  }

  return tips;
};

export const getRouteSupportRecommendations = (
  request: RoutePlanningRequest,
  route: GeneratedRoute,
): RouteSupportRecommendations => {
  const services = serviceCatalog;
  const routeCities = buildRouteCities(route);
  const routeKeywords = unique([
    ...request.interests,
    request.tripStyle,
    ...route.items.map((item) => item.place.category),
  ]);

  const scoredServices = services
    .map((service) => {
      let score = 0;
      const coverage = service.availableCities ?? (service.city ? [service.city] : []);
      const serviceText = `${service.title} ${service.description} ${service.tags.join(' ')} ${service.note ?? ''}`;

      if (coverage.some((city) => routeCities.includes(city))) {
        score += 5;
      }
      if (service.city && service.city === route.city) {
        score += 2;
      }
      if (request.transportPreference !== 'walking' && service.kind === 'transport') {
        score += 4;
      }
      if (request.tripStyle === 'family' && ['accommodation', 'tour_support', 'food'].includes(service.kind)) {
        score += 3;
      }
      if (request.budgetLevel === 'premium' && ['accommodation', 'agencies'].includes(service.kind)) {
        score += 2;
      }
      if (request.budgetLevel === 'light' && ['food', 'tickets', 'transport'].includes(service.kind)) {
        score += 2;
      }
      if (route.items.length >= 4 && ['food', 'transport', 'tour_support'].includes(service.kind)) {
        score += 2;
      }
      if (routeKeywords.some((keyword) => hasAnyKeyword(serviceText, [keyword]))) {
        score += 2;
      }

      return { service, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => entry.service);

  const languageCode = request.language.toUpperCase();
  const scoredGuides = guideProfiles
    .map((guide) => {
      let score = 0;
      const guideText = `${guide.specialties.join(' ')} ${guide.regionExpertise.join(' ')} ${guide.shortBio}`;

      if (guide.availableCities.some((city) => routeCities.includes(city))) {
        score += 5;
      }
      if (guide.city === route.city) {
        score += 2;
      }
      if (guide.languages.includes(languageCode)) {
        score += 2;
      }
      if (routeKeywords.some((keyword) => hasAnyKeyword(guideText, [keyword]))) {
        score += 2;
      }
      if (request.tripStyle === 'family' && hasAnyKeyword(guideText, ['family', 'guest'])) {
        score += 2;
      }
      if (request.tripStyle === 'culture' && hasAnyKeyword(guideText, ['museum', 'art', 'heritage', 'culture'])) {
        score += 2;
      }

      return { guide, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2)
    .map((entry) => entry.guide);

  return {
    services: scoredServices,
    guides: scoredGuides,
  };
};

