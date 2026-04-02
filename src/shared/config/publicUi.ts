export const publicUi = {
  radius: {
    hero: '32px',
    panel: '26px',
    card: '28px',
    cardInner: '18px',
  },
  border: {
    default: 'rgba(94, 72, 53, 0.12)',
    soft: 'rgba(94, 72, 53, 0.08)',
    accent: 'rgba(207, 109, 69, 0.22)',
  },
  shadow: {
    hero: '0 24px 54px rgba(61, 43, 28, 0.14)',
    card: '0 18px 36px rgba(54, 39, 26, 0.1)',
    cardSoft: '0 12px 24px rgba(60, 44, 31, 0.08)',
  },
  background: {
    hero:
      'linear-gradient(140deg, rgba(255,250,242,0.99), rgba(248,240,230,0.95) 58%, rgba(207,109,69,0.14))',
    panel:
      'linear-gradient(145deg, rgba(255,255,255,0.99), rgba(252,247,240,0.96))',
    accent:
      'linear-gradient(180deg, rgba(252,236,218,0.92), rgba(255,255,255,0.98))',
    surface: '#ffffff',
    surfaceSoft: '#fcf6ee',
    surfaceMuted: '#f8efe3',
    surfaceWarm: '#fff9f2',
  },
} as const;
