import type { RouteLanguage } from '../../route/model/apiTypes';

export interface ChatMessageRequest {
  message: string;
  language: RouteLanguage;
}

export interface ChatMessageResponse {
  reply: string;
  source: 'fallback' | 'openai';
  suggestions?: string[];
}
