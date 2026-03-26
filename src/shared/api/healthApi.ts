import { requestJson } from './httpClient';
import { asRecord, readString } from '../lib/guards/record';

export interface HealthResponse {
  status: string;
  message?: string;
}

export const getHealth = async (): Promise<HealthResponse> => {
  const payload = await requestJson<unknown>('/health');
  const data = asRecord(payload);

  return {
    status: readString(data.status) ?? 'ok',
    message: readString(data.message),
  };
};

