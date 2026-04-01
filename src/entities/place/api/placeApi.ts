import i18n from '../../../i18n';
import type { Place, RouteLanguage } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';

export interface GetPlacesOptions {
  category?: string;
  city?: string;
  featured?: boolean;
  language?: RouteLanguage;
}

const resolveRequestLanguage = (language?: RouteLanguage): RouteLanguage => {
  if (language) {
    return language;
  }

  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  if (currentLanguage === 'kaa' || currentLanguage === 'uz' || currentLanguage === 'ru') {
    return currentLanguage;
  }

  return 'en';
};

export const getPlaces = async (options: GetPlacesOptions = {}): Promise<Place[]> =>
  requestJson<Place[]>('/places', {
    query: {
      city: options.city,
      category: options.category,
      featured: options.featured,
      language: resolveRequestLanguage(options.language),
    },
  });

export const getPlaceById = async (id: string, language?: RouteLanguage): Promise<Place | null> => {
  try {
    return await requestJson<Place>(`/places/${id}`, {
      query: {
        language: resolveRequestLanguage(language),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
      return null;
    }

    throw error;
  }
};

export const getFeaturedPlaces = async (limit = 4, language?: RouteLanguage): Promise<Place[]> => {
  const featuredPlaces = await getPlaces({ featured: true, language });
  return featuredPlaces.slice(0, limit);
};
