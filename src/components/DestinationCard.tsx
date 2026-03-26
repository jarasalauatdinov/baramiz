import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { DestinationConfig } from '../data/destinations';
import { DestinationImage } from './DestinationImage';
import { publicUi } from '../shared/config/publicUi';

interface DestinationCardProps {
  destination: DestinationConfig;
  placeCount?: number;
}

export function DestinationCard({ destination, placeCount }: DestinationCardProps) {
  const { t } = useTranslation();

  return (
    <Paper
      withBorder
      radius={publicUi.radius.card}
      style={{
        overflow: 'hidden',
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.card,
      }}
    >
      <DestinationImage
        src={destination.heroImage}
        name={destination.name}
        city={destination.name}
        category={destination.heroCategory}
        aspectRatio="16 / 10"
        height="auto"
        radius={0}
      >
        <div style={{ position: 'absolute', inset: 'auto 20px 20px 20px', zIndex: 1, color: 'white' }}>
          <Text size="xs" fw={700} style={{ letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
            {destination.kicker}
          </Text>
          <Title order={3} style={{ marginTop: 6, color: 'white' }}>
            {destination.name}
          </Title>
        </div>
      </DestinationImage>

      <Stack p="xl" gap="md">
        <Text c="dimmed" style={{ lineHeight: 1.72 }}>
          {destination.summary}
        </Text>

        <Group gap="xs">
          {destination.bestFor.map((item) => (
            <Badge key={item} color="sun" variant="light" radius="xl" c="#5a420b">
              {item}
            </Badge>
          ))}
        </Group>

        <Group justify="space-between" align="center" wrap="wrap">
          <Text fw={700} c="forest.8">
            {typeof placeCount === 'number'
              ? t('common.attractionsCount', { count: placeCount })
              : t('common.curatedDestination')}
          </Text>
          <Button component={Link} to={`/destinations/${destination.slug}`} color="sun" c="#2d2208">
            {t('common.exploreDestination')}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
