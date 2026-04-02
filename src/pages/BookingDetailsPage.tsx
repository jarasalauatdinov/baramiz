import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  NumberInput,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { StatePanel } from '../components/layout/StatePanel';
import { getAuthSession } from '../features/auth/model/session';
import {
  createBookingDraft,
  getBookingDraft,
  readBookingEntryState,
  saveBookingDraft,
} from '../features/booking/model/bookingDraft';
import type { BookingDraft } from '../features/booking/model/types';
import { BookingFlowShell } from '../features/booking/ui/BookingFlowShell';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';

export function BookingDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const authSession = useMemo(() => getAuthSession(), []);
  const entryState = useMemo(() => readBookingEntryState(location.state), [location.state]);
  const [draft, setDraft] = useState<BookingDraft | null>(() => getBookingDraft());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entryState?.seed) {
      setDraft((current) => {
        if (
          current &&
          current.source.id === entryState.seed.id &&
          current.source.type === entryState.seed.type &&
          current.originPath === entryState.originPath
        ) {
          return current;
        }

        const nextDraft = createBookingDraft(entryState.seed, authSession, entryState.originPath);
        saveBookingDraft(nextDraft);
        return nextDraft;
      });
      return;
    }

    if (!entryState?.seed && !draft) {
      setDraft(getBookingDraft());
    }
  }, [authSession, draft, entryState]);

  const source = draft?.source ?? null;
  const isHotelBooking = source?.type === 'hotel';

  const updateTraveler = <K extends keyof BookingDraft['traveler']>(
    key: K,
    value: BookingDraft['traveler'][K],
  ) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            traveler: {
              ...current.traveler,
              [key]: value,
            },
          }
        : current,
    );
  };

  const handleContinue = () => {
    if (!draft) {
      return;
    }

    const isBaseInfoMissing =
      !draft.traveler.fullName.trim() ||
      !draft.traveler.email.trim() ||
      !draft.traveler.phone.trim() ||
      !draft.traveler.travelDate.trim();

    const hasInvalidHotelDates =
      isHotelBooking &&
      (!draft.traveler.checkOutDate.trim() ||
        new Date(draft.traveler.checkOutDate).getTime() <= new Date(draft.traveler.travelDate).getTime());

    if (isBaseInfoMissing || hasInvalidHotelDates) {
      setError(
        isHotelBooking
          ? t('pages.booking.details.hotelValidation', {
              defaultValue: 'Add check-in, check-out, traveler details, and phone before continuing.',
            })
          : t('pages.booking.details.validation'),
      );
      return;
    }

    saveBookingDraft(draft);
    navigate(routePaths.appBookingReview);
  };

  if (!draft || !source) {
    return (
      <BookingFlowShell
        step={1}
        eyebrow={t('pages.booking.details.eyebrow')}
        title={t('pages.booking.details.title')}
        description={t('pages.booking.details.description')}
        backTo={routePaths.appServices}
        backLabel={t('pages.booking.common.backToBrowse')}
      >
        <StatePanel
          badge={t('pages.booking.empty.badge')}
          title={t('pages.booking.empty.title')}
          description={t('pages.booking.empty.description')}
          actions={
            <>
              <Button component={Link} to={routePaths.appServices} color="forest">
                {t('layout.navigation.services')}
              </Button>
              <Button component={Link} to={routePaths.appTripHotels} variant="light" color="forest">
                {t('pages.hotels.list.badge', { defaultValue: 'Trip stays' })}
              </Button>
            </>
          }
        />
      </BookingFlowShell>
    );
  }

  return (
    <BookingFlowShell
      step={1}
      eyebrow={t('pages.booking.details.eyebrow')}
      title={t('pages.booking.details.title')}
      description={t('pages.booking.details.description')}
      backTo={draft.originPath ?? routePaths.appServices}
      backLabel={t('pages.booking.common.backToBrowse')}
    >
      <Paper
        withBorder
        radius={publicUi.radius.card}
        p="md"
        bg={publicUi.background.surfaceWarm}
        style={{ borderColor: publicUi.border.soft }}
      >
        <Stack gap={8}>
          <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
            {t(`pages.booking.source.${source.type}`)}
          </Badge>
          <Text fw={700}>{source.title}</Text>
          <Text size="sm" c="dimmed">
            {source.subtitle}
          </Text>
          {source.city || source.note ? (
            <Text size="sm" c="dimmed">
              {[source.city, source.note].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
          {source.priceLabel ? (
            <Text size="sm" fw={700} c="sun.8">
              {source.priceLabel}
            </Text>
          ) : null}
        </Stack>
      </Paper>

      {error ? <Alert color="red" variant="light">{error}</Alert> : null}

      <Stack gap="md">
        <TextInput
          label={t('pages.auth.fields.fullName')}
          value={draft.traveler.fullName}
          onChange={(event) => updateTraveler('fullName', event.currentTarget.value)}
          radius="xl"
        />
        <TextInput
          label={t('pages.auth.fields.email')}
          type="email"
          value={draft.traveler.email}
          onChange={(event) => updateTraveler('email', event.currentTarget.value)}
          radius="xl"
        />
        <TextInput
          label={t('pages.booking.fields.phone')}
          placeholder="+998 90 123 45 67"
          value={draft.traveler.phone}
          onChange={(event) => updateTraveler('phone', event.currentTarget.value)}
          radius="xl"
        />
        <TextInput
          label={
            isHotelBooking
              ? t('pages.booking.fields.travelDate', { defaultValue: 'Check-in date' })
              : t('pages.booking.fields.travelDate')
          }
          type="date"
          value={draft.traveler.travelDate}
          onChange={(event) => updateTraveler('travelDate', event.currentTarget.value)}
          radius="xl"
        />
        {isHotelBooking ? (
          <TextInput
            label={t('pages.booking.fields.checkOutDate', { defaultValue: 'Check-out date' })}
            type="date"
            value={draft.traveler.checkOutDate}
            onChange={(event) => updateTraveler('checkOutDate', event.currentTarget.value)}
            radius="xl"
          />
        ) : null}
        <NumberInput
          label={t('pages.booking.fields.guests')}
          value={draft.traveler.guests}
          min={1}
          max={12}
          onChange={(value) => updateTraveler('guests', Number(value) || 1)}
          radius="xl"
        />

        <Stack gap={6}>
          <Text fw={600} size="sm">
            {t('pages.booking.fields.contactMethod')}
          </Text>
          <SegmentedControl
            radius="xl"
            fullWidth
            value={draft.traveler.contactMethod}
            onChange={(value) =>
              updateTraveler('contactMethod', value as BookingDraft['traveler']['contactMethod'])
            }
            data={[
              { label: t('pages.booking.contact.phone'), value: 'phone' },
              { label: t('pages.booking.contact.telegram'), value: 'telegram' },
              { label: t('pages.booking.contact.email'), value: 'email' },
            ]}
          />
        </Stack>

        <Textarea
          label={t('pages.booking.fields.note')}
          minRows={3}
          value={draft.traveler.note}
          onChange={(event) => updateTraveler('note', event.currentTarget.value)}
          radius="xl"
        />
      </Stack>

      <Button color="sun" c="#2d2208" radius="xl" size="lg" onClick={handleContinue}>
        {t('pages.booking.details.continue')}
      </Button>
    </BookingFlowShell>
  );
}
