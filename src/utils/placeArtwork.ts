import { API_ASSET_ORIGIN } from '../shared/config/api';

const PLACEHOLDER_HOSTS = new Set(['placehold.co', 'via.placeholder.com']);

type TranslationFunction = (key: string, options?: Record<string, unknown>) => unknown;

const artworkThemes: Record<
  string,
  { start: string; end: string; accent: string; surface: string; label: string }
> = {
  museum: {
    start: '#21465a',
    end: '#d1a364',
    accent: '#f6ead4',
    surface: '#122b38',
    label: 'Museum route',
  },
  history: {
    start: '#4e3a2d',
    end: '#c99a62',
    accent: '#f1dfc1',
    surface: '#2f231b',
    label: 'History route',
  },
  culture: {
    start: '#24453b',
    end: '#b8824f',
    accent: '#f3e1cb',
    surface: '#173129',
    label: 'Culture route',
  },
  nature: {
    start: '#214738',
    end: '#7dad76',
    accent: '#e7f1dc',
    surface: '#133227',
    label: 'Nature route',
  },
  adventure: {
    start: '#755337',
    end: '#d3a465',
    accent: '#f8e6c7',
    surface: '#432919',
    label: 'Adventure route',
  },
  food: {
    start: '#6a3324',
    end: '#cf8d5d',
    accent: '#fde4c8',
    surface: '#3d1c14',
    label: 'Food route',
  },
  default: {
    start: '#1e4337',
    end: '#d4b071',
    accent: '#f5ead8',
    surface: '#173127',
    label: 'Travel route',
  },
};

interface PlaceArtworkInput {
  name: string;
  city?: string;
  category?: string;
}

const sanitizeText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const normalizeCategory = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
  return normalized || undefined;
};

export const formatCategoryLabel = (value?: string, t?: TranslationFunction): string => {
  const normalized = normalizeCategory(value);

  if (!normalized) {
    const tourismLabel = t?.('common.tourism');
    return typeof tourismLabel === 'string' ? tourismLabel : 'Tourism';
  }

  const translated = t?.(`categories.${normalized}`);
  if (typeof translated === 'string' && translated !== `categories.${normalized}`) {
    return translated;
  }

  return normalized
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const resolveAssetUrl = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^data:/i.test(trimmed) || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  const normalized = trimmed.replace(/^\.?\//, '');
  return trimmed.startsWith('/')
    ? `${API_ASSET_ORIGIN}${trimmed}`
    : `${API_ASSET_ORIGIN}/${normalized}`;
};

export const isPlaceholderAssetUrl = (value?: string): boolean => {
  const resolved = resolveAssetUrl(value);

  if (!resolved) {
    return false;
  }

  try {
    const url = new URL(resolved);
    return PLACEHOLDER_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

export const createPlaceFallbackImage = ({
  name,
  city,
  category,
}: PlaceArtworkInput): string => {
  const theme = artworkThemes[category?.toLowerCase() ?? ''] ?? artworkThemes.default;
  const title = sanitizeText(name);
  const subtitle = sanitizeText(
    city ? `${city} - ${formatCategoryLabel(category)}` : formatCategoryLabel(category),
  );

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${theme.start}" />
          <stop offset="58%" stop-color="${theme.end}" />
          <stop offset="100%" stop-color="#f2d6ae" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.42)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </radialGradient>
        <linearGradient id="ridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(255,255,255,0.06)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.24)" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" rx="48" />
      <circle cx="920" cy="168" r="164" fill="rgba(255,255,255,0.16)" />
      <circle cx="250" cy="720" r="230" fill="rgba(255,255,255,0.08)" />
      <path d="M0 580 C170 450 320 430 490 520 C630 596 772 620 1200 470 V800 H0 Z" fill="rgba(12,23,18,0.18)" />
      <path d="M0 626 C162 560 312 550 470 604 C620 656 782 680 1200 592 V800 H0 Z" fill="${theme.surface}" opacity="0.44" />
      <rect x="70" y="78" width="248" height="46" rx="23" fill="rgba(255,255,255,0.18)" />
      <text x="108" y="109" fill="#ffffff" font-family="Manrope, Arial, sans-serif" font-size="24" font-weight="700">Baramiz</text>
      <rect x="70" y="152" width="176" height="42" rx="21" fill="${theme.accent}" opacity="0.96" />
      <text x="98" y="179" fill="${theme.surface}" font-family="Manrope, Arial, sans-serif" font-size="22" font-weight="700">${theme.label}</text>
      <text x="70" y="542" fill="#ffffff" font-family="Sora, Manrope, Arial, sans-serif" font-size="72" font-weight="700">${title}</text>
      <text x="70" y="604" fill="rgba(255,255,255,0.92)" font-family="Manrope, Arial, sans-serif" font-size="30">${subtitle}</text>
      <text x="70" y="688" fill="rgba(255,255,255,0.82)" font-family="Manrope, Arial, sans-serif" font-size="24">Karakalpakstan tourism selection</text>
      <rect x="798" y="564" width="282" height="100" rx="28" fill="url(#ridge)" />
      <text x="840" y="606" fill="#ffffff" font-family="Manrope, Arial, sans-serif" font-size="22" font-weight="700">Destination card</text>
      <text x="840" y="640" fill="rgba(255,255,255,0.82)" font-family="Manrope, Arial, sans-serif" font-size="20">Reliable visual fallback</text>
      <rect x="0" y="0" width="1200" height="800" fill="url(#glow)" rx="48" />
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getPlaceImageSource = ({
  src,
  name,
  city,
  category,
}: PlaceArtworkInput & { src?: string }): string => {
  const resolved = resolveAssetUrl(src);

  if (resolved && !isPlaceholderAssetUrl(src)) {
    return resolved;
  }

  return createPlaceFallbackImage({ name, city, category });
};

export const formatMinutesLabel = (value?: number, t?: TranslationFunction): string => {
  if (!value || value <= 0) {
    const flexibleVisit = t?.('common.flexibleVisit');
    return typeof flexibleVisit === 'string' ? flexibleVisit : 'Flexible visit';
  }

  if (value < 60) {
    const minutesLabel = t?.('common.minutesLabel', { count: value });
    return typeof minutesLabel === 'string' ? minutesLabel : `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (minutes === 0) {
    const hoursLabel = t?.('common.hoursLabel', { count: hours });
    return typeof hoursLabel === 'string' ? hoursLabel : `${hours} hr`;
  }

  const hoursMinutesLabel = t?.('common.hoursMinutesLabel', { hours, minutes });
  return typeof hoursMinutesLabel === 'string'
    ? hoursMinutesLabel
    : `${hours} hr ${minutes} min`;
};
