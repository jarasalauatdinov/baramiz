import { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, type AppLanguage } from '../../../i18n';

export const LANGUAGE_STEP_STORAGE_KEY = 'baramiz-language-step-complete';
export const ONBOARDING_STEP_STORAGE_KEY = 'baramiz-onboarding-step-complete';

const isBrowser = () => typeof window !== 'undefined';

const isSupportedLanguage = (value: string | null): value is AppLanguage =>
  Boolean(value && SUPPORTED_LANGUAGES.includes(value as AppLanguage));

export const hasSavedLanguage = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(value);
};

export const hasCompletedLanguageStep = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(LANGUAGE_STEP_STORAGE_KEY) === '1';
};

export const markLanguageStepCompleted = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STEP_STORAGE_KEY, '1');
};

export const hasCompletedOnboarding = (): boolean => {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(ONBOARDING_STEP_STORAGE_KEY) === '1';
};

export const markOnboardingCompleted = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ONBOARDING_STEP_STORAGE_KEY, '1');
};

export const resetAppIntroFlow = (): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(LANGUAGE_STEP_STORAGE_KEY);
  window.localStorage.removeItem(ONBOARDING_STEP_STORAGE_KEY);
};
