import type {
  GeneratedRoute,
  GeneratedRouteItem,
  RouteGenerationInput,
} from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';
import { asRecord, readArray, readNumber, readString } from '../../../shared/lib/guards/record';
import { resolveAssetUrl } from '../../../utils/placeArtwork';

const normalizeRoute = (payload: unknown): GeneratedRoute => {
  const root = asRecord(payload);
  const content = asRecord(root.data ?? root.result ?? root.route ?? payload);

  const items: GeneratedRouteItem[] = readArray(content.items).map((rawItem, index) => {
    const item = asRecord(rawItem);
    const place = asRecord(item.place);

    return {
      time: readString(item.time) ?? `Stop ${index + 1}`,
      reason: readString(item.reason) ?? 'Recommended for this route.',
      estimatedDurationMinutes: readNumber(item.estimatedDurationMinutes) ?? 0,
      place: {
        id: String(place.id ?? place._id ?? `place-${index + 1}`),
        name: readString(place.name) ?? 'Recommended place',
        city: readString(place.city) ?? readString(content.city) ?? '',
        category: readString(place.category) ?? readString(place.categoryName) ?? 'Tourism',
        image: resolveAssetUrl(readString(place.image) ?? readString(place.imageUrl)) ?? '',
      },
    };
  });

  return {
    city: readString(content.city) ?? '',
    duration: (readString(content.duration) ?? '1_day') as RouteGenerationInput['duration'],
    language: (readString(content.language) ?? 'uz') as RouteGenerationInput['language'],
    totalMinutes: readNumber(content.totalMinutes) ?? 0,
    items,
  };
};

export const generateRoute = async (
  data: RouteGenerationInput,
): Promise<GeneratedRoute> => {
  const payload = await requestJson<unknown>('/routes/generate', {
    method: 'POST',
    body: data,
  });

  return normalizeRoute(payload);
};

