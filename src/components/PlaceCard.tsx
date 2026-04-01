import { Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Place } from '../types/api';
import { formatCategoryLabel, formatMinutesLabel } from '../utils/placeArtwork';
import { DestinationImage } from './DestinationImage';
import { publicUi } from '../shared/config/publicUi';
import { routePaths } from '../router/paths';

interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'immersive';
}

export function PlaceCard({ place, variant = 'default' }: PlaceCardProps) {
  const { t } = useTranslation();
  const isImmersive = variant === 'immersive';

  return (
    <Card
      radius={publicUi.radius.card}
      withBorder
      padding={0}
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
          category={place.category}
          aspectRatio={isImmersive ? '4 / 5' : '16 / 11'}
          height="auto"
          radius={0}
        >
          <Group
            gap="xs"
            justify="space-between"
            wrap="nowrap"
            style={{ position: 'absolute', top: 14, left: 14, right: 14, zIndex: 1 }}
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
              left: 14,
              right: 14,
              bottom: 14,
              zIndex: 1,
              color: 'white',
            }}
          >
            <Text size="xs" fw={700} style={{ letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.88 }}>
              {formatCategoryLabel(place.category, t)}
            </Text>
            <Title order={3} style={{ marginTop: 6, color: 'white', lineHeight: 1.2 }}>
              {place.name}
            </Title>
          </div>
        </DestinationImage>
      </Card.Section>

      <Stack gap="md" p={{ base: 'md', md: 'xl' }} justify="space-between" style={{ flex: 1 }}>
        {!isImmersive ? (
          <Text c="dimmed" size="sm" style={{ lineHeight: 1.72 }}>
            {place.description ?? t('common.placeDescriptionFallback')}
          </Text>
        ) : null}

        <Group justify="space-between" gap="sm" wrap="wrap">
          <Badge variant="light" radius="xl" color="sun" c="#5a420b">
            {formatMinutesLabel(place.durationMinutes, t)}
          </Badge>
          {place.region ? (
            <Text fw={700} size="sm" c="forest.8">
              {place.region}
            </Text>
          ) : null}
        </Group>

        <Button
          component={Link}
          to={routePaths.appPlaceDetails(String(place.id))}
          variant="light"
          color={isImmersive ? 'sun' : 'forest'}
          c={isImmersive ? '#2d2208' : undefined}
          radius="xl"
          fullWidth
        >
          {isImmersive
            ? t('common.explorePlace', { defaultValue: 'Explore place' })
            : t('common.viewDetails', { defaultValue: 'View details' })}
        </Button>
      </Stack>
    </Card>
  );
}
