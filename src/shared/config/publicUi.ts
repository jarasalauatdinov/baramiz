export const publicUi = {
  radius: {
    hero: '34px',
    panel: '28px',
    card: '24px',
    cardInner: '20px',
  },
  border: {
    default: 'rgba(44, 54, 46, 0.1)',
    soft: 'rgba(44, 54, 46, 0.08)',
    accent: 'rgba(229, 182, 47, 0.24)',
  },
  shadow: {
    hero: '0 26px 60px rgba(54, 41, 17, 0.12)',
    card: '0 18px 42px rgba(43, 34, 16, 0.07)',
    cardSoft: '0 14px 28px rgba(35, 43, 38, 0.08)',
  },
  background: {
    hero:
      'linear-gradient(140deg, rgba(255,252,245,0.98), rgba(235,240,229,0.94) 60%, rgba(217,171,98,0.14))',
    panel:
      'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(246,251,246,0.92))',
    accent:
      'linear-gradient(180deg, rgba(255,247,223,0.92), rgba(255,255,255,0.98))',
    surface: '#ffffff',
    surfaceSoft: '#fffdf8',
  },
} as const;
