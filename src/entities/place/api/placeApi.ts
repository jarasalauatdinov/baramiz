import type { Id, Place } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';
import { asRecord, readArray, readNumber, readString } from '../../../shared/lib/guards/record';
import { resolveAssetUrl } from '../../../utils/placeArtwork';

export interface GetPlacesOptions {
  category?: string;
  city?: string;
  featured?: boolean;
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const readLocalizedText = (
  item: Record<string, unknown>,
  key: 'name' | 'description',
): string | undefined => {
  const translations = asRecord(item.translations);
  const uz = asRecord(translations.uz);
  const kaa = asRecord(translations.kaa);
  const ru = asRecord(translations.ru);
  const en = asRecord(translations.en);

  return (
    readString(item[key]) ??
    readString(item[`${key}_uz`]) ??
    readString(item[`${key}_kaa`]) ??
    readString(item[`${key}_ru`]) ??
    readString(item[`${key}_en`]) ??
    readString(uz[key]) ??
    readString(kaa[key]) ??
    readString(ru[key]) ??
    readString(en[key])
  );
};

const readCategory = (item: Record<string, unknown>): { id?: Id; name?: string } => {
  const categoryData = asRecord(item.categoryData);
  const category = asRecord(item.category);

  return {
    id: (item.categoryId ?? item.category_id ?? item.category ?? category.id ?? categoryData.id) as
      | Id
      | undefined,
    name:
      readString(item.categoryName) ??
      readString(item.category) ??
      readString(category.name) ??
      readString(categoryData.name),
  };
};

const readCoordinates = (
  item: Record<string, unknown>,
): Place['coordinates'] => {
  const coordinates = asRecord(item.coordinates);
  const geo = asRecord(item.geo);
  const location = asRecord(item.location);
  const geometry = asRecord(item.geometry);
  const geometryCoordinates = Array.isArray(geometry.coordinates)
    ? geometry.coordinates
    : [];

  const lat =
    toNumber(coordinates.lat) ??
    toNumber(coordinates.latitude) ??
    toNumber(geo.lat) ??
    toNumber(geo.latitude) ??
    toNumber(location.lat) ??
    toNumber(location.latitude) ??
    toNumber(item.lat) ??
    toNumber(item.latitude) ??
    (geometryCoordinates.length >= 2 ? toNumber(geometryCoordinates[1]) : undefined);

  const lng =
    toNumber(coordinates.lng) ??
    toNumber(coordinates.lon) ??
    toNumber(coordinates.longitude) ??
    toNumber(geo.lng) ??
    toNumber(geo.lon) ??
    toNumber(geo.longitude) ??
    toNumber(location.lng) ??
    toNumber(location.lon) ??
    toNumber(location.longitude) ??
    toNumber(item.lng) ??
    toNumber(item.lon) ??
    toNumber(item.longitude) ??
    (geometryCoordinates.length >= 1 ? toNumber(geometryCoordinates[0]) : undefined);

  return {
    lat,
    lng,
  };
};

const normalizePlace = (value: unknown): Place => {
  const item = asRecord(value);
  const fallbackId = readLocalizedText(item, 'name') ?? 'place';
  const category = readCategory(item);

  return {
    id: (item.id ?? item._id ?? item.slug ?? fallbackId) as Id,
    name: readLocalizedText(item, 'name') ?? 'Unnamed place',
    description: readLocalizedText(item, 'description'),
    categoryId: category.id,
    categoryName: category.name,
    city: readString(item.city) ?? readString(item.location),
    region: readString(item.region),
    imageUrl: resolveAssetUrl(
      readString(item.imageUrl) ?? readString(item.image) ?? readString(item.thumbnail),
    ),
    coordinates: readCoordinates(item),
    rating: readNumber(item.rating),
    featured: item.featured === true || readString(item.featured)?.toLowerCase() === 'true',
    durationMinutes: readNumber(item.durationMinutes),
  };
};

export const getPlaces = async (options: GetPlacesOptions = {}): Promise<Place[]> => {
  const payload = await requestJson<unknown>('/places', {
    query: {
      city: options.city,
      category: options.category,
      featured: options.featured,
    },
  });

  return readArray(payload).map(normalizePlace);
};

export const getPlaceById = async (id: string): Promise<Place | null> => {
  try {
    const payload = await requestJson<unknown>(`/places/${id}`);
    return normalizePlace(payload);
  } catch (error) {
    if (error instanceof Error && /404/.test(error.message)) {
      return null;
    }

    throw error;
  }
};

export const getFeaturedPlaces = async (limit = 4): Promise<Place[]> => {
  const featuredPlaces = await getPlaces({ featured: true });
  if (featuredPlaces.length >= limit) {
    return featuredPlaces.slice(0, limit);
  }

  if (featuredPlaces.length > 0) {
    const places = await getPlaces();
    return [...featuredPlaces, ...places].slice(0, limit);
  }

  const places = await getPlaces();
  return places.slice(0, limit);
};
