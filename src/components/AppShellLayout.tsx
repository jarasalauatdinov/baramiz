import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { PublicFooter } from './layout/PublicFooter';
import { PublicHeader } from './layout/PublicHeader';
import { MobileBottomNav } from './layout/MobileBottomNav';
import { ScrollToTop } from './ScrollToTop';

export function AppShellLayout() {
  return (
    <AppShell header={{ height: { base: 70, md: 84 } }} padding={0}>
      <ScrollToTop />
      <PublicHeader />
      <MobileBottomNav />

      <AppShell.Main pt={{ base: 70, md: 84 }} pb={{ base: 92, md: 0 }}>
        <Outlet />
        <PublicFooter />
      </AppShell.Main>
    </AppShell>
  );
}
