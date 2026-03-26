import { createPlaceFallbackImage } from '../utils/placeArtwork';

export interface DestinationMetric {
  label: string;
  value: string;
}

export interface DestinationConfig {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  overview: string;
  cities: string[];
  heroCategory: string;
  heroImage: string;
  bestFor: string[];
  metrics: DestinationMetric[];
}

export interface DestinationSupportCard {
  title: string;
  description: string;
  meta: string;
  tags: string[];
}

export interface DestinationSupportData {
  stays: DestinationSupportCard[];
  guides: DestinationSupportCard[];
  food: DestinationSupportCard[];
  tours: DestinationSupportCard[];
}

interface DestinationDefinition {
  slug: string;
  cities: string[];
  heroCategory: string;
  heroImage: string;
}

type TranslationFunction = (key: string, options?: Record<string, unknown>) => unknown;

const buildHeroImage = (name: string, city: string, category: string) =>
  createPlaceFallbackImage({ name, city, category });

const readString = (t: TranslationFunction, key: string, fallback: string): string => {
  const value = t(key);
  return typeof value === 'string' && value !== key ? value : fallback;
};

const readStringArray = (t: TranslationFunction, key: string, fallback: string[]): string[] => {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : fallback;
};

const readMetrics = (
  t: TranslationFunction,
  key: string,
  fallback: DestinationMetric[],
): DestinationMetric[] => {
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

const readSupportCards = (
  t: TranslationFunction,
  key: string,
): DestinationSupportCard[] => {
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

export const featuredDestinations: DestinationDefinition[] = [
  {
    slug: 'nukus',
    cities: ['Nukus'],
    heroCategory: 'museum',
    heroImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTV-N3g12TWB7MPWhK-LiAvF8_JRP186EZhQ&s',
  },
  {
    slug: 'moynaq',
    cities: ['Moynaq'],
    heroCategory: 'history',
    heroImage:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQR_-yfH0WBYHohfAlBI6mEvp-LjEUo3jAoA&s',
  },
  {
    slug: 'ellikqala',
    cities: ['Ellikqala'],
    heroCategory: 'adventure',
    heroImage: buildHeroImage('Ellikqala fortresses', 'Ellikqala', 'adventure'),
  },
  {
    slug: 'aral-sea-region',
    cities: ['Moynaq', 'Qonirat'],
    heroCategory: 'nature',
    heroImage: buildHeroImage('Aral Sea horizons', 'Aral Sea region', 'nature'),
  },
  {
    slug: 'ustyurt',
    cities: ['Qonirat', 'Moynaq'],
    heroCategory: 'nature',
    heroImage: buildHeroImage('Ustyurt plateau views', 'Ustyurt', 'nature'),
  },
];

const fallbackDestinationText: Record<
  string,
  Pick<DestinationConfig, 'name' | 'kicker' | 'summary' | 'overview' | 'bestFor' | 'metrics'>
> = {
  nukus: {
    name: 'Nukus',
    kicker: 'Culture capital',
    summary:
      'The easiest entry point into Karakalpakstan: museums, cultural landmarks, local markets, and strong city-based discovery.',
    overview:
      'Nukus is the main cultural gateway for travelers who want art, museums, food, and a reliable base for exploring the wider region.',
    bestFor: ['Museums', 'Culture', 'Food'],
    metrics: [
      { label: 'Ideal stay', value: '1-2 days' },
      { label: 'Best for', value: 'Museums' },
      { label: 'Travel style', value: 'City discovery' },
    ],
  },
  moynaq: {
    name: 'Moynaq',
    kicker: 'Aral Sea story',
    summary:
      'A powerful destination for travelers interested in environmental history, dramatic landscapes, and one of the region\'s most iconic sites.',
    overview:
      'Moynaq combines visual impact with a strong story, making it a compelling destination for history-focused visitors and competition demos alike.',
    bestFor: ['History', 'Nature', 'Photography'],
    metrics: [
      { label: 'Ideal stay', value: 'Half day' },
      { label: 'Best for', value: 'Aral Sea route' },
      { label: 'Travel style', value: 'Story-led visit' },
    ],
  },
  ellikqala: {
    name: 'Ellikqala',
    kicker: 'Fortress landscapes',
    summary:
      'Ancient fortresses, desert scenery, and road-trip energy make Ellikqala one of the region\'s best adventure destinations.',
    overview:
      'Ellikqala is ideal for travelers who want a more cinematic route built around archaeological sites and open landscapes.',
    bestFor: ['Adventure', 'History', 'Road trips'],
    metrics: [
      { label: 'Ideal stay', value: '1 day' },
      { label: 'Best for', value: 'Fortresses' },
      { label: 'Travel style', value: 'Scenic drive' },
    ],
  },
  'aral-sea-region': {
    name: 'Aral Sea region',
    kicker: 'Wide landscapes',
    summary:
      'A broader regional journey that blends Moynaq and nearby remote viewpoints into one destination story for travelers seeking scale.',
    overview:
      'The Aral Sea region experience is about dramatic environmental history, remote beauty, and memorable visual storytelling.',
    bestFor: ['Nature', 'History', 'Photography'],
    metrics: [
      { label: 'Ideal stay', value: '1 day' },
      { label: 'Best for', value: 'Regional route' },
      { label: 'Travel style', value: 'Remote escape' },
    ],
  },
  ustyurt: {
    name: 'Ustyurt',
    kicker: 'Plateau horizons',
    summary:
      'Vast steppe and canyon-edge landscapes for travelers who prefer dramatic nature and open-road exploration.',
    overview:
      'Ustyurt is built for scenic drives, wide views, and nature-heavy trips that feel different from city tourism.',
    bestFor: ['Nature', 'Adventure', 'Photography'],
    metrics: [
      { label: 'Ideal stay', value: '1 day' },
      { label: 'Best for', value: 'Plateau landscapes' },
      { label: 'Travel style', value: 'Outdoor road trip' },
    ],
  },
};

const buildSupportFallback = (
  destinationName: string,
  focus: string,
): DestinationSupportData => ({
  stays: [
    {
      title: `${destinationName} city stay`,
      description:
        `A reliable accommodation concept for travelers using ${destinationName} as their base.`,
      meta: 'Comfortable and practical',
      tags: ['Local stay', 'Flexible', 'Travel-ready'],
    },
    {
      title: `${destinationName} explorer lodge`,
      description:
        `A demo lodging profile suited for visitors planning multi-stop trips around ${destinationName}.`,
      meta: 'Best for day-plan extensions',
      tags: ['Regional', 'Scenic', 'Small groups'],
    },
  ],
  guides: [
    {
      title: `${destinationName} local guide`,
      description:
        `A guide profile focused on helping visitors explore ${destinationName} with stronger context and confidence.`,
      meta: `Focus: ${focus}`,
      tags: ['Local insight', 'Culture', 'Flexible'],
    },
    {
      title: `${destinationName} route companion`,
      description:
        `A practical support profile for route planning, timing, and local recommendations.`,
      meta: 'Useful for first-time visitors',
      tags: ['Route support', 'Logistics', 'Travel help'],
    },
  ],
  food: [
    {
      title: `${destinationName} local cuisine stop`,
      description:
        `A food stop concept that adds local flavor to a destination-focused route in ${destinationName}.`,
      meta: 'Good for lunch or dinner',
      tags: ['Local cuisine', 'Traveler-friendly', 'Quick stop'],
    },
    {
      title: `${destinationName} market tasting`,
      description:
        `A lighter stop built around local market atmosphere and practical route pacing.`,
      meta: 'Short break format',
      tags: ['Market', 'Snacks', 'Local life'],
    },
  ],
  tours: [
    {
      title: `${destinationName} highlights tour`,
      description:
        `A guided destination route that combines key places, local context, and practical timing.`,
      meta: 'Half-day or full-day',
      tags: ['Highlights', 'Guided', 'Structured'],
    },
    {
      title: `${destinationName} thematic route`,
      description:
        `A curated itinerary concept around ${focus.toLowerCase()} to make the trip feel focused and useful.`,
      meta: 'Best for demo-ready planning',
      tags: ['Thematic', 'Flexible', 'Tourism-ready'],
    },
  ],
});

const fallbackDestinationSupport: Record<string, DestinationSupportData> = {
  nukus: buildSupportFallback('Nukus', 'Museums and culture'),
  moynaq: buildSupportFallback('Moynaq', 'Aral Sea history'),
  ellikqala: buildSupportFallback('Ellikqala', 'Fortresses and adventure'),
  'aral-sea-region': buildSupportFallback('Aral Sea region', 'Regional landscapes'),
  ustyurt: buildSupportFallback('Ustyurt', 'Landscape and outdoor travel'),
};

export const localizeDestination = (
  destination: DestinationDefinition,
  t: TranslationFunction,
): DestinationConfig => {
  const key = `destinations.${destination.slug}`;
  const fallback = fallbackDestinationText[destination.slug];

  return {
    ...destination,
    name: readString(t, `${key}.name`, fallback.name),
    kicker: readString(t, `${key}.kicker`, fallback.kicker),
    summary: readString(t, `${key}.summary`, fallback.summary),
    overview: readString(t, `${key}.overview`, fallback.overview),
    bestFor: readStringArray(t, `${key}.bestFor`, fallback.bestFor),
    metrics: readMetrics(t, `${key}.metrics`, fallback.metrics),
  };
};

export const getLocalizedDestinations = (t: TranslationFunction): DestinationConfig[] =>
  featuredDestinations.map((destination) => localizeDestination(destination, t));

export const getDestinationBySlug = (slug?: string): DestinationDefinition | undefined =>
  featuredDestinations.find((destination) => destination.slug === slug);

export const getLocalizedDestinationBySlug = (
  slug: string | undefined,
  t: TranslationFunction,
): DestinationConfig | undefined => {
  const definition = getDestinationBySlug(slug);
  return definition ? localizeDestination(definition, t) : undefined;
};

export const getLocalizedDestinationSupportData = (
  slug: string,
  t: TranslationFunction,
): DestinationSupportData => {
  const safeSlug = getDestinationBySlug(slug) ? slug : 'nukus';
  const baseKey = `destinations.${safeSlug}.support`;
  const fallback = fallbackDestinationSupport[safeSlug] ?? fallbackDestinationSupport.nukus;
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
