const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const configuredAssetOrigin = import.meta.env.VITE_ASSET_ORIGIN?.trim();

export const API_BASE_URL =
  configuredApiBaseUrl && configuredApiBaseUrl.length > 0
    ? configuredApiBaseUrl.replace(/\/$/, '')
    : '/api';

export const API_ASSET_ORIGIN =
  configuredAssetOrigin && configuredAssetOrigin.length > 0
    ? configuredAssetOrigin.replace(/\/$/, '')
    : 'http://localhost:3000';

