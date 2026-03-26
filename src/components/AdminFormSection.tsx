import type { ReactNode } from 'react';
import { Paper, Stack, Text } from '@mantine/core';

interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminFormSection({ title, description, children }: AdminFormSectionProps) {
  return (
    <Paper
      withBorder
      radius="xs"
      p="md"
      style={{ borderColor: '#d9dee5', background: '#ffffff', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}
    >
      <Stack gap="md">
        <div style={{ paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
          <Text fw={600} size="sm" c="#111827">
            {title}
          </Text>
          {description ? (
            <Text size="xs" c="#6b7280" mt={4} style={{ lineHeight: 1.55 }}>
              {description}
            </Text>
          ) : null}
        </div>
        {children}
      </Stack>
    </Paper>
  );
}
