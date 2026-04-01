import { AppShell, Box, Button, Container, Group, Text } from '@mantine/core';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from '../ScrollToTop';
import { routePaths } from '../../router/paths';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { AppBottomNav } from './AppBottomNav';
import styles from './AppMobileLayout.module.css';

export function AppMobileLayout() {
  const { t } = useTranslation();

  return (
    <AppShell header={{ height: { base: 64, md: 72 } }} padding={0}>
      <ScrollToTop />

      <AppShell.Header className={styles.header}>
        <Container size="lg" h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <Box className={styles.brandMark} />
              <div>
                <Text fw={800} size="lg" c="forest.9" lh={1.1}>
                  {t('common.appName')}
                </Text>
                <Text size="xs" c="dimmed" visibleFrom="sm">
                  {t('pages.appLayout.subtitle', { defaultValue: 'Travel app' })}
                </Text>
              </div>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <LanguageSwitcher />
              <Button
                component={NavLink}
                to={routePaths.appRouteBuilder}
                color="sun"
                c="#2d2208"
                radius="xl"
                size="compact-sm"
                visibleFrom="md"
              >
                {t('common.generateRoute')}
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppBottomNav />

      <AppShell.Main pt={{ base: 64, md: 72 }} pb={{ base: 92, md: 20 }} className={styles.shellMain}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
