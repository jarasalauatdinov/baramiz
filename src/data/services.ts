export interface ServiceCardData {
  title: string;
  description: string;
  meta: string;
  tags: string[];
}

export interface ServiceSection {
  id: string;
  title: string;
  description: string;
  items: ServiceCardData[];
}

type TranslationFunction = (key: string, options?: Record<string, unknown>) => unknown;

type ServiceSectionId = 'agencies' | 'guides' | 'transport' | 'accommodation' | 'experiences';

const serviceSectionIds: ServiceSectionId[] = [
  'agencies',
  'guides',
  'transport',
  'accommodation',
  'experiences',
];

const readString = (t: TranslationFunction, key: string, fallback: string): string => {
  const value = t(key);
  return typeof value === 'string' && value !== key ? value : fallback;
};

const readServiceItems = (t: TranslationFunction, key: string): ServiceCardData[] => {
  const value = t(key, { returnObjects: true });

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is ServiceCardData =>
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

const fallbackSections: Record<ServiceSectionId, Pick<ServiceSection, 'title' | 'description'>> = {
  agencies: {
    title: 'Tour agencies',
    description: 'Demo-ready operator cards for packaged tours, day trips, and regional visitor support.',
  },
  guides: {
    title: 'Guides',
    description: 'Local guide profiles for history, culture, and remote destination storytelling.',
  },
  transport: {
    title: 'Transport',
    description: 'Practical transfer and vehicle support options for visitors moving between cities and remote sites.',
  },
  accommodation: {
    title: 'Accommodation',
    description: 'Simple but polished stay options for city breaks, road trips, and overnight regional journeys.',
  },
  experiences: {
    title: 'Cultural experiences',
    description: 'Add-on experiences that help the platform feel like a full tourism service layer, not just a place list.',
  },
};

export const getLocalizedServiceSections = (t: TranslationFunction): ServiceSection[] =>
  serviceSectionIds.map((id) => ({
    id,
    title: readString(t, `servicesPage.sections.${id}.title`, fallbackSections[id].title),
    description: readString(t, `servicesPage.sections.${id}.description`, fallbackSections[id].description),
    items: readServiceItems(t, `servicesPage.sections.${id}.items`),
  }));
