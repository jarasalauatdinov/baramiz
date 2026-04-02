import { requestJson } from '../../../shared/api/httpClient';
import type { AuthUser } from '../model/session';

interface AuthResponsePayload {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

interface AuthProfilePayload {
  user: AuthUser;
}

const createAuthHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
});

export const registerWithBackend = (
  input: { name: string; email: string; password: string },
): Promise<AuthResponsePayload> =>
  requestJson<AuthResponsePayload>('/auth/register', {
    method: 'POST',
    body: input,
  });

export const loginWithBackend = (
  input: { email: string; password: string },
): Promise<AuthResponsePayload> =>
  requestJson<AuthResponsePayload>('/auth/login', {
    method: 'POST',
    body: input,
  });

export const fetchCurrentUser = (token: string): Promise<AuthProfilePayload> =>
  requestJson<AuthProfilePayload>('/auth/me', {
    headers: createAuthHeaders(token),
  });

export const logoutFromBackend = (token: string): Promise<{ message: string }> =>
  requestJson<{ message: string }>('/auth/logout', {
    method: 'POST',
    headers: createAuthHeaders(token),
  });
