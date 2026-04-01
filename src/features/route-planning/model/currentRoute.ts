import type { RoutePlanningResult } from './types';

const CURRENT_ROUTE_STORAGE_KEY = 'baramiz:current-route';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
};

export const getCurrentRouteResult = (): RoutePlanningResult | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(CURRENT_ROUTE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as RoutePlanningResult;
  } catch (error) {
    console.error('Failed to read current route result', error);
    return null;
  }
};

export const setCurrentRouteResult = (result: RoutePlanningResult): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(CURRENT_ROUTE_STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.error('Failed to store current route result', error);
  }
};

export const clearCurrentRouteResult = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(CURRENT_ROUTE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear current route result', error);
  }
};
