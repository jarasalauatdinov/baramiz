import { Box, Button, Group, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routePaths } from '../../router/paths';
import styles from './PublicLayout.module.css';

interface MobileNavItem {
  to: string;
  label: string;
}

export function MobileBottomNav() {
  const { t } = useTranslation();

  const items: MobileNavItem[] = [
    { to: routePaths.home, label: t('layout.navigation.home') },
    { to: routePaths.destinations, label: t('layout.navigation.destinations') },
    { to: routePaths.places, label: t('layout.navigation.places') },
    { to: routePaths.routeGenerator, label: t('layout.navigation.route', { defaultValue: 'Route' }) },
    { to: routePaths.services, label: t('layout.navigation.services') },
  ];

  return (
    <Box className={styles.mobileBottomNavShell} hiddenFrom="md">
      <Paper className={styles.mobileBottomNav} radius="24px" shadow="md">
        <Group justify="space-between" gap={6} wrap="nowrap">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={styles.mobileBottomNavLink}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'filled' : 'subtle'}
                  color={isActive ? 'sun' : 'gray'}
                  c={isActive ? '#2d2208' : '#5d665f'}
                  radius="xl"
                  size="compact-sm"
                  className={styles.mobileBottomNavButton}
                >
                  {item.label}
                </Button>
              )}
            </NavLink>
          ))}
        </Group>
      </Paper>
    </Box>
  );
}
