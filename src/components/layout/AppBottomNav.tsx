import { Box, Group, Paper, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routePaths } from '../../router/paths';
import styles from './AppMobileLayout.module.css';

interface AppNavItem {
  to: string;
  label: string;
  icon: 'home' | 'explore' | 'route' | 'guides' | 'services';
}

function NavGlyph({ icon }: { icon: AppNavItem['icon'] }) {
  if (icon === 'home') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={styles.bottomNavGlyph}>
        <path d="M4 11.5L12 5l8 6.5" />
        <path d="M6.5 10.5V19h11v-8.5" />
      </svg>
    );
  }

  if (icon === 'explore') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={styles.bottomNavGlyph}>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M12 8.5l2.8 6-6 2.8 3.2-8.8z" />
      </svg>
    );
  }

  if (icon === 'route') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={styles.bottomNavGlyph}>
        <path d="M5 6h.01" />
        <path d="M5 18h.01" />
        <path d="M8 6h4a4 4 0 014 4 4 4 0 004 4h0" />
        <path d="M8 18h11" />
      </svg>
    );
  }

  if (icon === 'services') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={styles.bottomNavGlyph}>
        <rect x="4.5" y="6" width="15" height="12" rx="2.6" />
        <path d="M9 10.5h6" />
        <path d="M9 13.5h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden className={styles.bottomNavGlyph}>
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5.5 18.5a6.5 6.5 0 0113 0" />
    </svg>
  );
}

export function AppBottomNav() {
  const { t } = useTranslation();

  const items: AppNavItem[] = [
    { to: routePaths.appHome, label: t('pages.appNav.home'), icon: 'home' },
    { to: routePaths.appExplore, label: t('pages.appNav.explore'), icon: 'explore' },
    { to: routePaths.appRouteBuilder, label: t('pages.appNav.route'), icon: 'route' },
    { to: routePaths.appServices, label: t('layout.navigation.services'), icon: 'services' },
    { to: routePaths.appGuides, label: t('pages.appNav.guides'), icon: 'guides' },
  ];

  return (
    <Box className={styles.bottomNavShell} hiddenFrom="md">
      <Paper className={styles.bottomNav} radius="24px" shadow="md">
        <Group justify="space-between" gap={6} wrap="nowrap">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={styles.bottomNavLink}>
              {({ isActive }) => (
                <UnstyledButton
                  className={styles.bottomNavButton}
                  data-active={isActive || undefined}
                >
                  <span className={styles.bottomNavIcon}>
                    <NavGlyph icon={item.icon} />
                  </span>
                  <Text size="xs" fw={700} lh={1.1}>
                    {item.label}
                  </Text>
                </UnstyledButton>
              )}
            </NavLink>
          ))}
        </Group>
      </Paper>
    </Box>
  );
}
