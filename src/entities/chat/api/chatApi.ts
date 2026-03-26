import type { ChatMessageRequest, ChatMessageResponse } from '../../../types/api';
import { requestJson } from '../../../shared/api/httpClient';
import { asRecord, readString } from '../../../shared/lib/guards/record';

export const sendChatMessage = async (
  data: ChatMessageRequest,
): Promise<ChatMessageResponse> => {
  const payload = await requestJson<unknown>('/chat', {
    method: 'POST',
    body: data,
  });

  const root = asRecord(payload);
  const content = asRecord(root.data ?? root);

  return {
    reply:
      readString(content.reply) ??
      readString(content.message) ??
      readString(content.text) ??
      'No response text received.',
    raw: content,
  };
};

