import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import { DestinationImage } from './DestinationImage';
import { publicUi } from '../shared/config/publicUi';

interface PlaceCardProps {
  place: Place;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      radius={publicUi.radius.card}
      withBorder
      padding={0}
      shadow="xs"
      h="100%"
      style={{
        overflow: 'hidden',
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Card.Section>
        <DestinationImage
          src={place.imageUrl}
          name={place.name}
          city={place.city}
          category={place.categoryName}
          aspectRatio="4 / 3"
          height="auto"
          radius={0}
        >
          <Group
            gap="xs"
            justify="space-between"
            wrap="nowrap"
            style={{ position: 'absolute', top: 18, left: 18, right: 18, zIndex: 1 }}
          >
            <Badge variant="filled" radius="xl" color="sun" c="#5a420b">
              {place.city ?? t('common.unknownCity')}
            </Badge>
            {place.featured ? (
              <Badge variant="filled" radius="xl" color="forest">
                {t('common.featured')}
              </Badge>
            ) : null}
          </Group>

          <div
            style={{
              position: 'absolute',
              left: 18,
              right: 18,
              bottom: 18,
              zIndex: 1,
              color: 'white',
            }}
          >
            <Text size="xs" fw={700} style={{ letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.88 }}>
              {formatCategoryLabel(place.categoryName, t)}
            </Text>
            <Title order={3} style={{ marginTop: 6, color: 'white', lineHeight: 1.2 }}>
              {place.name}
            </Title>
          </div>
        </DestinationImage>
      </Card.Section>

      <Stack gap="md" p="xl" justify="space-between" style={{ flex: 1 }}>
        <Text c="dimmed" style={{ lineHeight: 1.72 }}>
          {place.description ?? t('common.placeDescriptionFallback')}
        </Text>

        <Group justify="space-between" gap="sm" wrap="wrap">
          <Badge variant="light" radius="xl" color="sun" c="#5a420b">
            {formatMinutesLabel(place.durationMinutes, t)}
          </Badge>
          {place.region ? (
            <Text fw={700} c="forest.8">
              {place.region}
            </Text>
          ) : null}
        </Group>
      </Stack>
    </Card>
  );
}
