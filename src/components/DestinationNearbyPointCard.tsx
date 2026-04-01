import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { DestinationNearbyPoint } from '../entities/destination/model/types';
import { buildGoogleMapsPlaceUrl } from '../shared/lib/map/geo';
import { publicUi } from '../shared/config/publicUi';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import { DestinationImage } from './DestinationImage';

interface DestinationNearbyPointCardProps {
  point: DestinationNearbyPoint;
}

export function DestinationNearbyPointCard({ point }: DestinationNearbyPointCardProps) {
  const { t } = useTranslation();

  return (
    <Paper
      withBorder
      radius={publicUi.radius.card}
      style={{
        overflow: 'hidden',
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <DestinationImage
        src={point.image}
        name={point.title}
        category={point.category}
        aspectRatio="16 / 10"
        height="auto"
        radius={0}
      />

      <Stack p="lg" gap="md">
        <Group gap="xs" wrap="wrap">
          <Badge color="forest" variant="light" radius="xl">
            {formatCategoryLabel(point.category, t)}
          </Badge>
          <Badge color="sun" variant="light" radius="xl" c="#5a420b">
            {formatMinutesLabel(point.estimatedVisitMinutes, t)}
          </Badge>
        </Group>

        <div>
          <Title order={3} size="h4">
            {point.title}
          </Title>
          <Text c="dimmed" mt={8} style={{ lineHeight: 1.68 }}>
            {point.description}
          </Text>
        </div>

        <Group gap="xs" wrap="wrap">
          {point.tags.map((tag) => (
            <Badge key={tag} color="gray" variant="light" radius="xl">
              {tag}
            </Badge>
          ))}
        </Group>

        <Button
          component="a"
          href={buildGoogleMapsPlaceUrl(point.coordinates)}
          target="_blank"
          rel="noreferrer"
          variant="light"
          color="forest"
        >
          {t('destinationPage.nearby.openMap', { defaultValue: 'Open point on map' })}
        </Button>
      </Stack>
    </Paper>
  );
}
