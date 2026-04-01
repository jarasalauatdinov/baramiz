export interface ServiceCardData {
  id?: string;
  title: string;
  description: string;
  meta: string;
  tags: string[];
  city?: string;
  region?: string;
  availableCities?: string[];
  contactLabel?: string;
  contactHref?: string;
  availability?: string;
  note?: string;
}

export type ServiceSectionId =
  | 'agencies'
  | 'accommodation'
  | 'transport'
  | 'food'
  | 'experiences'
  | 'tickets'
  | 'tour_support';

export type ServiceKind = ServiceSectionId | 'guides';

export interface ServiceSection {
  id: ServiceSectionId;
  title: string;
  description: string;
  items: ServiceCardData[];
}

export interface ServiceSectionCopy {
  title: string;
  description: string;
}

export interface ServiceCatalogEntry extends ServiceCardData {
  id: string;
  kind: ServiceSectionId;
}
