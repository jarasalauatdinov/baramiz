import type { Category } from '../types/api';
import type { AdminCategoryRecord } from '../types/admin';

const ADMIN_CATEGORIES_STORAGE_KEY = 'baramiz-admin-categories';
const ADMIN_DELETED_CATEGORIES_STORAGE_KEY = 'baramiz-admin-deleted-category-ids';

const isBrowser = typeof window !== 'undefined';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readString = (value: unknown): string => (typeof value === 'string' ? value : '');

const dedupe = <T,>(items: T[]): T[] => Array.from(new Set(items));

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

const normalizeRecord = (value: unknown): AdminCategoryRecord | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value.id);
  if (!id) {
    return null;
  }

  return {
    id,
    name: readString(value.name),
    description: readString(value.description),
    image: readString(value.image),
    persistence: value.persistence === 'backend' ? 'backend' : 'local-demo',
    createdAt: readString(value.createdAt) || undefined,
    updatedAt: readString(value.updatedAt) || undefined,
  };
};

export const getStoredAdminCategories = (): AdminCategoryRecord[] => {
  const raw = readJson<unknown[]>(ADMIN_CATEGORIES_STORAGE_KEY, []);
  return raw.map(normalizeRecord).filter((item): item is AdminCategoryRecord => item !== null);
};

export const getStoredDeletedCategoryIds = (): string[] => {
  const raw = readJson<unknown[]>(ADMIN_DELETED_CATEGORIES_STORAGE_KEY, []);
  return raw.filter((item): item is string => typeof item === 'string');
};

export const saveStoredAdminCategories = (categories: AdminCategoryRecord[]) => {
  writeJson(ADMIN_CATEGORIES_STORAGE_KEY, categories);
};

export const saveStoredDeletedCategoryIds = (ids: string[]) => {
  writeJson(ADMIN_DELETED_CATEGORIES_STORAGE_KEY, dedupe(ids));
};

export const upsertStoredAdminCategory = (record: AdminCategoryRecord): AdminCategoryRecord => {
  const categories = getStoredAdminCategories();
  const nextCategories = [...categories.filter((item) => item.id !== record.id), record];
  saveStoredAdminCategories(nextCategories);
  saveStoredDeletedCategoryIds(getStoredDeletedCategoryIds().filter((id) => id !== record.id));
  return record;
};

export const removeStoredAdminCategory = (id: string, markDeleted = true) => {
  saveStoredAdminCategories(getStoredAdminCategories().filter((item) => item.id !== id));
  if (markDeleted) {
    saveStoredDeletedCategoryIds([...getStoredDeletedCategoryIds(), id]);
  }
};

const toPublicCategory = (record: AdminCategoryRecord): Category => ({
  id: record.id,
  name: record.name || 'Untitled category',
  description: record.description || undefined,
  imageUrl: record.image || undefined,
});

export const mergeAdminCategoriesIntoPublicCategories = (categories: Category[]): Category[] => {
  const storedCategories = getStoredAdminCategories();
  const deletedIds = new Set(getStoredDeletedCategoryIds());
  const map = new Map<string, Category>();

  categories.forEach((category) => {
    const id = String(category.id);
    if (!deletedIds.has(id)) {
      map.set(id, category);
    }
  });

  storedCategories.forEach((record) => {
    map.set(record.id, toPublicCategory(record));
  });

  return Array.from(map.values());
};

export const buildAdminCategoryFromCategory = (category: Category): AdminCategoryRecord => ({
  id: String(category.id),
  name: category.name,
  description: category.description ?? '',
  image: category.imageUrl ?? '',
  persistence: 'backend',
});

export const getStoredAdminCategoryById = (id: string): AdminCategoryRecord | undefined =>
  getStoredAdminCategories().find((item) => item.id === id);
