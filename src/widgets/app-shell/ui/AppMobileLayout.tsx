import { AppShell, Box, Container, Group, Text } from '@mantine/core';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../features/language-switcher';
import { routePaths } from '../../../router/paths';
import { ScrollToTop } from '../../../shared/lib/router/ScrollToTop';
import { AppBottomNav } from './AppBottomNav';
import styles from './AppMobileLayout.module.css';

export function AppMobileLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith(routePaths.appBookingDetails);

  return (
    <AppShell header={{ height: { base: 58, md: 64 } }} padding={0}>
      <ScrollToTop />

      <AppShell.Header className={styles.header}>
        <Container size={520} h="100%">
          <Group h="100%" justify="space-between" wrap="nowrap" className={styles.headerInner}>
            <Group gap="xs" wrap="nowrap">
              <Box className={styles.brandMark} />
              <div className={styles.brandCopy}>
                <Text fw={800} size="md" c="forest.9" lh={1.1} className={styles.brandTitle}>
                  {t('common.appName')}
                </Text>
              </div>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <LanguageSwitcher />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {!hideBottomNav ? <AppBottomNav /> : null}

      <AppShell.Main
        pt={{ base: 58, md: 64 }}
        pb={{ base: hideBottomNav ? 18 : 92, md: 24 }}
        className={styles.shellMain}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
