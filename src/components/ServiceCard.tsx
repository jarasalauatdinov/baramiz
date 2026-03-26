import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { ServiceCardData } from '../data/services';
import { publicUi } from '../shared/config/publicUi';

interface ServiceCardProps {
  item: ServiceCardData;
  actionLabel?: string;
}

export function ServiceCard({ item, actionLabel }: ServiceCardProps) {
  const { t } = useTranslation();
  const resolvedActionLabel = actionLabel ?? t('common.viewDetails');

  return (
    <Paper
      withBorder
      p="xl"
      radius={publicUi.radius.card}
      h="100%"
      style={{
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Stack justify="space-between" h="100%">
        <Stack gap="md">
          <Text size="xs" fw={700} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
            {item.meta}
          </Text>
          <Title order={3}>{item.title}</Title>
          <Text c="dimmed" style={{ lineHeight: 1.72 }}>
            {item.description}
          </Text>
          <Group gap="xs">
            {item.tags.map((tag) => (
              <Badge key={tag} color="sun" variant="light" radius="xl" c="#5a420b">
                {tag}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Button variant="light" color="forest" mt="lg">
          {resolvedActionLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
