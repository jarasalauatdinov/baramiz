import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StatePanel } from '../components/layout/StatePanel';
import {
  getBookingConfirmation,
} from '../features/booking/model/bookingDraft';
import { BookingFlowShell } from '../features/booking/ui/BookingFlowShell';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';

export function BookingConfirmationPage() {
  const { t } = useTranslation();
  const confirmation = getBookingConfirmation();

  if (!confirmation) {
    return (
      <BookingFlowShell
        step={4}
        eyebrow={t('pages.booking.confirmation.eyebrow')}
        title={t('pages.booking.confirmation.title')}
        description={t('pages.booking.confirmation.description')}
        backTo={routePaths.appServices}
        backLabel={t('pages.booking.common.backToBrowse')}
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

  const backTo =
    confirmation.originPath ??
    (confirmation.source.type === 'route'
      ? routePaths.appRouteResult
      : confirmation.source.type === 'hotel'
        ? routePaths.appTripHotels
        : routePaths.appHome);

  const secondaryLink =
    confirmation.source.type === 'hotel'
      ? { to: routePaths.appTripHotels, label: t('pages.hotels.details.back', { defaultValue: 'Back to hotels' }) }
      : confirmation.source.type === 'route'
        ? { to: routePaths.appRouteResult, label: t('common.goToRoute') }
        : { to: routePaths.appServices, label: t('layout.navigation.services') };

  return (
    <BookingFlowShell
      step={4}
      eyebrow={t('pages.booking.confirmation.eyebrow')}
      title={t('pages.booking.confirmation.title')}
      description={t('pages.booking.confirmation.description')}
      backTo={backTo}
      backLabel={t('pages.booking.confirmation.back')}
    >
      <Paper withBorder radius={publicUi.radius.card} p="md" bg={publicUi.background.surfaceWarm}>
        <Stack gap="sm">
          <Badge color="forest" variant="light" radius="xl" w="fit-content">
            {t('pages.booking.confirmation.pending')}
          </Badge>
          <Text fw={700}>{confirmation.source.title}</Text>
          <Text size="sm" c="dimmed">
            {t('pages.booking.confirmation.reference')}: {confirmation.reference}
          </Text>
          <Group gap="xs" wrap="wrap">
            <Badge color="sun" variant="light" radius="xl" c="#5a420b">
              {t(`pages.booking.payment.methods.${confirmation.paymentPreference}`)}
            </Badge>
            <Badge color="gray" variant="light" radius="xl">
              {confirmation.traveler.travelDate}
            </Badge>
            {confirmation.source.type === 'hotel' ? (
              <Badge color="gray" variant="light" radius="xl">
                {confirmation.traveler.checkOutDate}
              </Badge>
            ) : null}
          </Group>
        </Stack>
      </Paper>

      <Paper withBorder radius={publicUi.radius.card} p="md" bg="white">
        <Stack gap="xs">
          <Text fw={700}>{t('pages.booking.confirmation.nextTitle')}</Text>
          <Text size="sm" c="dimmed">{t('pages.booking.confirmation.next1')}</Text>
          <Text size="sm" c="dimmed">{t('pages.booking.confirmation.next2')}</Text>
          <Text size="sm" c="dimmed">{t('pages.booking.confirmation.next3')}</Text>
        </Stack>
      </Paper>

      <Group grow>
        <Button component={Link} to={routePaths.appHome} color="sun" c="#2d2208" radius="xl">
          {t('pages.booking.confirmation.home')}
        </Button>
        <Button component={Link} to={secondaryLink.to} variant="light" color="forest" radius="xl">
          {secondaryLink.label}
        </Button>
      </Group>
    </BookingFlowShell>
  );
}
