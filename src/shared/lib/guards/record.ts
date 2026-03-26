export type UnknownRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null;

export const asRecord = (value: unknown): UnknownRecord => (isRecord(value) ? value : {});

export const readArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const root = asRecord(payload);
  if (Array.isArray(root.data)) {
    return root.data;
  }
  if (Array.isArray(root.items)) {
    return root.items;
  }
  if (Array.isArray(root.results)) {
    return root.results;
  }

  return [];
};

export const readString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

export const readNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

