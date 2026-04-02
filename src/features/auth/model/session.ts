export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AppAuthSession {
  token: string;
  expiresAt: string;
  user: AuthUser;
  authMode: 'backend-token';
}

const AUTH_SESSION_STORAGE_KEY = 'baramiz:auth-session';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

const isValidUser = (value: unknown): value is AuthUser => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthUser>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.createdAt === 'string'
  );
};

const readAuthSession = (value: unknown): AppAuthSession | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<AppAuthSession>;

  if (
    typeof candidate.token !== 'string' ||
    typeof candidate.expiresAt !== 'string' ||
    candidate.authMode !== 'backend-token' ||
    !isValidUser(candidate.user)
  ) {
    return null;
  }

  return {
    token: candidate.token,
    expiresAt: candidate.expiresAt,
    user: candidate.user,
    authMode: 'backend-token',
  };
};

const isExpired = (session: AppAuthSession | null): boolean => {
  if (!session) {
    return true;
  }

  const expiresAt = new Date(session.expiresAt).getTime();
  return Number.isNaN(expiresAt) || expiresAt <= Date.now();
};

const notifySessionChanged = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('baramiz:auth-session-changed'));
};

export const getAuthSession = (): AppAuthSession | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const session = readAuthSession(JSON.parse(raw));
    if (!session || isExpired(session)) {
      storage.removeItem(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to read auth session', error);
    return null;
  }
};

export const hasAuthSession = (): boolean => Boolean(getAuthSession());

export const setAuthSession = (session: AppAuthSession): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    notifySessionChanged();
  } catch (error) {
    console.error('Failed to store auth session', error);
  }
};

export const clearAuthSession = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(AUTH_SESSION_STORAGE_KEY);
    notifySessionChanged();
  } catch (error) {
    console.error('Failed to clear auth session', error);
  }
};

export const createBackendAuthSession = (input: {
  token: string;
  expiresAt: string;
  user: AuthUser;
}): AppAuthSession => ({
  token: input.token,
  expiresAt: input.expiresAt,
  user: input.user,
  authMode: 'backend-token',
});

export const getSessionInitials = (session: AppAuthSession | null): string => {
  if (!session) {
    return 'BA';
  }

  const initials = session.user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'BA';
};

export const getSessionFirstName = (session: AppAuthSession | null): string | null => {
  if (!session) {
    return null;
  }

  const first = session.user.name.split(' ').find(Boolean)?.trim() ?? '';
  return first.length > 0 ? first : null;
};
