import type { ChatMessageRequest, ChatMessageResponse } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';

export const sendChatMessage = async (
  data: ChatMessageRequest,
): Promise<ChatMessageResponse> =>
  requestJson<ChatMessageResponse>('/chat', {
    method: 'POST',
    body: data,
  });
