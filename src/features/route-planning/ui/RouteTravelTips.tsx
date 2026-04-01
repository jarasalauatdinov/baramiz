import { Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { publicUi } from '../../../shared/config/publicUi';
import type { RouteTravelTip } from '../model/resultExperience';

interface RouteTravelTipsProps {
  tips: RouteTravelTip[];
}

export function RouteTravelTips({ tips }: RouteTravelTipsProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      {tips.map((tip) => (
        <Paper
          key={tip.id}
          withBorder
          radius={publicUi.radius.cardInner}
          p="md"
          bg={publicUi.background.surfaceSoft}
          style={{ borderColor: publicUi.border.soft }}
        >
          <Stack gap={8}>
            <Text fw={700}>{tip.title}</Text>
            <Text c="dimmed" size="sm" style={{ lineHeight: 1.68 }}>
              {tip.description}
            </Text>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
