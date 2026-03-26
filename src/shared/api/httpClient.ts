import { API_BASE_URL } from '../config/api';

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, QueryValue>;
  body?: unknown;
}

const buildQuery = (query?: Record<string, QueryValue>): string => {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    params.set(key, String(value));
  });

  const value = params.toString();
  return value ? `?${value}` : '';
};

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message ?? payload.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

export const requestJson = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { query, body, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  let payload: BodyInit | undefined;
  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}${buildQuery(query)}`, {
    ...rest,
    headers: requestHeaders,
    body: payload,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

