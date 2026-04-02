import type { GeoPoint } from '../../../shared/lib/map/geo';
import type { GeneratedRouteItem } from '../../../entities/route';
import type { Place } from '../../../entities/place';

export interface RouteStopViewModel {
  id: string;
  item: GeneratedRouteItem;
  place: Place | null;
  point: GeoPoint | null;
  name: string;
  city: string;
  category: string;
  image?: string;
  description: string;
  reason: string;
}