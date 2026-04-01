import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import kaa from './locales/kaa.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import { createTranslationResource } from './shared/i18n/createTranslationResource';
import { structuredResources } from './shared/i18n/structuredResources';

export const LANGUAGE_STORAGE_KEY = 'baramiz-language';
export const SUPPORTED_LANGUAGES = ['kaa', 'ru', 'uz', 'en'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (value: string): value is AppLanguage =>
  SUPPORTED_LANGUAGES.includes(value as AppLanguage);

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage && isSupportedLanguage(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.toLowerCase();

  if (browserLanguage.startsWith('kaa')) {
    return 'kaa';
  }

  if (browserLanguage.startsWith('ru')) {
    return 'ru';
  }

  if (browserLanguage.startsWith('uz')) {
    return 'uz';
  }

  if (browserLanguage.startsWith('en')) {
    return 'en';
  }

  return 'en';
};

void i18n.use(initReactI18next).init({
  resources: {
    kaa: { translation: createTranslationResource(kaa, structuredResources.kaa) },
    ru: { translation: createTranslationResource(ru, structuredResources.ru) },
    uz: { translation: createTranslationResource(uz, structuredResources.uz) },
    en: { translation: createTranslationResource(en, structuredResources.en) },
  },
  lng: getInitialLanguage(),
  fallbackLng: {
    kaa: ['uz', 'en'],
    ru: ['en'],
    uz: ['en'],
    en: ['en'],
    default: ['en'],
  },
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: {
    escapeValue: false,
  },
});

if (typeof window !== 'undefined') {
  const applyLanguageMeta = (language: string) => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  };

  applyLanguageMeta(i18n.resolvedLanguage ?? i18n.language);
  i18n.on('languageChanged', applyLanguageMeta);
}

export default i18n;
