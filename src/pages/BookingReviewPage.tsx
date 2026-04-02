import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { StatePanel } from '../components/layout/StatePanel';
import { startProtectedAction } from '../features/auth/lib/startProtectedAction';
import { getBookingDraft } from '../features/booking/model/bookingDraft';
import { BookingFlowShell } from '../features/booking/ui/BookingFlowShell';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';

export function BookingReviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const draft = getBookingDraft();
  const isHotelBooking = draft?.source.type === 'hotel';

  if (!draft) {
    return (
      <BookingFlowShell
        step={2}
        eyebrow={t('pages.booking.review.eyebrow')}
        title={t('pages.booking.review.title')}
        description={t('pages.booking.review.description')}
        backTo={routePaths.appBookingDetails}
        backLabel={t('pages.booking.common.backToBooking')}
      >
        <StatePanel
          badge={t('pages.booking.empty.badge')}
          title={t('pages.booking.empty.title')}
          description={t('pages.booking.empty.description')}
          actions={
            <Button component={Link} to={routePaths.appServices} color="forest">
              {t('layout.navigation.services')}
            </Button>
          }
        />
      </BookingFlowShell>
    );
  }

  return (
    <BookingFlowShell
      step={2}
      eyebrow={t('pages.booking.review.eyebrow')}
      title={t('pages.booking.review.title')}
      description={t('pages.booking.review.description')}
      backTo={routePaths.appBookingDetails}
      backLabel={t('pages.booking.common.backToBooking')}
    >
      <Paper withBorder radius={publicUi.radius.card} p="md" bg={publicUi.background.surfaceWarm}>
        <Stack gap={8}>
          <Badge color="forest" variant="light" radius="xl" w="fit-content">
            {t(`pages.booking.source.${draft.source.type}`)}
          </Badge>
          <Text fw={700}>{draft.source.title}</Text>
          <Text size="sm" c="dimmed">{draft.source.subtitle}</Text>
          <Text size="sm" c="dimmed">
            {[draft.source.city, draft.source.note].filter(Boolean).join(' · ')}
          </Text>
          {draft.source.priceLabel ? (
            <Text size="sm" fw={700} c="sun.8">{draft.source.priceLabel}</Text>
          ) : null}
        </Stack>
      </Paper>

      <Paper withBorder radius={publicUi.radius.card} p="md" bg="white">
        <Stack gap="sm">
          <Text fw={700}>{t('pages.booking.review.travelerTitle')}</Text>
          <Text size="sm" c="dimmed">{draft.traveler.fullName}</Text>
          <Text size="sm" c="dimmed">{draft.traveler.email}</Text>
          <Text size="sm" c="dimmed">{draft.traveler.phone}</Text>
          <Group gap="xs" wrap="wrap">
            <Badge color="sun" variant="light" radius="xl" c="#5a420b">
              {isHotelBooking
                ? t('pages.booking.review.checkIn', {
                    defaultValue: 'Check-in {{date}}',
                    date: draft.traveler.travelDate,
                  })
                : draft.traveler.travelDate}
            </Badge>
            {isHotelBooking ? (
              <Badge color="sun" variant="light" radius="xl" c="#5a420b">
                {t('pages.booking.review.checkOut', {
                  defaultValue: 'Check-out {{date}}',
                  date: draft.traveler.checkOutDate,
                })}
              </Badge>
            ) : null}
            <Badge color="forest" variant="light" radius="xl">
              {t('pages.booking.review.guests', { count: draft.traveler.guests })}
            </Badge>
            <Badge color="gray" variant="light" radius="xl">
              {t(`pages.booking.contact.${draft.traveler.contactMethod}`)}
            </Badge>
          </Group>
          {draft.traveler.note ? (
            <Text size="sm" c="dimmed">
              {draft.traveler.note}
            </Text>
          ) : null}
        </Stack>
      </Paper>

      <Paper withBorder radius={publicUi.radius.card} p="md" bg={publicUi.background.surfaceWarm}>
        <Stack gap={6}>
          <Text fw={700}>{t('pages.booking.review.mvpTitle')}</Text>
          <Text size="sm" c="dimmed">
            {isHotelBooking
              ? t('pages.booking.review.hotelDescription', {
                  defaultValue:
                    'Baramiz sends this hotel request as an MVP reservation lead, then local support confirms room details and final availability.',
                })
              : t('pages.booking.review.mvpDescription')}
          </Text>
        </Stack>
      </Paper>

      <Button
        color="sun"
        c="#2d2208"
        radius="xl"
        size="lg"
        onClick={() =>
          startProtectedAction(navigate, {
            reason: 'payment',
            redirectTo: routePaths.appPaymentMethods,
            sourcePath: routePaths.appBookingReview,
          })
        }
      >
        {t('pages.booking.review.continue')}
      </Button>
    </BookingFlowShell>
  );
}
