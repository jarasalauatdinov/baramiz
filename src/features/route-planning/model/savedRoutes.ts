import type { RoutePlanningResult } from './types';

const SAVED_ROUTES_STORAGE_KEY = 'baramiz:saved-routes';
const MAX_SAVED_ROUTES = 12;

export interface SavedRouteEntry {
  id: string;
  savedAt: string;
  city: string;
  stopCount: number;
  result: RoutePlanningResult;
}

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

const buildRouteFingerprint = (result: RoutePlanningResult): string => {
  const placeIds = result.route.items.map((item) => item.place.id).join('-');
  return `${result.route.city}:${result.request.tripStyle}:${result.request.interests.join(',')}:${placeIds}`;
};

export const getSavedRoutes = (): SavedRouteEntry[] => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(SAVED_ROUTES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedRouteEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read saved routes', error);
    return [];
  }
};

export const saveRouteForLater = (result: RoutePlanningResult): SavedRouteEntry => {
  const storage = getStorage();
  if (!storage) {
    throw new Error('Storage is not available');
  }

  const nextEntry: SavedRouteEntry = {
    id: buildRouteFingerprint(result),
    savedAt: new Date().toISOString(),
    city: result.route.city,
    stopCount: result.route.items.length,
    result,
  };

  const current = getSavedRoutes().filter((entry) => entry.id !== nextEntry.id);
  const next = [nextEntry, ...current].slice(0, MAX_SAVED_ROUTES);

  storage.setItem(SAVED_ROUTES_STORAGE_KEY, JSON.stringify(next));
  return nextEntry;
};
