import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { publicUi } from '../../shared/config/publicUi';

interface StatePanelProps {
  badge?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function StatePanel({ badge, title, description, actions }: StatePanelProps) {
  return (
    <Paper
      withBorder
      radius={publicUi.radius.panel}
      p={{ base: 'xl', md: '2rem' }}
      bg="white"
      style={{
        borderColor: publicUi.border.default,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Stack gap="lg" align="flex-start">
        {badge ? (
          <Badge color="gray" variant="light" radius="xl">
            {badge}
          </Badge>
        ) : null}

        <div>
          <Title order={2}>{title}</Title>
          <Text mt="sm" c="dimmed" maw={640}>
            {description}
          </Text>
        </div>

        {actions ? <Group gap="sm" wrap="wrap">{actions}</Group> : null}
      </Stack>
    </Paper>
  );
}
