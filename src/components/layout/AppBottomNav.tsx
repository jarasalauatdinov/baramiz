import { Box, Group, Paper, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routePaths } from '../../router/paths';
import styles from './AppMobileLayout.module.css';

interface AppNavItem {
  to: string;
  label: string;
  short: string;
}

export function AppBottomNav() {
  const { t } = useTranslation();

  const items: AppNavItem[] = [
    { to: routePaths.appHome, label: t('pages.appNav.home', { defaultValue: 'Home' }), short: 'H' },
    { to: routePaths.appExplore, label: t('pages.appNav.explore', { defaultValue: 'Explore' }), short: 'E' },
    { to: routePaths.appRouteBuilder, label: t('pages.appNav.route', { defaultValue: 'Route' }), short: 'R' },
    { to: routePaths.appGuides, label: t('pages.appNav.guides', { defaultValue: 'Guides' }), short: 'G' },
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
                  <span className={styles.bottomNavIcon}>{item.short}</span>
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
