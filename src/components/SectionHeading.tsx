import { Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <Group justify="space-between" align="flex-end" gap="lg" mb="lg" wrap="wrap">
      <Stack gap={8} maw={760}>
        {eyebrow ? (
          <Text size="sm" fw={700} c="sun.7" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
            {eyebrow}
          </Text>
        ) : null}
        <Title order={2} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.08 }}>
          {title}
        </Title>
        {description ? (
          <Text c="dimmed" size="lg" style={{ lineHeight: 1.72 }}>
            {description}
          </Text>
        ) : null}
      </Stack>
      {action}
    </Group>
  );
}
