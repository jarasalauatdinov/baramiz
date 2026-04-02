export type ProtectedActionReason =
  | 'booking'
  | 'payment'
  | 'save-route'
  | 'save-favorites'
  | 'guide-request'
  | 'service-request'
  | 'profile';

export interface ProtectedActionIntent {
  reason: ProtectedActionReason;
  redirectTo: string;
  redirectState?: unknown;
  sourcePath?: string;
}

const PENDING_PROTECTED_ACTION_STORAGE_KEY = 'baramiz:pending-protected-action';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
};

const protectedActionReasons: ProtectedActionReason[] = [
  'booking',
  'payment',
  'save-route',
  'save-favorites',
  'guide-request',
  'service-request',
  'profile',
];

const isProtectedActionReason = (value: unknown): value is ProtectedActionReason =>
  typeof value === 'string' && protectedActionReasons.includes(value as ProtectedActionReason);

export const readProtectedActionIntent = (value: unknown): ProtectedActionIntent | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Partial<ProtectedActionIntent>;

  if (!isProtectedActionReason(candidate.reason) || typeof candidate.redirectTo !== 'string') {
    return null;
  }

  return {
    reason: candidate.reason,
    redirectTo: candidate.redirectTo,
    redirectState: candidate.redirectState,
    sourcePath: typeof candidate.sourcePath === 'string' ? candidate.sourcePath : undefined,
  };
};

export const getPendingProtectedAction = (): ProtectedActionIntent | null => {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(PENDING_PROTECTED_ACTION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return readProtectedActionIntent(JSON.parse(raw));
  } catch (error) {
    console.error('Failed to read pending protected action', error);
    return null;
  }
};

export const savePendingProtectedAction = (intent: ProtectedActionIntent): void => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(PENDING_PROTECTED_ACTION_STORAGE_KEY, JSON.stringify(intent));
  } catch (error) {
    console.error('Failed to store pending protected action', error);
  }
};

export const clearPendingProtectedAction = (): void => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(PENDING_PROTECTED_ACTION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear pending protected action', error);
  }
};

export const deriveProtectedActionSourcePath = (value: unknown): string | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.originPath === 'string') {
    return candidate.originPath;
  }

  if (typeof candidate.from === 'string') {
    return candidate.from;
  }

  return undefined;
};
