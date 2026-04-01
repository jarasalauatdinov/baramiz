import type { Place } from '../types/api';
import type { AdminPlaceRecord } from '../types/admin';

const ADMIN_PLACES_STORAGE_KEY = 'baramiz-admin-places';
const ADMIN_DELETED_STORAGE_KEY = 'baramiz-admin-deleted-place-ids';
const FALLBACK_PLACE_COORDINATES = {
  lat: 42.4602,
  lng: 59.6166,
} as const;

const isBrowser = typeof window !== 'undefined';

const dedupe = <T,>(items: T[]): T[] => Array.from(new Set(items));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readString = (value: unknown): string => (typeof value === 'string' ? value : '');
const readBoolean = (value: unknown): boolean => value === true;
const readNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const normalizeRecord = (value: unknown): AdminPlaceRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  if (!id) {
    return null;
  }

  const coordinates = isRecord(value.coordinates) ? value.coordinates : {};

  return {
    id,
    city: readString(value.city),
    region: readString(value.region),
    category: readString(value.category),
    image: readString(value.image),
    durationMinutes: readNumber(value.durationMinutes) ?? 60,
    featured: readBoolean(value.featured),
    coordinates: {
      lat: readNumber(coordinates.lat),
      lng: readNumber(coordinates.lng),
    },
    name_uz: readString(value.name_uz),
    description_uz: readString(value.description_uz),
    name_kaa: readString(value.name_kaa),
    description_kaa: readString(value.description_kaa),
    name_ru: readString(value.name_ru),
    description_ru: readString(value.description_ru),
    name_en: readString(value.name_en),
    description_en: readString(value.description_en),
    persistence: value.persistence === 'backend' ? 'backend' : 'local-demo',
    createdAt: readString(value.createdAt) || undefined,
    updatedAt: readString(value.updatedAt) || undefined,
  };
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredAdminPlaces = (): AdminPlaceRecord[] => {
  const raw = readJson<unknown[]>(ADMIN_PLACES_STORAGE_KEY, []);
  return raw.map(normalizeRecord).filter((item): item is AdminPlaceRecord => item !== null);
};

export const getStoredDeletedPlaceIds = (): string[] => {
  const raw = readJson<unknown[]>(ADMIN_DELETED_STORAGE_KEY, []);
  return raw.filter((item): item is string => typeof item === 'string');
};

export const saveStoredAdminPlaces = (places: AdminPlaceRecord[]) => {
  writeJson(ADMIN_PLACES_STORAGE_KEY, places);
};

export const saveStoredDeletedPlaceIds = (ids: string[]) => {
  writeJson(ADMIN_DELETED_STORAGE_KEY, dedupe(ids));
};

export const upsertStoredAdminPlace = (record: AdminPlaceRecord): AdminPlaceRecord => {
  const places = getStoredAdminPlaces();
  const nextPlaces = [...places.filter((item) => item.id !== record.id), record];
  saveStoredAdminPlaces(nextPlaces);
  saveStoredDeletedPlaceIds(getStoredDeletedPlaceIds().filter((id) => id !== record.id));
  return record;
};

export const removeStoredAdminPlace = (id: string, markDeleted = true) => {
  saveStoredAdminPlaces(getStoredAdminPlaces().filter((item) => item.id !== id));
  if (markDeleted) {
    saveStoredDeletedPlaceIds([...getStoredDeletedPlaceIds(), id]);
  }
};

const pickPrimaryText = (record: AdminPlaceRecord, field: 'name' | 'description'): string => {
  const suffixes = ['uz', 'kaa', 'ru', 'en'] as const;
  for (const suffix of suffixes) {
    const key = `${field}_${suffix}` as keyof AdminPlaceRecord;
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
};

const toPublicPlace = (record: AdminPlaceRecord): Place => ({
  id: record.id,
  name: pickPrimaryText(record, 'name') || 'Untitled place',
  description: pickPrimaryText(record, 'description') || '',
  category: record.category,
  city: record.city || '',
  region: record.region || '',
  imageUrl: record.image || '',
  featured: record.featured,
  coordinates: {
    lat: record.coordinates.lat ?? FALLBACK_PLACE_COORDINATES.lat,
    lng: record.coordinates.lng ?? FALLBACK_PLACE_COORDINATES.lng,
  },
  durationMinutes: record.durationMinutes,
});

export const mergeAdminPlacesIntoPublicPlaces = (places: Place[]): Place[] => {
  const storedPlaces = getStoredAdminPlaces();
  const deletedIds = new Set(getStoredDeletedPlaceIds());
  const map = new Map<string, Place>();

  places.forEach((place) => {
    const id = String(place.id);
    if (!deletedIds.has(id)) {
      map.set(id, place);
    }
  });

  storedPlaces.forEach((record) => {
    map.set(record.id, toPublicPlace(record));
  });

  return Array.from(map.values());
};

export const buildAdminRecordFromPlace = (place: Place): AdminPlaceRecord => ({
  id: String(place.id),
  city: place.city ?? '',
  region: place.region ?? '',
  category: String(place.category ?? ''),
  image: place.imageUrl ?? '',
  durationMinutes: place.durationMinutes ?? 60,
  featured: place.featured === true,
  coordinates: place.coordinates
    ? {
        lat: place.coordinates.lat,
        lng: place.coordinates.lng,
      }
    : {},
  name_uz: place.name,
  description_uz: place.description ?? '',
  name_kaa: '',
  description_kaa: '',
  name_ru: '',
  description_ru: '',
  name_en: '',
  description_en: '',
  persistence: 'backend',
});

export const getStoredAdminPlaceById = (id: string): AdminPlaceRecord | undefined =>
  getStoredAdminPlaces().find((item) => item.id === id);
