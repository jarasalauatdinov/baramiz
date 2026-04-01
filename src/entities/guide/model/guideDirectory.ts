import type { GuideProfile } from './types';

const createGuidePortrait = (name: string, accent: string, tone: string): string => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 960">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fff8ea" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="800" height="960" fill="url(#bg)"/>
      <circle cx="400" cy="308" r="126" fill="${tone}"/>
      <path d="M198 826c18-168 118-254 202-254s184 86 202 254" fill="#1f3f31" opacity="0.94"/>
      <path d="M312 212c24-68 150-92 216 10 16 24 24 54 24 84-18-30-56-48-110-48-56 0-96 16-130 46-8-34-8-60 0-92z" fill="#16271f"/>
      <circle cx="400" cy="308" r="126" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="8"/>
      <rect x="56" y="54" width="120" height="44" rx="22" fill="rgba(255,255,255,0.78)"/>
      <text x="94" y="84" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="700" fill="#1d3a2f">${initials}</text>
      <text x="56" y="910" font-family="Manrope, Arial, sans-serif" font-size="24" fill="#254536">Baramiz local guide</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const guideProfiles: GuideProfile[] = [
  {
    id: 'gulzada-esenova',
    name: 'Gulzada Esenova',
    city: 'Nukus',
    availableCities: ['Nukus', 'Mizdakhan'],
    languages: ['KAA', 'UZ', 'RU'],
    specialties: ['Museums', 'Art history', 'City tours'],
    regionExpertise: ['Nukus museums', 'Cultural institutions', 'Urban visitor flow'],
    availability: 'Daily city routes',
    shortBio: 'Museum-focused guide for visitors who want a clear cultural route with local interpretation and practical pacing.',
    contact: {
      label: '+998 90 321 14 22',
      href: 'tel:+998903211422',
      method: 'phone',
    },
    image: createGuidePortrait('Gulzada Esenova', '#e6bb57', '#d7b294'),
  },
  {
    id: 'timur-bekniyazov',
    name: 'Timur Bekniyazov',
    city: 'Moynaq',
    availableCities: ['Moynaq', 'Qonirat'],
    languages: ['UZ', 'RU', 'EN'],
    specialties: ['Aral Sea region', 'Photography', 'Story-led routes'],
    regionExpertise: ['Moynaq', 'Aral Sea story', 'Visitor logistics'],
    availability: 'By prior request',
    shortBio: 'Regional guide for travelers who want Moynaq to feel more meaningful than a single photo stop.',
    contact: {
      label: '@timur_aralguide',
      href: 'https://t.me/timur_aralguide',
      method: 'telegram',
    },
    image: createGuidePortrait('Timur Bekniyazov', '#d8a84a', '#b68767'),
  },
  {
    id: 'ayim-rakhimova',
    name: 'Ayim Rakhimova',
    city: 'Ellikqala',
    availableCities: ['Ellikqala', 'Nukus'],
    languages: ['KAA', 'UZ', 'EN'],
    specialties: ['Fortresses', 'Family routes', 'Cultural heritage'],
    regionExpertise: ['Ayaz Kala', 'Topraq Kala', 'Fortress routes'],
    availability: 'Day-route guiding',
    shortBio: 'A strong guide option for fortress routes, family travelers, and visitors who want heritage context on the move.',
    contact: {
      label: '+998 93 555 20 11',
      href: 'tel:+998935552011',
      method: 'phone',
    },
    image: createGuidePortrait('Ayim Rakhimova', '#f1ca72', '#d8b79d'),
  },
  {
    id: 'bekzod-sultanov',
    name: 'Bekzod Sultanov',
    city: 'Qonirat',
    availableCities: ['Qonirat', 'Moynaq', 'Ustyurt'],
    languages: ['UZ', 'RU', 'EN'],
    specialties: ['Regional logistics', 'Road trips', 'Remote landscapes'],
    regionExpertise: ['Ustyurt routes', 'Remote access', 'Driver coordination'],
    availability: 'Flexible regional support',
    shortBio: 'Useful for independent travelers who need a local expert for movement, timing, and remote destination planning.',
    contact: {
      label: 'routes@baramiz.uz',
      href: 'mailto:routes@baramiz.uz',
      method: 'email',
    },
    image: createGuidePortrait('Bekzod Sultanov', '#d9b466', '#bf9778'),
  },
  {
    id: 'shirin-utanova',
    name: 'Shirin Utanova',
    city: 'Nukus',
    availableCities: ['Nukus', 'Moynaq', 'Ellikqala'],
    languages: ['KAA', 'RU', 'EN'],
    specialties: ['Delegation visits', 'Culture routes', 'Travel coordination'],
    regionExpertise: ['Official visits', 'Cross-destination planning', 'Guest support'],
    availability: 'Scheduled support',
    shortBio: 'A practical guide for hosted visits, competition demos, and travelers who prefer assisted planning across multiple destinations.',
    contact: {
      label: '@baramiz_shirin',
      href: 'https://t.me/baramiz_shirin',
      method: 'telegram',
    },
    image: createGuidePortrait('Shirin Utanova', '#e7c47b', '#cfa98b'),
  },
];

export const getGuideCityOptions = () =>
  Array.from(new Set(guideProfiles.flatMap((guide) => guide.availableCities))).sort((left, right) =>
    left.localeCompare(right),
  );

export const getGuideSpecialtyOptions = () =>
  Array.from(new Set(guideProfiles.flatMap((guide) => guide.specialties))).sort((left, right) =>
    left.localeCompare(right),
  );

