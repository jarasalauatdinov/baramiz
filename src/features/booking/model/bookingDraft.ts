import type { GuideProfile } from '../../../entities/guide/model/types';
import type { HotelStay } from '../../../entities/hotel';
import type { ServiceCardData, ServiceKind } from '../../../entities/service/model/types';
import type { RoutePlanningResult } from '../../route-planning/model/types';
import type {
  BookingConfirmationRecord,
  BookingDraft,
  BookingEntryState,
  BookingSourceSummary,
  PaymentPreference,
} from './types';
import type { AppAuthSession } from '../../auth/model/session';

const BOOKING_DRAFT_STORAGE_KEY = 'baramiz:booking-draft';
const BOOKING_CONFIRMATION_STORAGE_KEY = 'baramiz:booking-confirmation';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage;
};

const getOffsetDate = (offsetDays: number): string => {
  const next = new Date();
  next.setDate(next.getDate() + offsetDays);
  return next.toISOString().slice(0, 10);
};

export const createServiceBookingSource = (
  item: ServiceCardData,
  kind?: ServiceKind,
): BookingSourceSummary => ({
  type: 'service',
  id: item.id ?? `${kind ?? 'service'}-${item.title.toLowerCase().replace(/\s+/g, '-')}`,
  title: item.title,
  subtitle: item.meta,
  city: item.city ?? item.availableCities?.[0],
  note: item.note,
});

export const createGuideBookingSource = (guide: GuideProfile): BookingSourceSummary => ({
  type: 'guide',
  id: guide.id,
  title: guide.name,
  subtitle: guide.shortBio,
  city: guide.city,
  note: guide.contact.label,
});

export const createRouteBookingSource = (result: RoutePlanningResult): BookingSourceSummary => ({
  type: 'route',
  id: `route-${result.route.city.toLowerCase().replace(/\s+/g, '-')}-${result.route.items.length}`,
  title: `${result.route.city} route support`,
  subtitle: `${result.route.items.length} stops · ${result.route.city}`,
  city: result.route.city,
  note: result.route.items
    .slice(0, 2)
    .map((item) => item.place.name)
    .join(' · '),
});

export const createHotelBookingSource = (hotel: HotelStay): BookingSourceSummary => ({
  type: 'hotel',
  id: hotel.slug,
  title: hotel.name,
  subtitle: hotel.location,
  city: hotel.city,
  image: hotel.images[0],
  priceLabel: `$${hotel.priceFrom} / night`,
  note: `${hotel.rating.toFixed(1)} rating · ${hotel.region}`,
});

export const createBookingDraft = (
  seed: BookingSourceSummary,
  session: AppAuthSession | null,
  originPath?: string,
): BookingDraft => {
  const checkInDate = getOffsetDate(7);

  return {
    source: seed,
    originPath,
    traveler: {
      fullName: session?.user.name ?? '',
      email: session?.user.email ?? '',
      phone: '',
      travelDate: checkInDate,
      checkOutDate: seed.type === 'hotel' ? getOffsetDate(8) : '',
      guests: 1,
      contactMethod: 'phone',
      note: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getBookingDraft = (): BookingDraft | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(BOOKING_DRAFT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as BookingDraft;
  } catch (error) {
    console.error('Failed to read booking draft', error);
    return null;
  }
};

export const saveBookingDraft = (draft: BookingDraft): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      BOOKING_DRAFT_STORAGE_KEY,
      JSON.stringify({
        ...draft,
        updatedAt: new Date().toISOString(),
      } satisfies BookingDraft),
    );
  } catch (error) {
    console.error('Failed to save booking draft', error);
  }
};

export const clearBookingDraft = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear booking draft', error);
  }
};

export const getBookingConfirmation = (): BookingConfirmationRecord | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(BOOKING_CONFIRMATION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as BookingConfirmationRecord;
  } catch (error) {
    console.error('Failed to read booking confirmation', error);
    return null;
  }
};

export const clearBookingConfirmation = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(BOOKING_CONFIRMATION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear booking confirmation', error);
  }
};

export const completeBookingRequest = (
  draft: BookingDraft,
  paymentPreference: PaymentPreference,
): BookingConfirmationRecord => {
  const storage = getStorage();
  const confirmation: BookingConfirmationRecord = {
    reference: `BRM-${Date.now().toString().slice(-8)}`,
    source: draft.source,
    traveler: draft.traveler,
    paymentPreference,
    createdAt: new Date().toISOString(),
    status: 'pending-support',
    originPath: draft.originPath,
  };

  if (storage) {
    try {
      storage.setItem(BOOKING_CONFIRMATION_STORAGE_KEY, JSON.stringify(confirmation));
      storage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to complete booking request', error);
    }
  }

  return confirmation;
};

export const readBookingEntryState = (state: unknown): BookingEntryState | null => {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const candidate = state as Partial<BookingEntryState>;
  if (!candidate.seed) {
    return null;
  }

  return {
    seed: candidate.seed,
    originPath: candidate.originPath,
  };
};
