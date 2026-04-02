import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { publicUi } from '../../../shared/config/publicUi';
import { DestinationImage } from '../../../shared/ui';
import type { HotelStay } from '../model/types';

interface HotelCardProps {
  hotel: HotelStay;
  detailsTo: string;
  onBook: () => void;
}

export function HotelCard({ hotel, detailsTo, onBook }: HotelCardProps) {
  const { t } = useTranslation();

  return (
    <Paper
      withBorder
      radius={publicUi.radius.card}
      p="sm"
      bg="white"
      h="100%"
      style={{
        borderColor: publicUi.border.default,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Stack gap="md" h="100%">
        <DestinationImage
          src={hotel.images[0]}
          name={hotel.name}
          city={hotel.city}
          category="Hotel"
          height={210}
          radius={22}
        >
          <Group
            justify="space-between"
            align="flex-end"
            style={{ position: 'absolute', inset: 0, padding: 16 }}
          >
            <Badge color="sun" variant="filled" radius="xl" c="#2d2208">
              {t('pages.hotels.card.priceFrom', {
                defaultValue: 'From ${{price}} / night',
                price: hotel.priceFrom,
              })}
            </Badge>
            <Badge color="dark" variant="filled" radius="xl">
              {t('pages.hotels.card.rating', {
                defaultValue: '{{rating}} rating',
                rating: hotel.rating.toFixed(1),
              })}
            </Badge>
          </Group>
        </DestinationImage>

        <Stack gap={8} style={{ flex: 1 }}>
          <div>
            <Text size="xs" fw={700} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
              {hotel.city}
            </Text>
            <Title order={3} size="h4" mt={8} style={{ lineHeight: 1.2 }}>
              {hotel.name}
            </Title>
          </div>

          <Text size="sm" c="dimmed">
            {hotel.location}
          </Text>

          <Text size="sm" c="dimmed" style={{ lineHeight: 1.65 }} lineClamp={2}>
            {hotel.shortDescription}
          </Text>

          <Group gap="xs" wrap="wrap">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} color="gray" variant="light" radius="xl">
                {amenity}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Group grow>
          <Button component={Link} to={detailsTo} variant="light" color="forest" radius="xl">
            {t('pages.hotels.card.view', { defaultValue: 'View details' })}
          </Button>
          <Button color="sun" c="#2d2208" radius="xl" onClick={onBook}>
            {t('pages.hotels.card.book', { defaultValue: 'Book' })}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
