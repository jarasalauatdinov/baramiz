import { AppShell, Container, SimpleGrid, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routePaths } from '../../router/paths';
import styles from './PublicLayout.module.css';

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <AppShell.Section component="footer" className={styles.footer}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 'md', lg: 'xl' }}>
          <Stack gap="md">
            <Text fw={800} size="xl">
              {t('common.appName')}
            </Text>
            <Text maw={320} size="sm" className={styles.footerText}>
              {t('layout.footer.description')}
            </Text>
          </Stack>

          <Stack gap={6}>
            <Text fw={700} size="sm">{t('layout.footer.sections.explore')}</Text>
            <NavLink to={routePaths.destinations} className={styles.footerLink}>
              {t('layout.navigation.destinations')}
            </NavLink>
            <NavLink to={routePaths.places} className={styles.footerLink}>
              {t('layout.navigation.places')}
            </NavLink>
            <NavLink to={routePaths.services} className={styles.footerLink}>
              {t('layout.navigation.services')}
            </NavLink>
            <NavLink to={routePaths.guides} className={styles.footerLink}>
              {t('layout.navigation.guides')}
            </NavLink>
            <NavLink to={routePaths.map} className={styles.footerLink}>
              {t('layout.navigation.map')}
            </NavLink>
          </Stack>

          <Stack gap={6}>
            <Text fw={700} size="sm">{t('layout.footer.sections.planning')}</Text>
            <NavLink to={routePaths.routeGenerator} className={styles.footerLink}>
              {t('common.generateRoute')}
            </NavLink>
            <NavLink to={routePaths.about} className={styles.footerLink}>
              {t('layout.navigation.about')}
            </NavLink>
            <Text size="sm" className={styles.footerText}>
              {t('layout.footer.links.guidesDirectory')}
            </Text>
            <Text size="sm" className={styles.footerText}>
              {t('layout.footer.links.transport')}
            </Text>
          </Stack>

          <Stack gap={6}>
            <Text fw={700} size="sm">{t('layout.footer.sections.value')}</Text>
            <Text size="sm" className={styles.footerText}>
              {t('layout.footer.values.routePlanning')}
            </Text>
            <Text size="sm" className={styles.footerText}>
              {t('layout.footer.values.livePlaces')}
            </Text>
            <Text size="sm" className={styles.footerText}>
              {t('layout.footer.values.localDiscovery')}
            </Text>
          </Stack>
        </SimpleGrid>
      </Container>
    </AppShell.Section>
  );
}
