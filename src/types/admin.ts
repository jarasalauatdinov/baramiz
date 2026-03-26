export type AdminPersistenceMode = 'backend' | 'local-demo';

export interface AdminPlaceTranslations {
  name_uz: string;
  description_uz: string;
  name_kaa: string;
  description_kaa: string;
  name_ru: string;
  description_ru: string;
  name_en: string;
  description_en: string;
}

export interface AdminPlaceCoordinates {
  lat?: number;
  lng?: number;
}

export interface AdminPlaceRecord extends AdminPlaceTranslations {
  id: string;
  city: string;
  region: string;
  category: string;
  image: string;
  durationMinutes: number;
  featured: boolean;
  coordinates: AdminPlaceCoordinates;
  persistence: AdminPersistenceMode;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminPlaceFormValues extends AdminPlaceTranslations {
  city: string;
  region: string;
  category: string;
  image: string;
  durationMinutes: string;
  featured: boolean;
  latitude: string;
  longitude: string;
}

export interface AdminPlaceMutationResult {
  place: AdminPlaceRecord;
  persistence: AdminPersistenceMode;
}

export interface TranslationGenerationResult {
  name_ru: string;
  description_ru: string;
  name_en: string;
  description_en: string;
  source: 'backend' | 'fallback-copy';
}

export interface AdminCategoryRecord {
  id: string;
  name: string;
  description: string;
  image: string;
  persistence: AdminPersistenceMode;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCategoryFormValues {
  name: string;
  description: string;
  image: string;
}

export interface AdminCategoryMutationResult {
  category: AdminCategoryRecord;
  persistence: AdminPersistenceMode;
}
