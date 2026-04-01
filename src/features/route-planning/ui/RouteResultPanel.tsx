import type { ReactNode } from 'react';
import { Paper, Stack, Text, Title } from '@mantine/core';
import { publicUi } from '../../../shared/config/publicUi';

interface RouteResultPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function RouteResultPanel({ title, description, children }: RouteResultPanelProps) {
  return (
    <Paper
      withBorder
      radius={publicUi.radius.panel}
      p={{ base: 'lg', md: 'xl' }}
      bg={publicUi.background.surface}
      style={{
        borderColor: publicUi.border.default,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Stack gap="lg">
        <div>
          <Title order={3} style={{ lineHeight: 1.15 }}>
            {title}
          </Title>
          {description ? (
            <Text c="dimmed" size="sm" mt={8} style={{ lineHeight: 1.7 }}>
              {description}
            </Text>
          ) : null}
        </div>
        {children}
      </Stack>
    </Paper>
  );
}
