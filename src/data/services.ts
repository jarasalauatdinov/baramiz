import {
  serviceCatalog,
  serviceSectionFallbacks,
  serviceSectionOrder,
} from '../entities/service/model/catalog';
import type {
  ServiceCardData,
  ServiceCatalogEntry,
  ServiceSection,
} from '../entities/service/model/types';

export type {
  ServiceCardData,
  ServiceCatalogEntry,
  ServiceKind,
  ServiceSection,
  ServiceSectionId,
} from '../entities/service/model/types';

type TranslationFunction = (key: string, options?: Record<string, unknown>) => unknown;

const readString = (t: TranslationFunction, key: string, fallback: string): string => {
  const value = t(key);
  return typeof value === 'string' && value !== key ? value : fallback;
};

export const getLocalizedServices = (): ServiceCatalogEntry[] => serviceCatalog;

export const getLocalizedServiceSections = (t: TranslationFunction): ServiceSection[] =>
  serviceSectionOrder.map((id) => ({
    id,
    title: readString(t, `servicesPage.sections.${id}.title`, serviceSectionFallbacks[id].title),
    description: readString(t, `servicesPage.sections.${id}.description`, serviceSectionFallbacks[id].description),
    items: serviceCatalog.filter((item) => item.kind === id),
  }));

export const getServiceCityOptions = (t: TranslationFunction, services: ServiceCardData[]) => [
  { value: 'all', label: readString(t, 'servicesPage.filters.allCities', 'All cities') },
  ...Array.from(
    new Set(
      services.flatMap((item) => (item.availableCities && item.availableCities.length > 0 ? item.availableCities : item.city ? [item.city] : [])),
    ),
  ).map((city) => ({ value: city, label: city })),
];

export const getServiceSectionOptions = (t: TranslationFunction) => [
  { value: 'all', label: readString(t, 'servicesPage.filters.allTypes', 'All service types') },
  ...serviceSectionOrder.map((id) => ({
    value: id,
    label: readString(t, `servicesPage.sections.${id}.title`, serviceSectionFallbacks[id].title),
  })),
];

