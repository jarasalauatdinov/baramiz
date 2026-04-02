import { useState } from 'react';
import { Alert, Badge, Button, Paper, Radio, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  completeBookingRequest,
  getBookingDraft,
} from '../features/booking/model/bookingDraft';
import type { PaymentPreference } from '../features/booking/model/types';
import { BookingFlowShell } from '../features/booking/ui/BookingFlowShell';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import { StatePanel } from '../components/layout/StatePanel';

export function PaymentMethodPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const draft = getBookingDraft();
  const [paymentPreference, setPaymentPreference] = useState<PaymentPreference>(
    draft?.paymentPreference ?? 'visa',
  );

  if (!draft) {
    return (
      <BookingFlowShell
        step={3}
        eyebrow={t('pages.booking.payment.eyebrow')}
        title={t('pages.booking.payment.title')}
        description={t('pages.booking.payment.description')}
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

  const handleComplete = () => {
    completeBookingRequest(
      {
        ...draft,
        paymentPreference,
      },
      paymentPreference,
    );

    navigate(routePaths.appBookingConfirmation, { replace: true });
  };

  return (
    <BookingFlowShell
      step={3}
      eyebrow={t('pages.booking.payment.eyebrow')}
      title={t('pages.booking.payment.title')}
      description={t('pages.booking.payment.description')}
      backTo={routePaths.appBookingReview}
      backLabel={t('pages.booking.common.backToReview')}
    >
      <Paper withBorder radius={publicUi.radius.card} p="md" bg={publicUi.background.surfaceWarm}>
        <Stack gap={6}>
          <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
            {draft.source.title}
          </Badge>
          <Text size="sm" c="dimmed">{draft.source.subtitle}</Text>
          {draft.source.priceLabel ? <Text size="sm" fw={700} c="sun.8">{draft.source.priceLabel}</Text> : null}
        </Stack>
      </Paper>

      <Radio.Group
        value={paymentPreference}
        onChange={(value) => setPaymentPreference(value as PaymentPreference)}
      >
        <Stack gap="sm">
          <Paper withBorder radius={publicUi.radius.cardInner} p="md" bg="white">
            <Radio value="visa" label={t('pages.booking.payment.methods.visa')} />
          </Paper>
          <Paper withBorder radius={publicUi.radius.cardInner} p="md" bg="white">
            <Radio value="humo" label={t('pages.booking.payment.methods.humo')} />
          </Paper>
        </Stack>
      </Radio.Group>

      <Alert color="yellow" variant="light">
        {t('pages.booking.payment.mvpNotice')}
      </Alert>

      <Button color="sun" c="#2d2208" radius="xl" size="lg" onClick={handleComplete}>
        {t('pages.booking.payment.confirm')}
      </Button>
    </BookingFlowShell>
  );
}
