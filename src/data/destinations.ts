import {
  destinationCatalog,
  destinationSupportFallbacks,
  destinationTextFallbacks,
} from '../entities/destination/model/catalog';
import type {
  DestinationConfig,
  DestinationDefinition,
  DestinationMetric,
  DestinationSupportCard,
  DestinationSupportData,
} from '../entities/destination/model/types';

export type {
  DestinationConfig,
  DestinationDefinition,
  DestinationMetric,
  DestinationNearbyPoint,
  DestinationSupportCard,
  DestinationSupportData,
} from '../entities/destination/model/types';

type TranslationFunction = (key: string, options?: Record<string, unknown>) => unknown;

const readString = (t: TranslationFunction, key: string, fallback: string): string => {
  const value = t(key);
  return typeof value === 'string' && value !== key ? value : fallback;
};

const readStringArray = (t: TranslationFunction, key: string, fallback: string[]): string[] => {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
};

const readMetrics = (t: TranslationFunction, key: string, fallback: DestinationMetric[]): DestinationMetric[] => {
  const value = t(key, { returnObjects: true });

  if (!Array.isArray(value)) {
    return fallback;
  }

  const metrics = value.filter(
    (item): item is DestinationMetric =>
      typeof item === 'object' &&
      item !== null &&
      'label' in item &&
      'value' in item &&
      typeof item.label === 'string' &&
      typeof item.value === 'string',
  );

  return metrics.length > 0 ? metrics : fallback;
};

const readSupportCards = (t: TranslationFunction, key: string): DestinationSupportCard[] => {
  const value = t(key, { returnObjects: true });

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is DestinationSupportCard =>
      typeof item === 'object' &&
      item !== null &&
      'title' in item &&
      'description' in item &&
      'meta' in item &&
      'tags' in item &&
      typeof item.title === 'string' &&
      typeof item.description === 'string' &&
      typeof item.meta === 'string' &&
      Array.isArray(item.tags) &&
      item.tags.every((tag: unknown) => typeof tag === 'string'),
  );
};

export const featuredDestinations: DestinationDefinition[] = destinationCatalog;

export const localizeDestination = (destination: DestinationDefinition, t: TranslationFunction): DestinationConfig => {
  const key = `destinations.${destination.slug}`;
  const fallback = destinationTextFallbacks[destination.slug] ?? destinationTextFallbacks.nukus;

  return {
    ...destination,
    name: readString(t, `${key}.name`, fallback.name),
    kicker: readString(t, `${key}.kicker`, fallback.kicker),
    summary: readString(t, `${key}.summary`, fallback.summary),
    overview: readString(t, `${key}.overview`, fallback.overview),
    longDescription: readString(t, `${key}.longDescription`, fallback.longDescription),
    bestFor: readStringArray(t, `${key}.bestFor`, fallback.bestFor),
    metrics: readMetrics(t, `${key}.metrics`, fallback.metrics),
  };
};

export const getLocalizedDestinations = (t: TranslationFunction): DestinationConfig[] =>
  featuredDestinations.map((destination) => localizeDestination(destination, t));

export const getDestinationBySlug = (slug?: string): DestinationDefinition | undefined =>
  featuredDestinations.find((destination) => destination.slug === slug);

export const getDestinationByCity = (city?: string): DestinationDefinition | undefined => {
  if (!city) {
    return undefined;
  }

  const normalizedCity = city.trim().toLowerCase();

  return featuredDestinations.find((destination) =>
    destination.cities.some((item) => item.trim().toLowerCase() === normalizedCity),
  );
};

export const getLocalizedDestinationBySlug = (slug: string | undefined, t: TranslationFunction): DestinationConfig | undefined => {
  const definition = getDestinationBySlug(slug);
  return definition ? localizeDestination(definition, t) : undefined;
};

export const getLocalizedDestinationByCity = (
  city: string | undefined,
  t: TranslationFunction,
): DestinationConfig | undefined => {
  const definition = getDestinationByCity(city);
  return definition ? localizeDestination(definition, t) : undefined;
};

export const getLocalizedDestinationSupportData = (slug: string, t: TranslationFunction): DestinationSupportData => {
  const safeSlug = getDestinationBySlug(slug) ? slug : 'nukus';
  const baseKey = `destinations.${safeSlug}.support`;
  const fallback = destinationSupportFallbacks[safeSlug] ?? destinationSupportFallbacks.nukus;
  const stays = readSupportCards(t, `${baseKey}.stays`);
  const guides = readSupportCards(t, `${baseKey}.guides`);
  const food = readSupportCards(t, `${baseKey}.food`);
  const tours = readSupportCards(t, `${baseKey}.tours`);

  return {
    stays: stays.length > 0 ? stays : fallback.stays,
    guides: guides.length > 0 ? guides : fallback.guides,
    food: food.length > 0 ? food : fallback.food,
    tours: tours.length > 0 ? tours : fallback.tours,
  };
};

