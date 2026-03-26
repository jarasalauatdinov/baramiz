import { API_BASE_URL, getCategories, getPlaceById, getPlaces } from './api';
import {
  buildAdminCategoryFromCategory,
  getStoredAdminCategoryById,
  getStoredAdminCategories,
  getStoredDeletedCategoryIds,
  removeStoredAdminCategory,
  saveStoredDeletedCategoryIds,
  upsertStoredAdminCategory,
} from './adminCategoryStore';
import {
  buildAdminRecordFromPlace,
  getStoredDeletedPlaceIds,
  getStoredAdminPlaceById,
  getStoredAdminPlaces,
  removeStoredAdminPlace,
  saveStoredAdminPlaces,
  saveStoredDeletedPlaceIds,
} from './adminPlaceStore';
import type {
  AdminCategoryFormValues,
  AdminCategoryMutationResult,
  AdminCategoryRecord,
  AdminPersistenceMode,
  AdminPlaceFormValues,
  AdminPlaceMutationResult,
  AdminPlaceRecord,
  TranslationGenerationResult,
} from '../types/admin';

const ADMIN_FALLBACK_CATEGORY = 'history';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const readBoolean = (value: unknown): boolean => value === true;
const readNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;
const readArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value)) {
    if (Array.isArray(value.data)) {
      return value.data;
    }

    if (Array.isArray(value.items)) {
      return value.items;
    }
  }

  return [];
};

const readJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const payload = await readJson(response);

  if (isRecord(payload)) {
    const details = Array.isArray(payload.errors)
      ? payload.errors
          .map((issue) => {
            if (!isRecord(issue)) {
              return '';
            }

            const path = readString(issue.path);
            const message = readString(issue.message);
            return [path, message].filter(Boolean).join(': ');
          })
          .filter(Boolean)
      : [];

    const message = readString(payload.message) || readString(payload.error);
    if (details.length > 0) {
      return `${message || 'Request failed'} (${details.join(', ')})`;
    }

    if (message) {
      return message;
    }
  }

  return `Request failed (${response.status})`;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `place-${Date.now()}`;

const buildBackendPayload = (values: AdminPlaceFormValues, id?: string) => {
  const lat = values.latitude.trim();
  const lng = values.longitude.trim();

  return {
    ...(id ? { id } : {}),
    city: values.city.trim(),
    region: values.region.trim(),
    category: values.category.trim() || ADMIN_FALLBACK_CATEGORY,
    image: values.image.trim(),
    durationMinutes: Number(values.durationMinutes),
    featured: values.featured,
    coordinates: {
      lat: lat ? Number(lat) : undefined,
      lng: lng ? Number(lng) : undefined,
    },
    name_uz: values.name_uz.trim(),
    description_uz: values.description_uz.trim(),
    name_kaa: values.name_kaa.trim(),
    description_kaa: values.description_kaa.trim(),
    name_ru: values.name_ru.trim(),
    description_ru: values.description_ru.trim(),
    name_en: values.name_en.trim(),
    description_en: values.description_en.trim(),
  };
};

const normalizeAdminPlace = (payload: unknown, fallbackId?: string): AdminPlaceRecord | null => {
  const item = isRecord(payload)
    ? isRecord(payload.data)
      ? payload.data
      : isRecord(payload.place)
        ? payload.place
        : payload
    : null;

  if (!item) {
    return null;
  }

  const translations = isRecord(item.translations) ? item.translations : {};
  const uz = isRecord(translations.uz) ? translations.uz : {};
  const kaa = isRecord(translations.kaa) ? translations.kaa : {};
  const ru = isRecord(translations.ru) ? translations.ru : {};
  const en = isRecord(translations.en) ? translations.en : {};
  const coordinates = isRecord(item.coordinates) ? item.coordinates : {};

  const id = readString(item.id) || fallbackId || slugify(readString(item.name) || readString(item.name_uz));
  if (!id) {
    return null;
  }

  return {
    id,
    city: readString(item.city),
    region: readString(item.region),
    category: readString(item.category) || readString(item.categoryId) || ADMIN_FALLBACK_CATEGORY,
    image: readString(item.image) || readString(item.imageUrl),
    durationMinutes: readNumber(item.durationMinutes) ?? 60,
    featured: readBoolean(item.featured),
    coordinates: {
      lat: readNumber(coordinates.lat),
      lng: readNumber(coordinates.lng),
    },
    name_uz: readString(item.name_uz) || readString(uz.name) || readString(item.name),
    description_uz:
      readString(item.description_uz) || readString(uz.description) || readString(item.description),
    name_kaa: readString(item.name_kaa) || readString(kaa.name),
    description_kaa: readString(item.description_kaa) || readString(kaa.description),
    name_ru: readString(item.name_ru) || readString(ru.name),
    description_ru: readString(item.description_ru) || readString(ru.description),
    name_en: readString(item.name_en) || readString(en.name),
    description_en: readString(item.description_en) || readString(en.description),
    persistence: 'backend',
    createdAt: readString(item.createdAt) || undefined,
    updatedAt: readString(item.updatedAt) || undefined,
  };
};

const requestAdmin = async (path: string, init: RequestInit = {}): Promise<Response> => {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
};

const requestAdminJson = async (path: string, init: RequestInit = {}): Promise<unknown> => {
  const response = await requestAdmin(path, init);

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return null;
  }

  return readJson(response);
};

const clearStoredPlaceFallbackState = () => {
  saveStoredAdminPlaces([]);
  saveStoredDeletedPlaceIds([]);
};

const loadBackendAdminPlaces = async (): Promise<AdminPlaceRecord[]> => {
  const payload = await requestAdminJson('/admin/places');

  return readArray(payload)
    .map((item) => normalizeAdminPlace(item))
    .filter((item): item is AdminPlaceRecord => item !== null)
    .sort((left, right) => left.name_uz.localeCompare(right.name_uz));
};

const normalizeTranslationPayload = (payload: unknown): TranslationGenerationResult | null => {
  const root = isRecord(payload) ? payload : {};
  const content = isRecord(root.data) ? root.data : root;
  const ru = isRecord(content.ru) ? content.ru : {};
  const en = isRecord(content.en) ? content.en : {};

  const name_ru = readString(content.name_ru) || readString(ru.name);
  const description_ru = readString(content.description_ru) || readString(ru.description);
  const name_en = readString(content.name_en) || readString(en.name);
  const description_en = readString(content.description_en) || readString(en.description);

  if (!name_ru || !description_ru || !name_en || !description_en) {
    return null;
  }

  return {
    name_ru,
    description_ru,
    name_en,
    description_en,
    source: 'backend',
  };
};

export const getAdminPlaces = async (): Promise<AdminPlaceRecord[]> => {
  try {
    const backendPlaces = await loadBackendAdminPlaces();
    clearStoredPlaceFallbackState();
    return backendPlaces;
  } catch (error) {
    console.error('Failed to load backend admin places', error);
  }

  const [publicPlaces, storedPlaces] = await Promise.all([getPlaces(), Promise.resolve(getStoredAdminPlaces())]);
  const map = new Map<string, AdminPlaceRecord>();

  publicPlaces.forEach((place) => {
    const record = buildAdminRecordFromPlace(place);
    map.set(record.id, record);
  });

  storedPlaces.forEach((record) => {
    map.set(record.id, record);
  });

  return Array.from(map.values()).sort((left, right) => left.name_uz.localeCompare(right.name_uz));
};

export const getAdminPlace = async (id: string): Promise<AdminPlaceRecord | null> => {
  try {
    const payload = await requestAdminJson(`/admin/places/${id}`);
    const backendRecord = normalizeAdminPlace(payload, id);
    if (backendRecord) {
      removeStoredAdminPlace(id, false);
      return backendRecord;
    }
  } catch (error) {
    console.error('Failed to load backend admin place', id, error);
  }

  const stored = getStoredAdminPlaceById(id);
  if (stored) {
    return stored;
  }

  const place = await getPlaceById(id);
  return place ? buildAdminRecordFromPlace(place) : null;
};

export const createAdminPlace = async (
  values: AdminPlaceFormValues,
): Promise<AdminPlaceMutationResult> => {
  const nextId = slugify(values.name_uz || values.name_en || values.name_ru || values.name_kaa || String(Date.now()));
  const payload = buildBackendPayload(values, nextId);
  const payloadResponse = await requestAdminJson('/admin/places', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const backendRecord = normalizeAdminPlace(payloadResponse, nextId);

  if (!backendRecord) {
    throw new Error('The backend did not return the saved place.');
  }

  removeStoredAdminPlace(backendRecord.id, false);
  saveStoredDeletedPlaceIds(getStoredDeletedPlaceIds().filter((storedId) => storedId !== backendRecord.id));
  return { place: backendRecord, persistence: 'backend' };
};

export const updateAdminPlace = async (
  id: string,
  values: AdminPlaceFormValues,
): Promise<AdminPlaceMutationResult> => {
  const payload = buildBackendPayload(values, id);
  const payloadResponse = await requestAdminJson(`/admin/places/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const backendRecord = normalizeAdminPlace(payloadResponse, id);

  if (!backendRecord) {
    throw new Error('The backend did not return the updated place.');
  }

  removeStoredAdminPlace(id, false);
  saveStoredDeletedPlaceIds(getStoredDeletedPlaceIds().filter((storedId) => storedId !== id));
  return { place: backendRecord, persistence: 'backend' };
};

export const deleteAdminPlace = async (id: string): Promise<{ persistence: AdminPersistenceMode }> => {
  const response = await requestAdmin(`/admin/places/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  removeStoredAdminPlace(id, false);
  saveStoredDeletedPlaceIds(getStoredDeletedPlaceIds().filter((storedId) => storedId !== id));
  return { persistence: 'backend' };
};

const buildCategoryBackendPayload = (values: AdminCategoryFormValues, id?: string) => ({
  ...(id ? { id } : {}),
  name: values.name.trim(),
  description: values.description.trim(),
  image: values.image.trim(),
  imageUrl: values.image.trim(),
});

const buildLocalCategoryRecord = (
  values: AdminCategoryFormValues,
  id: string,
  persistence: AdminPersistenceMode = 'local-demo',
): AdminCategoryRecord => ({
  id,
  name: values.name.trim(),
  description: values.description.trim(),
  image: values.image.trim(),
  persistence,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const normalizeAdminCategory = (
  payload: unknown,
  fallbackId?: string,
): AdminCategoryRecord | null => {
  const item = isRecord(payload)
    ? isRecord(payload.data)
      ? payload.data
      : isRecord(payload.category)
        ? payload.category
        : payload
    : null;

  if (!item) {
    return null;
  }

  const id = readString(item.id) || fallbackId || slugify(readString(item.name));
  if (!id) {
    return null;
  }

  return {
    id,
    name: readString(item.name),
    description: readString(item.description),
    image: readString(item.image) || readString(item.imageUrl),
    persistence: 'backend',
    createdAt: readString(item.createdAt) || undefined,
    updatedAt: readString(item.updatedAt) || undefined,
  };
};

export const getAdminCategories = async (): Promise<AdminCategoryRecord[]> => {
  const [publicCategories, storedCategories] = await Promise.all([
    getCategories(),
    Promise.resolve(getStoredAdminCategories()),
  ]);
  const map = new Map<string, AdminCategoryRecord>();

  publicCategories.forEach((category) => {
    const record = buildAdminCategoryFromCategory(category);
    map.set(record.id, record);
  });

  storedCategories.forEach((record) => {
    map.set(record.id, record);
  });

  return Array.from(map.values()).sort((left, right) => left.name.localeCompare(right.name));
};

export const getAdminCategory = async (id: string): Promise<AdminCategoryRecord | null> => {
  const stored = getStoredAdminCategoryById(id);
  if (stored) {
    return stored;
  }

  const categories = await getCategories();
  const category = categories.find((item) => String(item.id) === id);
  return category ? buildAdminCategoryFromCategory(category) : null;
};

export const createAdminCategory = async (
  values: AdminCategoryFormValues,
): Promise<AdminCategoryMutationResult> => {
  const nextId = slugify(values.name || String(Date.now()));
  const payload = buildCategoryBackendPayload(values, nextId);

  for (const candidate of [
    { path: '/admin/categories', method: 'POST', body: payload },
    { path: '/categories', method: 'POST', body: payload },
  ]) {
    try {
      const response = await requestAdmin(candidate.path, {
        method: candidate.method,
        body: JSON.stringify(candidate.body),
      });

      if (!response.ok) {
        continue;
      }

      const normalizedCategory = normalizeAdminCategory(await readJson(response), nextId);
      if (normalizedCategory) {
        removeStoredAdminCategory(normalizedCategory.id, false);
        saveStoredDeletedCategoryIds(
          getStoredDeletedCategoryIds().filter((storedId) => storedId !== normalizedCategory.id),
        );
        return { category: normalizedCategory, persistence: 'backend' };
      }
    } catch (error) {
      console.error('Admin category create candidate failed', candidate.path, error);
    }
  }

  const localRecord = upsertStoredAdminCategory(buildLocalCategoryRecord(values, nextId));
  return { category: localRecord, persistence: 'local-demo' };
};

export const updateAdminCategory = async (
  id: string,
  values: AdminCategoryFormValues,
): Promise<AdminCategoryMutationResult> => {
  const payload = buildCategoryBackendPayload(values, id);

  for (const candidate of [
    { path: `/admin/categories/${id}`, method: 'PUT', body: payload },
    { path: `/categories/${id}`, method: 'PUT', body: payload },
  ]) {
    try {
      const response = await requestAdmin(candidate.path, {
        method: candidate.method,
        body: JSON.stringify(candidate.body),
      });

      if (!response.ok) {
        continue;
      }

      const normalizedCategory = normalizeAdminCategory(await readJson(response), id);
      if (normalizedCategory) {
        removeStoredAdminCategory(id, false);
        saveStoredDeletedCategoryIds(getStoredDeletedCategoryIds().filter((storedId) => storedId !== id));
        return { category: normalizedCategory, persistence: 'backend' };
      }
    } catch (error) {
      console.error('Admin category write candidate failed', candidate.path, error);
    }
  }

  const localRecord = upsertStoredAdminCategory(buildLocalCategoryRecord(values, id));
  return { category: localRecord, persistence: 'local-demo' };
};

export const deleteAdminCategory = async (
  id: string,
): Promise<{ persistence: AdminPersistenceMode }> => {
  for (const candidate of [`/admin/categories/${id}`, `/categories/${id}`]) {
    try {
      const response = await requestAdmin(candidate, { method: 'DELETE' });
      if (response.ok) {
        removeStoredAdminCategory(id, false);
        saveStoredDeletedCategoryIds(getStoredDeletedCategoryIds().filter((storedId) => storedId !== id));
        return { persistence: 'backend' };
      }
    } catch (error) {
      console.error('Admin category delete candidate failed', candidate, error);
    }
  }

  removeStoredAdminCategory(id, true);
  return { persistence: 'local-demo' };
};

export const generateRuEnFromUz = async (
  nameUz: string,
  descriptionUz: string,
): Promise<TranslationGenerationResult> => {
  const response = await requestAdmin('/admin/translate', {
    method: 'POST',
    body: JSON.stringify({
      name_uz: nameUz,
      description_uz: descriptionUz,
    }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const payload = await readJson(response);
  const translation = normalizeTranslationPayload(payload);

  if (!translation) {
    throw new Error('The backend did not return RU and EN translations.');
  }

  return translation;
};
