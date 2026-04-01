export interface GuideContact {
  label: string;
  href: string;
  method: 'phone' | 'telegram' | 'email';
}

export interface GuideProfile {
  id: string;
  name: string;
  city: string;
  availableCities: string[];
  languages: string[];
  specialties: string[];
  regionExpertise: string[];
  availability: string;
  shortBio: string;
  contact: GuideContact;
  image: string;
}
