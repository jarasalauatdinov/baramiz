import type { TFunction } from 'i18next';
import type { Place } from '../../../entities/place';
import type { RoutePlanningResult } from '../../../features/route-planning/model/types';
import {
  buildRouteOverviewContent,
  buildRouteTravelTips,
  getRouteSupportRecommendations,
} from '../../../features/route-planning/model/resultExperience';
import { getRouteResultAssistantPrompts } from '../../../features/travel-assistant/model/promptSuggestions';
import { getPlaceGeoPoint, type GeoPoint } from '../../../shared/lib/map/geo';
import type { RouteStopViewModel } from './types';

interface ComposeRouteResultScreenDataParams {
  state: RoutePlanningResult;
  allPlaces: Place[];
  selectedStopIndex: number;
  t: TFunction;
}

export interface RouteResultScreenData {
  stopModels: RouteStopViewModel[];
  selectedStop: RouteStopViewModel | null;
  routePoints: GeoPoint[];
  mapCenter: GeoPoint | null;
  mapZoom: number;
  routeOverview: ReturnType<typeof buildRouteOverviewContent>;
  travelTips: ReturnType<typeof buildRouteTravelTips>;
  supportRecommendations: ReturnType<typeof getRouteSupportRecommendations>;
  assistantPrompts: string[];
  visibleInterests: string[];
  hiddenInterestCount: number;
}

export const buildRouteStopModels = (
  state: RoutePlanningResult,
  allPlaces: Place[],
): RouteStopViewModel[] =>
  state.route.items.map((item) => {
    const placeId = String(item.place.id);
    const normalizedName = item.place.name.toLowerCase();
    const normalizedCity = item.place.city.toLowerCase();

    const matched =
      allPlaces.find((place) => String(place.id) === placeId) ??
      allPlaces.find(
        (place) =>
          place.name.toLowerCase() === normalizedName &&
          (place.city ?? '').toLowerCase() === normalizedCity,
      ) ??
      null;

    return {
      id: placeId,
      item,
      place: matched,
      point: matched ? getPlaceGeoPoint(matched) : null,
      name: item.place.name,
      city: item.place.city,
      category: item.place.category,
      image: item.place.imageUrl || matched?.imageUrl,
      description: matched?.description ?? item.reason,
      reason: item.reason,
    };
  });

export const composeRouteResultScreenData = ({
  state,
  allPlaces,
  selectedStopIndex,
  t,
}: ComposeRouteResultScreenDataParams): RouteResultScreenData => {
  const stopModels = buildRouteStopModels(state, allPlaces);
  const selectedStop = stopModels[selectedStopIndex] ?? null;
  const routePoints = stopModels
    .map((stop) => stop.point)
    .filter((point): point is GeoPoint => Boolean(point));

  return {
    stopModels,
    selectedStop,
    routePoints,
    mapCenter: selectedStop?.point ?? routePoints[0] ?? null,
    mapZoom: selectedStop?.point ? 11 : 9,
    routeOverview: buildRouteOverviewContent(state.request, state.route, t),
    travelTips: buildRouteTravelTips(state.request, state.route, t),
    supportRecommendations: getRouteSupportRecommendations(state.request, state.route),
    assistantPrompts: getRouteResultAssistantPrompts(t, {
      city: state.route.city,
      stopName: selectedStop?.name,
      interest: state.request.interests[0],
    }),
    visibleInterests: state.request.interests.slice(0, 2),
    hiddenInterestCount: Math.max(state.request.interests.length - 2, 0),
  };
};
