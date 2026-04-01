import type { GeneratedRoute, RouteGenerationInput } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';

export const generateRoute = async (
  data: RouteGenerationInput,
): Promise<GeneratedRoute> =>
  requestJson<GeneratedRoute>('/routes/generate', {
    method: 'POST',
    body: data,
  });
