import type { Category, Id } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';
import { asRecord, readArray, readString } from '../../../shared/lib/guards/record';
import { resolveAssetUrl } from '../../../utils/placeArtwork';

const normalizeCategory = (value: unknown): Category => {
  const item = asRecord(value);
  const fallbackId = readString(item.name) ?? 'category';

  return {
    id: (item.id ?? item._id ?? item.slug ?? fallbackId) as Id,
    name: readString(item.name) ?? 'Unnamed category',
    description: readString(item.description),
    imageUrl: resolveAssetUrl(readString(item.imageUrl) ?? readString(item.image)),
  };
};

export const getCategories = async (): Promise<Category[]> => {
  const payload = await requestJson<unknown>('/categories');
  return readArray(payload).map(normalizeCategory);
};

