import { Badge, Button, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DestinationImage, StatePanel } from '../shared/ui';
import { getHotelBySlug } from '../entities/hotel';
import { createHotelBookingSource } from '../features/booking/model/bookingDraft';
import { startProtectedAction } from '../features/auth/lib/startProtectedAction';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import { getCurrentRouteResult } from '../features/route-planning/model/currentRoute';

export function HotelDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug = '' } = useParams();
  const hotel = getHotelBySlug(slug);
  const currentRoute = getCurrentRouteResult();

  if (!hotel) {
    return (
      <Container size="lg" py={{ base: 20, md: 28 }}>
        <StatePanel
          badge={t('pages.hotels.details.badge', { defaultValue: 'Hotel details' })}
          title={t('pages.hotels.details.emptyTitle', { defaultValue: 'This hotel is not available right now' })}
          description={t('pages.hotels.details.emptyDescription', {
            defaultValue: 'Open the trip hotel list again to choose another stay for your route.',
          })}
          actions={
            <>
              <Button component={Link} to={routePaths.appTripHotels} color="sun" c="#2d2208">
                {t('pages.hotels.details.back', { defaultValue: 'Back to hotels' })}
              </Button>
              <Button component={Link} to={routePaths.appRouteResult} variant="light" color="forest">
                {t('common.goToRoute')}
              </Button>
            </>
          }
        />
      </Container>
    );
  }

  const handleBook = () => {
    startProtectedAction(navigate, {
      reason: 'booking',
      redirectTo: routePaths.appBookingDetails,
      redirectState: {
        seed: createHotelBookingSource(hotel),
        originPath: routePaths.appHotelDetails(hotel.slug),
      },
      sourcePath: routePaths.appHotelDetails(hotel.slug),
    });
  };

  return (
    <Container size="lg" py={{ base: 16, md: 24 }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center" wrap="wrap">
          <Button component={Link} to={routePaths.appTripHotels} variant="subtle" color="forest" radius="xl">
            {t('pages.hotels.details.back', { defaultValue: 'Back to hotels' })}
          </Button>
          {currentRoute ? (
            <Badge color="forest" variant="light" radius="xl">
              {t('pages.hotels.details.tripBadge', {
                defaultValue: 'Matched for {{city}} route',
                city: currentRoute.route.city,
              })}
            </Badge>
          ) : null}
        </Group>

        <Paper
          withBorder
          radius={publicUi.radius.card}
          p="sm"
          bg="white"
          style={{ borderColor: publicUi.border.default, boxShadow: publicUi.shadow.cardSoft }}
        >
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            <DestinationImage
              src={hotel.images[0]}
              name={hotel.name}
              city={hotel.city}
              category="Hotel"
              height={420}
              radius={22}
            />
            <Stack gap="sm">
              <DestinationImage
                src={hotel.images[1]}
                name={`${hotel.name} lounge`}
                city={hotel.city}
                category="Hotel"
                height={200}
                radius={22}
              />
              <DestinationImage
                src={hotel.images[2]}
                name={`${hotel.name} room`}
                city={hotel.city}
                category="Hotel"
                height={200}
                radius={22}
              />
            </Stack>
          </SimpleGrid>
        </Paper>

        <Paper
          withBorder
          radius={publicUi.radius.card}
          p="lg"
          bg={publicUi.background.surfaceWarm}
          style={{ borderColor: publicUi.border.default, boxShadow: publicUi.shadow.cardSoft }}
        >
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Stack gap={8} maw={560}>
                <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                  {t('pages.hotels.details.badge', { defaultValue: 'Hotel details' })}
                </Badge>
                <Title order={1} style={{ lineHeight: 1.08 }}>
                  {hotel.name}
                </Title>
                <Text c="dimmed">{hotel.location}</Text>
              </Stack>

              <Stack gap={6} align="flex-end">
                <Badge color="dark" variant="filled" radius="xl">
                  {t('pages.hotels.card.rating', {
                    defaultValue: '{{rating}} rating',
                    rating: hotel.rating.toFixed(1),
                  })}
                </Badge>
                <Badge color="sun" variant="filled" radius="xl" c="#2d2208">
                  {t('pages.hotels.card.priceFrom', {
                    defaultValue: 'From ${{price}} / night',
                    price: hotel.priceFrom,
                  })}
                </Badge>
              </Stack>
            </Group>

            <Text style={{ lineHeight: 1.72 }}>{hotel.description}</Text>

            <Stack gap="sm">
              <Text fw={800}>{t('pages.hotels.details.amenitiesTitle', { defaultValue: 'Amenities' })}</Text>
              <Group gap="xs" wrap="wrap">
                {hotel.amenities.map((amenity) => (
                  <Badge key={amenity} color="gray" variant="light" radius="xl">
                    {amenity}
                  </Badge>
                ))}
              </Group>
            </Stack>

            <Group grow>
              <Button color="sun" c="#2d2208" radius="xl" size="lg" onClick={handleBook}>
                {t('pages.hotels.details.book', { defaultValue: 'Book' })}
              </Button>
              <Button component={Link} to={routePaths.appRouteResult} variant="light" color="forest" radius="xl">
                {t('common.goToRoute')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

