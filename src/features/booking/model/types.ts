export type BookingSourceType = 'service' | 'guide' | 'route' | 'hotel';
export type BookingContactMethod = 'phone' | 'telegram' | 'email';
export type PaymentPreference = 'visa' | 'humo';

export interface BookingSourceSummary {
  type: BookingSourceType;
  id: string;
  title: string;
  subtitle: string;
  city?: string;
  note?: string;
  image?: string;
  priceLabel?: string;
}

export interface BookingTravelerDetails {
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  checkOutDate: string;
  guests: number;
  contactMethod: BookingContactMethod;
  note: string;
}

export interface BookingDraft {
  source: BookingSourceSummary;
  originPath?: string;
  traveler: BookingTravelerDetails;
  paymentPreference?: PaymentPreference;
  createdAt: string;
  updatedAt: string;
}

export interface BookingConfirmationRecord {
  reference: string;
  source: BookingSourceSummary;
  traveler: BookingTravelerDetails;
  paymentPreference: PaymentPreference;
  createdAt: string;
  status: 'pending-support';
  originPath?: string;
}

export interface BookingEntryState {
  seed: BookingSourceSummary;
  originPath?: string;
}
