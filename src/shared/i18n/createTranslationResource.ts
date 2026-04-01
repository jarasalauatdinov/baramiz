export type TranslationResource = Record<string, unknown>;

const isRecord = (value: unknown): value is TranslationResource =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getRecord = (value: unknown): TranslationResource => (isRecord(value) ? value : {});

const mergeDeep = (target: TranslationResource, source: TranslationResource): TranslationResource => {
  const result: TranslationResource = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (isRecord(value) && isRecord(result[key])) {
      result[key] = mergeDeep(getRecord(result[key]), value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

const normalizeLegacyBranches = (resource: TranslationResource): TranslationResource => {
  const layout = getRecord(resource.layout);
  const pages = getRecord(resource.pages);
  const homeV2 = getRecord(resource.homeV2);

  return {
    layout: {
      ...layout,
      navigation: mergeDeep(getRecord(resource.nav), getRecord(layout.navigation)),
      footer: mergeDeep(
        mergeDeep(getRecord(resource.footer), getRecord(resource.footerV2)),
        getRecord(layout.footer),
      ),
    },
    pages: {
      ...pages,
      home: mergeDeep(
        mergeDeep(getRecord(resource.home), homeV2),
        mergeDeep(getRecord(resource.homepage), getRecord(pages.home)),
      ),
      destinations: mergeDeep(getRecord(resource.destinationsPage), getRecord(pages.destinations)),
      destination: mergeDeep(getRecord(resource.destinationPage), getRecord(pages.destination)),
      places: mergeDeep(getRecord(resource.placesPage), getRecord(pages.places)),
      services: mergeDeep(getRecord(resource.servicesPage), getRecord(pages.services)),
      guides: mergeDeep(
        mergeDeep(getRecord(resource.guidesPage), getRecord(homeV2.guides)),
        getRecord(pages.guides),
      ),
      routeGenerator: mergeDeep(
        getRecord(resource.routeGenerator),
        getRecord(pages.routeGenerator),
      ),
      routeResult: mergeDeep(getRecord(resource.routeResult), getRecord(pages.routeResult)),
      map: mergeDeep(getRecord(resource.mapPage), getRecord(pages.map)),
      about: mergeDeep(getRecord(resource.aboutPage), getRecord(pages.about)),
      notFound: mergeDeep(getRecord(resource.notFound), getRecord(pages.notFound)),
    },
  };
};

export const createTranslationResource = (
  rawLocale: TranslationResource,
  structuredLocale: TranslationResource,
): TranslationResource => {
  const merged = mergeDeep(rawLocale, structuredLocale);
  return mergeDeep(merged, normalizeLegacyBranches(merged));
};
