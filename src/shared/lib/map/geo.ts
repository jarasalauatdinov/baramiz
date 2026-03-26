import type { Place } from '../../../types/api';

export interface GeoPoint {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number): number => (value * Math.PI) / 180;

export const isValidGeoPoint = (value: GeoPoint | null | undefined): value is GeoPoint =>
  Boolean(
    value &&
      Number.isFinite(value.lat) &&
      Number.isFinite(value.lng) &&
      value.lat <= 90 &&
      value.lat >= -90 &&
      value.lng <= 180 &&
      value.lng >= -180,
  );

export const getPlaceGeoPoint = (place: Place): GeoPoint | null => {
  const lat = place.coordinates?.lat;
  const lng = place.coordinates?.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  const point: GeoPoint = { lat, lng };
  return isValidGeoPoint(point) ? point : null;
};

export const haversineDistanceKm = (start: GeoPoint, end: GeoPoint): number => {
  const deltaLat = toRadians(end.lat - start.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const latStart = toRadians(start.lat);
  const latEnd = toRadians(end.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latStart) *
      Math.cos(latEnd) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export const calculateRouteDistanceKm = (points: GeoPoint[]): number => {
  if (points.length < 2) {
    return 0;
  }

  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += haversineDistanceKm(points[index - 1], points[index]);
  }

  return total;
};

export const estimateTravelMinutes = (
  distanceKm: number,
  averageSpeedKmh = 38,
): number => {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return 0;
  }

  const hours = distanceKm / averageSpeedKmh;
  return Math.round(hours * 60);
};

const toGoogleQuery = (point: GeoPoint): string => `${point.lat},${point.lng}`;
const toYandexQuery = (point: GeoPoint): string => `${point.lng},${point.lat}`;

export const buildGoogleMapsPlaceUrl = (point: GeoPoint): string =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(toGoogleQuery(point))}`;

export const buildYandexMapsPlaceUrl = (point: GeoPoint): string =>
  `https://yandex.com/maps/?pt=${encodeURIComponent(toYandexQuery(point))}&z=14`;

export const buildGoogleMapsDirectionsUrl = (points: GeoPoint[]): string | null => {
  if (points.length < 2) {
    return null;
  }

  const origin = toGoogleQuery(points[0]);
  const destination = toGoogleQuery(points[points.length - 1]);
  const waypoints = points.slice(1, -1).map(toGoogleQuery).join('|');
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}`;

  return waypoints.length > 0
    ? `${base}&waypoints=${encodeURIComponent(waypoints)}`
    : base;
};

export const buildYandexMapsDirectionsUrl = (points: GeoPoint[]): string | null => {
  if (points.length < 2) {
    return null;
  }

  const ordered = points.map(toYandexQuery).join('~');
  return `https://yandex.com/maps/?mode=routes&rtext=${encodeURIComponent(
    ordered,
  )}&rtt=auto`;
};
