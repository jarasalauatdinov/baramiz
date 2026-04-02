import { AppShell, Box, Burger, Button, Container, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LanguageSwitcher } from '../../features/language-switcher';
import { routePaths } from '../../router/paths';
import styles from './PublicLayout.module.css';

interface NavigationItemProps {
  to: string;
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
}

function NavigationItem({ to, label, onClick, fullWidth = false }: NavigationItemProps) {
  return (
    <NavLink to={to} onClick={onClick} className={styles.navLink}>
      {({ isActive }) => (
        <Button
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? 'sun' : 'gray'}
          c={isActive ? '#5a420b' : '#4f5d53'}
          radius="xl"
          size="compact-sm"
          styles={{
            root: {
              fontWeight: 600,
              height: 34,
              width: fullWidth ? '100%' : undefined,
              paddingInline: 12,
              border: isActive ? '1px solid rgba(229, 182, 47, 0.16)' : '1px solid transparent',
              background: isActive ? 'rgba(255, 248, 231, 0.74)' : 'transparent',
            },
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}

export function PublicHeader() {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const navItems = [
    { label: t('layout.navigation.home'), to: routePaths.home },
    { label: t('layout.navigation.destinations'), to: routePaths.destinations },
    { label: t('layout.navigation.places'), to: routePaths.places },
    { label: t('layout.navigation.services'), to: routePaths.services },
    { label: t('layout.navigation.guides'), to: routePaths.guides },
    { label: t('layout.navigation.about'), to: routePaths.about },
  ];

  return (
    <>
      <AppShell.Header className={styles.header}>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <NavLink to={routePaths.home} className={styles.brandLink}>
              <Group gap="sm" wrap="nowrap">
                <Box className={styles.brandMark} />
                <div>
                  <Text fw={800} size="xl" c="forest.9" className={styles.brandTitle}>
                    {t('common.appName')}
                  </Text>
                  <Text size="sm" className={styles.brandSubtitle}>
                    {t('common.appSubtitle')}
                  </Text>
                </div>
              </Group>
            </NavLink>

            <Group gap="xs" visibleFrom="md">
              {navItems.map((item) => (
                <NavigationItem key={item.to} to={item.to} label={item.label} />
              ))}
            </Group>

            <Group gap="xs" wrap="nowrap">
              <LanguageSwitcher />
              <Button
                component={NavLink}
                to={routePaths.routeGenerator}
                color="sun"
                c="#2d2208"
                radius="xl"
                size="sm"
                className={styles.desktopPrimaryAction}
                styles={{
                  root: {
                    height: 40,
                    paddingInline: 18,
                  },
                }}
                visibleFrom="md"
              >
                {t('common.generateRoute')}
              </Button>
              <Burger hiddenFrom="md" opened={opened} onClick={toggle} size="sm" />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer
        opened={opened}
        onClose={close}
        hiddenFrom="md"
        title={t('layout.navigation.menu')}
        padding="md"
        classNames={{ body: styles.mobileDrawerBody }}
      >
        <Stack>
          <LanguageSwitcher fullWidth />
          {navItems.map((item) => (
            <NavigationItem key={item.to} to={item.to} label={item.label} onClick={close} fullWidth />
          ))}
          <Button component={NavLink} to={routePaths.routeGenerator} color="sun" c="#2d2208" onClick={close} fullWidth>
            {t('common.generateRoute')}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
