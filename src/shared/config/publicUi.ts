export const publicUi = {
  radius: {
    hero: '32px',
    panel: '26px',
    card: '24px',
    cardInner: '18px',
  },
  border: {
    default: 'rgba(38, 49, 42, 0.10)',
    soft: 'rgba(38, 49, 42, 0.07)',
    accent: 'rgba(229, 182, 47, 0.20)',
  },
  shadow: {
    hero: '0 24px 56px rgba(52, 40, 18, 0.10)',
    card: '0 18px 40px rgba(45, 36, 17, 0.07)',
    cardSoft: '0 12px 26px rgba(30, 39, 34, 0.07)',
  },
  background: {
    hero:
      'linear-gradient(140deg, rgba(255,252,246,0.99), rgba(243,247,239,0.95) 58%, rgba(217,171,98,0.12))',
    panel:
      'linear-gradient(145deg, rgba(255,255,255,0.99), rgba(249,251,247,0.95))',
    accent:
      'linear-gradient(180deg, rgba(255,248,228,0.92), rgba(255,255,255,0.98))',
    surface: '#ffffff',
    surfaceSoft: '#fffdf8',
    surfaceMuted: '#faf6ee',
  },
} as const;
