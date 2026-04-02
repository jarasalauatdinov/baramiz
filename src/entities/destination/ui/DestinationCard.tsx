import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { DestinationConfig } from '../model/types';
import { routePaths } from '../../../router/paths';
import { publicUi } from '../../../shared/config/publicUi';
import { formatCategoryLabel, formatMinutesLabel } from '../../place/lib/presentation';
import { DestinationImage } from '../../../shared/ui';

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
        city={destination.city}
        category={destination.heroCategory}
        aspectRatio="16 / 11"
        height="auto"
        radius={0}
      >
        <div style={{ position: 'absolute', inset: 'auto 20px 20px 20px', zIndex: 1, color: 'white' }}>
          <Text size="xs" fw={700} style={{ letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
            {destination.kicker}
          </Text>
          <Title order={3} style={{ marginTop: 6, color: 'white', lineHeight: 1.08 }}>
            {destination.name}
          </Title>
          <Text size="sm" mt={6} c="rgba(255,255,255,0.9)">
            {destination.city}, {destination.region}
          </Text>
        </div>
      </DestinationImage>

      <Stack p={{ base: 'md', md: 'xl' }} gap="md">
        <Group gap="xs" wrap="wrap">
          <Badge color="forest" variant="light" radius="xl">
            {formatCategoryLabel(destination.category, t)}
          </Badge>
          <Badge color="sun" variant="light" radius="xl" c="#5a420b">
            {formatMinutesLabel(destination.estimatedVisitMinutes, t)}
          </Badge>
          <Badge color="gray" variant="light" radius="xl">
            {destination.bestSeason}
          </Badge>
        </Group>

        <Text c="dimmed" size="sm" style={{ lineHeight: 1.72 }}>
          {destination.summary}
        </Text>

        <Group gap="xs" wrap="wrap">
          {destination.tags.map((item) => (
            <Badge key={item} color="sun" variant="light" radius="xl" c="#5a420b">
              {item}
            </Badge>
          ))}
        </Group>

        <Stack gap="sm">
          <div>
            <Text fw={700} size="sm" c="forest.8">
              {typeof placeCount === 'number'
                ? t('common.attractionsCount', { count: placeCount })
                : t('common.curatedDestination')}
            </Text>
            <Text size="sm" c="dimmed" mt={4}>
              {t('destinationsPage.card.nearbyPoints', {
                defaultValue: '{{count}} nearby points ready for planning',
                count: destination.nearbyPoints.length,
              })}
            </Text>
          </div>

          <Button
            component={Link}
            to={routePaths.appDestinationDetails(destination.slug)}
            color="sun"
            c="#2d2208"
            fullWidth
          >
            {t('common.exploreDestination')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
