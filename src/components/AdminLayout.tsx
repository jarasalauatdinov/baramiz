import {
  AppShell,
  Badge,
  Burger,
  Button,
  Group,
  MantineProvider,
  ScrollArea,
  Text,
  createTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/api';
import { LanguageSwitcher } from '../features/language-switcher';
import { ScrollToTop } from '../shared/lib/router/ScrollToTop';
import classes from './AdminLayout.module.css';

const adminTheme = createTheme({
  primaryColor: 'dark',
  defaultRadius: 'sm',
  fontFamily: '"Segoe UI", "Manrope", sans-serif',
  headings: {
    fontFamily: '"Segoe UI", "Manrope", sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
      },
    },
  },
});

interface AdminNavigationItem {
  to: string;
  label: string;
}

function SidebarLink({ to, label }: AdminNavigationItem) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) => `${classes.navItem} ${isActive ? classes.navItemActive : ''}`}
    >
      <span className={classes.navDot} />
      <span>{label}</span>
    </NavLink>
  );
}

function getPageMeta(pathname: string, t: (key: string) => string) {
  if (/^\/admin\/places\/new$/.test(pathname)) {
    return {
      title: t('admin.layout.titles.newPlace'),
      subtitle: t('admin.layout.subtitles.newPlace'),
    };
  }

  if (/^\/admin\/places\/[^/]+\/edit$/.test(pathname)) {
    return {
      title: t('admin.layout.titles.editPlace'),
      subtitle: t('admin.layout.subtitles.editPlace'),
    };
  }

  if (/^\/admin\/places$/.test(pathname)) {
    return {
      title: t('admin.layout.titles.places'),
      subtitle: t('admin.layout.subtitles.places'),
    };
  }

  if (/^\/admin\/categories$/.test(pathname)) {
    return {
      title: t('admin.layout.titles.categories'),
      subtitle: t('admin.layout.subtitles.categories'),
    };
  }

  return {
    title: t('admin.layout.titles.overview'),
    subtitle: t('admin.layout.subtitles.overview'),
  };
}

const formatApiLabel = (value: string) => {
  if (!value.trim()) {
    return 'Not configured';
  }

  if (value.startsWith('http://')) {
    return value.replace('http://', '');
  }

  if (value.startsWith('https://')) {
    return value.replace('https://', '');
  }

  return value;
};

export function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpened, { toggle, close }] = useDisclosure(false);

  const navItems: AdminNavigationItem[] = [
    { label: t('admin.nav.overview'), to: '/admin' },
    { label: t('admin.nav.places'), to: '/admin/places' },
    { label: t('admin.nav.categories'), to: '/admin/categories' },
  ];

  const pageMeta = getPageMeta(location.pathname, t);
  const apiLabel = formatApiLabel(API_BASE_URL);

  return (
    <MantineProvider theme={adminTheme}>
      <ScrollToTop />

      <AppShell
        className={classes.shell}
        header={{ height: 72 }}
        navbar={{ width: 272, breakpoint: 'md', collapsed: { mobile: !mobileOpened } }}
        padding={0}
      >
        <AppShell.Navbar className={classes.navbar}>
          <div className={classes.navbarInner}>
            <div className={classes.brand}>
              <div className={classes.brandMark}>BA</div>
              <div>
                <div className={classes.brandEyebrow}>Content workspace</div>
                <div className={classes.brandTitle}>{t('admin.nav.title')}</div>
                <div className={classes.brandSubtitle}>{t('admin.nav.subtitle')}</div>
              </div>
            </div>

            <Text className={classes.navSectionTitle}>{t('admin.nav.section')}</Text>

            <ScrollArea type="never" offsetScrollbars={false}>
              <div className={classes.navList}>
                {navItems.map((item) => (
                  <div key={item.to} onClick={close}>
                    <SidebarLink {...item} />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className={classes.navFooter}>
              <div className={classes.navFooterRow}>
                <Text className={classes.navFooterLabel}>API</Text>
                <Text className={classes.navFooterValue}>{apiLabel}</Text>
              </div>
              <div className={classes.navFooterRow}>
                <Text className={classes.navFooterLabel}>Mode</Text>
                <Text className={classes.navFooterValue}>Live CRUD</Text>
              </div>
              <Button component={Link} to="/" variant="light" color="gray" fullWidth mt="md">
                {t('admin.nav.backToSite')}
              </Button>
            </div>
          </div>
        </AppShell.Navbar>

        <AppShell.Header className={classes.header}>
          <div className={classes.headerInner}>
            <Group gap="sm" wrap="nowrap" className={classes.headerMain}>
              <Burger hiddenFrom="md" opened={mobileOpened} onClick={toggle} />
              <div>
                <div className={classes.headerTitle}>{pageMeta.title}</div>
                <div className={classes.headerSubtitle}>{pageMeta.subtitle}</div>
              </div>
            </Group>

            <Group gap="sm" wrap="nowrap" className={classes.headerMeta}>
              <Badge color="green" variant="light" radius="sm">
                Live backend
              </Badge>
              <div className={classes.apiValue}>{apiLabel}</div>
              <LanguageSwitcher variant="admin" />
            </Group>
          </div>
        </AppShell.Header>

        <AppShell.Main className={classes.main}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
