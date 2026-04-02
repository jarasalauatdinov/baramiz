import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { logoutFromBackend, fetchCurrentUser } from '../features/auth/api/authApi';
import { savePendingProtectedAction, type ProtectedActionIntent } from '../features/auth/model/protectedAction';
import {
  clearAuthSession,
  createBackendAuthSession,
  getAuthSession,
  setAuthSession,
  type AppAuthSession,
} from '../features/auth/model/session';
import { getBookingConfirmation } from '../features/booking/model/bookingDraft';
import { getSavedRoutes } from '../features/route-planning/model/savedRoutes';
import { routePaths } from '../router/paths';
import { publicUi } from '../shared/config/publicUi';
import { PageSection, StatePanel } from '../shared/ui';

export function AppProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [session, setSession] = useState<AppAuthSession | null>(() => getAuthSession());
  const [loading, setLoading] = useState(Boolean(session));
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const savedRoutes = useMemo(() => getSavedRoutes(), []);
  const bookingConfirmation = useMemo(() => getBookingConfirmation(), []);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    let active = true;

    const loadProfile = async () => {
      try {
        const result = await fetchCurrentUser(session.token);

        if (!active) {
          return;
        }

        const nextSession = createBackendAuthSession({
          user: result.user,
          token: session.token,
          expiresAt: session.expiresAt,
        });

        setAuthSession(nextSession);
        setSession(nextSession);
      } catch (profileError) {
        console.error('Failed to load profile', profileError);

        if (!active) {
          return;
        }

        clearAuthSession();
        setSession(null);
        setError(profileError instanceof Error ? profileError.message : null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [session?.token]);

  const profileIntent: ProtectedActionIntent = {
    reason: 'profile',
    redirectTo: routePaths.appProfile,
    sourcePath: routePaths.appHome,
  };

  const startAuthFlow = (target: 'login' | 'register') => {
    savePendingProtectedAction(profileIntent);
    navigate(target === 'login' ? routePaths.appLogin : routePaths.appRegister, {
      state: profileIntent,
    });
  };

  const handleLogout = async () => {
    const currentSession = session ?? getAuthSession();
    if (!currentSession) {
      clearAuthSession();
      setSession(null);
      return;
    }

    setLoggingOut(true);

    try {
      await logoutFromBackend(currentSession.token);
    } catch (logoutError) {
      console.error('Failed to logout through backend', logoutError);
    } finally {
      clearAuthSession();
      setSession(null);
      setLoggingOut(false);
    }
  };

  if (!session) {
    return (
      <PageSection py={{ base: 20, md: 28 }}>
        <StatePanel
          badge={t('pages.profile.guest.badge', { defaultValue: 'Traveler profile' })}
          title={t('pages.profile.guest.title', { defaultValue: 'Sign in to open your profile' })}
          description={t('pages.profile.guest.description', {
            defaultValue:
              'Browse Baramiz freely first. Login is only needed when you want your personal profile, saved routes, or bookings.',
          })}
          actions={
            <>
              <Button color="sun" c="#2d2208" radius="xl" onClick={() => startAuthFlow('login')}>
                {t('pages.auth.login.submit')}
              </Button>
              <Button variant="light" color="forest" radius="xl" onClick={() => startAuthFlow('register')}>
                {t('pages.auth.register.submit')}
              </Button>
            </>
          }
        />
      </PageSection>
    );
  }

  return (
    <PageSection py={{ base: 20, md: 28 }}>
      <Stack gap="md">
        <Paper
          withBorder
          radius={publicUi.radius.card}
          p="lg"
          bg={publicUi.background.surfaceWarm}
          style={{ borderColor: publicUi.border.default, boxShadow: publicUi.shadow.cardSoft }}
        >
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start" gap="sm">
              <Stack gap={4}>
                <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                  {t('pages.profile.header.badge', { defaultValue: 'Profile' })}
                </Badge>
                <Text fw={800} size="1.2rem">
                  {session.user.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {session.user.email}
                </Text>
              </Stack>

              <Button variant="subtle" color="gray" radius="xl" onClick={() => void handleLogout()} loading={loggingOut}>
                {t('pages.profile.actions.logout', { defaultValue: 'Log out' })}
              </Button>
            </Group>

            {loading ? (
              <Text size="sm" c="dimmed">
                {t('pages.profile.loading', { defaultValue: 'Refreshing your profile...' })}
              </Text>
            ) : null}

            {error ? <Alert color="yellow" variant="light">{error}</Alert> : null}
          </Stack>
        </Paper>

        <Group grow align="stretch">
          <Paper
            withBorder
            radius={publicUi.radius.cardInner}
            p="md"
            bg="white"
            style={{ borderColor: publicUi.border.soft }}
          >
            <Stack gap={4}>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                {t('pages.profile.metrics.savedRoutesLabel', { defaultValue: 'Saved routes' })}
              </Text>
              <Text fw={800} size="1.3rem">
                {savedRoutes.length}
              </Text>
            </Stack>
          </Paper>

          <Paper
            withBorder
            radius={publicUi.radius.cardInner}
            p="md"
            bg="white"
            style={{ borderColor: publicUi.border.soft }}
          >
            <Stack gap={4}>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                {t('pages.profile.metrics.bookingLabel', { defaultValue: 'Latest booking' })}
              </Text>
              <Text fw={800} size="1rem">
                {bookingConfirmation?.status
                  ? t('pages.profile.metrics.bookingStatus', { defaultValue: 'Pending support' })
                  : t('pages.profile.metrics.bookingEmpty', { defaultValue: 'No request yet' })}
              </Text>
            </Stack>
          </Paper>
        </Group>

        <Paper
          withBorder
          radius={publicUi.radius.card}
          p="lg"
          bg="white"
          style={{ borderColor: publicUi.border.default, boxShadow: publicUi.shadow.cardSoft }}
        >
          <Stack gap="md">
            <Text fw={800}>{t('pages.profile.actions.title', { defaultValue: 'Continue from where you left off' })}</Text>
            <Group grow>
              <Button component={Link} to={routePaths.appRouteBuilder} radius="xl" color="sun" c="#2d2208">
                {t('pages.profile.actions.buildRoute', { defaultValue: 'Build a route' })}
              </Button>
              <Button component={Link} to={routePaths.appServices} radius="xl" variant="light" color="forest">
                {t('layout.navigation.services')}
              </Button>
            </Group>
            <Button component={Link} to={routePaths.appExplore} radius="xl" variant="subtle" color="forest">
              {t('common.exploreMorePlaces')}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </PageSection>
  );
}

