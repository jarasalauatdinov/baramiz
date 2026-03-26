import {
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavigationItemProps {
  to: string;
  label: string;
  onClick?: () => void;
}

function NavigationItem({ to, label, onClick }: NavigationItemProps) {
  return (
    <NavLink to={to} onClick={onClick} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <Button
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? 'sun' : 'gray'}
          c={isActive ? '#5a420b' : '#516055'}
          radius="md"
          size="sm"
          styles={{
            root: {
              fontWeight: 600,
              borderColor: isActive ? 'rgba(229, 182, 47, 0.26)' : 'transparent',
            },
          }}
        >
          {label}
        </Button>
      )}
    </NavLink>
  );
}

export function AppShellLayout() {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const navItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.destinations'), to: '/destinations' },
    { label: t('nav.places'), to: '/places' },
    { label: t('nav.map', { defaultValue: 'Map' }), to: '/map' },
    { label: t('nav.services'), to: '/services' },
    { label: t('nav.aiRoute'), to: '/route-generator' },
  ];

  return (
    <AppShell header={{ height: 82 }} padding={0}>
      <AppShell.Header
        style={{
          borderBottom: '1px solid rgba(44, 54, 46, 0.08)',
          background: 'rgba(252, 249, 242, 0.94)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <Group gap="sm" wrap="nowrap">
                <Box
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: '#e5b62f',
                    boxShadow: 'inset 0 0 0 8px rgba(255,255,255,0.28)',
                  }}
                />
                <div>
                  <Text fw={800} size="xl" c="forest.9" style={{ lineHeight: 1 }}>
                    {t('common.appName')}
                  </Text>
                  <Text c="#7a7469" size="sm">
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
              <Button component={NavLink} to="/route-generator" color="sun" c="#2d2208" visibleFrom="md">
                {t('common.generateRoute')}
              </Button>
              <Burger hiddenFrom="md" opened={opened} onClick={toggle} />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <Drawer opened={opened} onClose={close} hiddenFrom="md" title={t('nav.navigation')} padding="md">
        <Stack>
          <LanguageSwitcher fullWidth />
          {navItems.map((item) => (
            <NavigationItem key={item.to} to={item.to} label={item.label} onClick={close} />
          ))}
          <Button component={NavLink} to="/route-generator" color="sun" c="#2d2208" onClick={close}>
            {t('common.generateRoute')}
          </Button>
        </Stack>
      </Drawer>

      <AppShell.Main pt={82}>
        <Outlet />

        <Box component="footer" mt={96} py={64} style={{ background: '#1c2b24', color: 'white', borderTop: '1px solid rgba(229,182,47,0.18)' }}>
          <Container size="xl">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
              <Stack gap="sm">
                <Text fw={800} size="xl">
                  {t('common.appName')}
                </Text>
                <Text c="rgba(255,255,255,0.72)" maw={320}>
                  {t('footerV2.description', {
                    defaultValue:
                      'Tourism planning, destination discovery, and trusted local services for Karakalpakstan.',
                  })}
                </Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={700}>{t('footerV2.exploreTitle', { defaultValue: 'Explore' })}</Text>
                <NavLink to="/destinations" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.72)' }}>
                  {t('nav.destinations')}
                </NavLink>
                <NavLink to="/places" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.72)' }}>
                  {t('nav.places')}
                </NavLink>
                <NavLink to="/map" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.72)' }}>
                  {t('nav.map', { defaultValue: 'Map' })}
                </NavLink>
                <NavLink to="/services" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.72)' }}>
                  {t('nav.services')}
                </NavLink>
              </Stack>

              <Stack gap="xs">
                <Text fw={700}>{t('footerV2.planTitle', { defaultValue: 'Plan your trip' })}</Text>
                <NavLink to="/route-generator" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.72)' }}>
                  {t('common.generateRoute')}
                </NavLink>
                <Text c="rgba(255,255,255,0.72)">{t('footerV2.guides', { defaultValue: 'Local guides directory' })}</Text>
                <Text c="rgba(255,255,255,0.72)">{t('footerV2.transport', { defaultValue: 'Hotels, transport, and tours' })}</Text>
              </Stack>

              <Stack gap="xs">
                <Text fw={700}>{t('footerV2.valueTitle', { defaultValue: 'Why Baramiz' })}</Text>
                <Text c="rgba(255,255,255,0.72)">{t('footerV2.value1', { defaultValue: 'Warm, practical route planning' })}</Text>
                <Text c="rgba(255,255,255,0.72)">{t('footerV2.value2', { defaultValue: 'Live tourism places from the backend' })}</Text>
                <Text c="rgba(255,255,255,0.72)">{t('footerV2.value3', { defaultValue: 'Trusted local tourism discovery' })}</Text>
              </Stack>
            </SimpleGrid>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
