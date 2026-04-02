import { Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

interface PageHeaderBlockProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'center' | 'left';
  size?: 'section' | 'page';
  mb?: number | string;
}

export function PageHeaderBlock({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  size = 'page',
  mb = 'lg',
}: PageHeaderBlockProps) {
  const isPage = size === 'page';

  return (
    <Group justify="space-between" align="flex-end" gap="xl" mb={mb} wrap="wrap">
      <Stack gap={8} maw={isPage ? 720 : 640} ta={align}>
        {eyebrow ? (
          <Text
            size="xs"
            fw={800}
            c="sun.8"
            tt="uppercase"
            style={{ letterSpacing: '0.12em' }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Title
          order={isPage ? 1 : 2}
          style={{
            fontSize: isPage ? 'clamp(1.85rem, 6vw, 3.2rem)' : 'clamp(1.42rem, 4.5vw, 2.2rem)',
            lineHeight: isPage ? 1.04 : 1.14,
            letterSpacing: isPage ? '-0.03em' : '-0.02em',
            textWrap: 'balance',
          }}
        >
          {title}
        </Title>
        {description ? (
          <Text
            c="dimmed"
            size={isPage ? 'md' : 'sm'}
            maw={isPage ? 600 : 560}
            style={{ lineHeight: 1.65 }}
          >
            {description}
          </Text>
        ) : null}
      </Stack>
      {action ? <div style={{ paddingBottom: isPage ? 6 : 4 }}>{action}</div> : null}
    </Group>
  );
}
