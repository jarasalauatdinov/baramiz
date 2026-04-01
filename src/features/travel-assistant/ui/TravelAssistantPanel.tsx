import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { sendChatMessage } from '../../../entities/chat/api/chatApi';
import { resolvePlannerLanguage } from '../../route-planning/model/options';
import type { ChatMessageResponse } from '../../../types/api';

interface TravelAssistantPanelProps {
  title: string;
  description: string;
  placeholder: string;
  emptyHint: string;
  suggestions?: string[];
}

export function TravelAssistantPanel({
  title,
  description,
  placeholder,
  emptyHint,
  suggestions = [],
}: TravelAssistantPanelProps) {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ChatMessageResponse | null>(null);

  const visibleSuggestions = useMemo(
    () => (response?.suggestions && response.suggestions.length > 0 ? response.suggestions : suggestions),
    [response?.suggestions, suggestions],
  );

  const submitMessage = async (nextMessage: string) => {
    const trimmedMessage = nextMessage.trim();
    if (!trimmedMessage) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(trimmedMessage);

      const nextResponse = await sendChatMessage({
        message: trimmedMessage,
        language: resolvePlannerLanguage(i18n.resolvedLanguage),
      });

      setResponse(nextResponse);
    } catch (submitError) {
      console.error('Failed to fetch assistant reply', submitError);
      setError(
        t('pages.travelAssistant.error', {
          defaultValue:
            'The assistant could not respond right now. You can still continue with route planning and place browsing.',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder radius="24px" p={{ base: 'lg', md: 'xl' }} bg="white">
      <Stack gap="md">
        <Stack gap={6}>
          <Text fw={700}>{title}</Text>
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.65 }}>
            {description}
          </Text>
        </Stack>

        {visibleSuggestions.length > 0 ? (
          <Stack gap={8}>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase">
              {t('pages.travelAssistant.suggestionsLabel', {
                defaultValue: 'Quick prompts',
              })}
            </Text>
            <Group gap="xs" wrap="wrap">
              {visibleSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="light"
                  color="forest"
                  radius="xl"
                  size="compact-sm"
                  onClick={() => void submitMessage(suggestion)}
                  loading={loading && message === suggestion}
                >
                  {suggestion}
                </Button>
              ))}
            </Group>
          </Stack>
        ) : null}

        <Textarea
          autosize
          minRows={3}
          maxRows={6}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          placeholder={placeholder}
        />

        {error ? (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        ) : null}

        <Button
          color="forest"
          fullWidth
          loading={loading}
          onClick={() => void submitMessage(message)}
          disabled={!message.trim()}
        >
          {t('pages.travelAssistant.submit', { defaultValue: 'Ask assistant' })}
        </Button>

        {response ? (
          <Paper withBorder radius="18px" p="md" bg="#fffdf8">
            <Stack gap="sm">
              <Group justify="space-between" align="center" wrap="wrap">
                <Text fw={700}>
                  {t('pages.travelAssistant.replyTitle', { defaultValue: 'Assistant reply' })}
                </Text>
                <Badge
                  color={response.source === 'openai' ? 'forest' : 'sun'}
                  variant="light"
                  radius="xl"
                  c={response.source === 'openai' ? undefined : '#5a420b'}
                >
                  {response.source === 'openai'
                    ? t('pages.travelAssistant.sourceLive', { defaultValue: 'Live backend reply' })
                    : t('pages.travelAssistant.sourceFallback', { defaultValue: 'Fallback backend reply' })}
                </Badge>
              </Group>
              <Text style={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>{response.reply}</Text>
            </Stack>
          </Paper>
        ) : (
          <Text size="sm" c="dimmed">
            {emptyHint}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
