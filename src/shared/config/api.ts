const DEFAULT_DEV_API_BASE_URL = '/api';
const DEFAULT_DEV_ASSET_ORIGIN = 'http://localhost:3000';

const isNonEmptyString = (value: string | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const normalizeEnvUrl = (value: string | undefined): string | undefined =>
  isNonEmptyString(value) ? trimTrailingSlash(value.trim()) : undefined;

const deriveOriginFromUrl = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
};

const reportedConfigMessages = new Set<string>();

const reportConfigIssue = (message: string): void => {
  if (reportedConfigMessages.has(message)) {
    return;
  }

  reportedConfigMessages.add(message);
  console.error(`[api-config] ${message}`);
};

const configuredApiBaseUrl = normalizeEnvUrl(import.meta.env.VITE_API_BASE_URL);
const configuredAssetOrigin = normalizeEnvUrl(import.meta.env.VITE_ASSET_ORIGIN);

export const IS_DEVELOPMENT = import.meta.env.DEV;

export const API_BASE_URL =
  configuredApiBaseUrl ?? (IS_DEVELOPMENT ? DEFAULT_DEV_API_BASE_URL : '');

export const API_ASSET_ORIGIN =
  configuredAssetOrigin ??
  deriveOriginFromUrl(configuredApiBaseUrl) ??
  (IS_DEVELOPMENT ? DEFAULT_DEV_ASSET_ORIGIN : '');

const missingApiBaseUrlMessage =
  'Missing VITE_API_BASE_URL in production. Set it to the deployed backend API URL, for example https://backend.example.com/api, or explicitly to /api if a production proxy is configured.';

const missingAssetOriginMessage =
  'Missing VITE_ASSET_ORIGIN in production. Relative asset paths will resolve against the current frontend origin until this is configured.';

export const getApiBaseUrl = (): string => {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }

  reportConfigIssue(missingApiBaseUrlMessage);
  throw new Error(missingApiBaseUrlMessage);
};

export const getAssetOrigin = (): string | undefined => {
  if (API_ASSET_ORIGIN) {
    return API_ASSET_ORIGIN;
  }

  if (!IS_DEVELOPMENT) {
    reportConfigIssue(missingAssetOriginMessage);
  }

  return undefined;
};

export const buildApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
