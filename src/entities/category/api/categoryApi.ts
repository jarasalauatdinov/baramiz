import type { Category } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';

export const getCategories = async (): Promise<Category[]> =>
  requestJson<Category[]>('/categories');
