import { Button, Group, Stack } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearPendingProtectedAction,
  getPendingProtectedAction,
  readProtectedActionIntent,
  savePendingProtectedAction,
} from '../features/auth/model/protectedAction';
import { hasAuthSession } from '../features/auth/model/session';
import { AuthScreenShell } from '../features/auth/ui/AuthScreenShell';
import { routePaths } from '../router/paths';

const getGateCopy = (reason: string | undefined, t: ReturnType<typeof useTranslation>['t']) => {
  switch (reason) {
    case 'save-route':
      return {
        badge: t('pages.auth.gate.saveRoute.badge', { defaultValue: 'Save route' }),
        title: t('pages.auth.gate.saveRoute.title', {
          defaultValue: 'Sign in to save this route',
        }),
        description: t('pages.auth.gate.saveRoute.description', {
          defaultValue:
            'Browsing stays open without login. We only ask when you want to keep routes for later.',
        }),
      };
    case 'payment':
      return {
        badge: t('pages.auth.gate.payment.badge', { defaultValue: 'Continue payment' }),
        title: t('pages.auth.gate.payment.title', {
          defaultValue: 'Sign in before payment',
        }),
        description: t('pages.auth.gate.payment.description', {
          defaultValue:
            'Your booking context will stay in place. Login is needed only before the protected payment step.',
        }),
      };
    case 'guide-request':
      return {
        badge: t('pages.auth.gate.guide.badge', { defaultValue: 'Request guide' }),
        title: t('pages.auth.gate.guide.title', {
          defaultValue: 'Sign in to request a local guide',
        }),
        description: t('pages.auth.gate.guide.description', {
          defaultValue:
            'We only ask now because guide requests need traveler details and a clear follow-up channel.',
        }),
      };
    case 'service-request':
      return {
        badge: t('pages.auth.gate.service.badge', { defaultValue: 'Request service' }),
        title: t('pages.auth.gate.service.title', {
          defaultValue: 'Sign in to request this service',
        }),
        description: t('pages.auth.gate.service.description', {
          defaultValue:
            'Your browsing stays open. Login is only needed when you move into booking or local support.',
        }),
      };
    case 'profile':
      return {
        badge: t('pages.auth.gate.profile.badge', { defaultValue: 'Open profile' }),
        title: t('pages.auth.gate.profile.title', {
          defaultValue: 'Sign in to open your profile',
        }),
        description: t('pages.auth.gate.profile.description', {
          defaultValue:
            'Baramiz stays open for browsing. We only ask for login when you want your personal profile and saved activity.',
        }),
      };
    default:
      return {
        badge: t('pages.auth.gate.booking.badge', { defaultValue: 'Continue booking' }),
        title: t('pages.auth.gate.booking.title', {
          defaultValue: 'Sign in to continue this protected step',
        }),
        description: t('pages.auth.gate.booking.description', {
          defaultValue:
            'You can explore the app freely. Login is only needed for bookings, payments, and saved actions.',
        }),
      };
  }
};

export function AppAuthRequiredPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const stateIntent = useMemo(() => readProtectedActionIntent(location.state), [location.state]);
  const pendingIntent = useMemo(() => stateIntent ?? getPendingProtectedAction(), [stateIntent]);

  useEffect(() => {
    if (stateIntent) {
      savePendingProtectedAction(stateIntent);
    }
  }, [stateIntent]);

  useEffect(() => {
    if (!hasAuthSession()) {
      return;
    }

    navigate(pendingIntent?.redirectTo ?? routePaths.appHome, {
      replace: true,
      state: pendingIntent?.redirectState,
    });
  }, [navigate, pendingIntent]);

  const copy = getGateCopy(pendingIntent?.reason, t);
  const backTo = pendingIntent?.sourcePath ?? routePaths.appHome;

  return (
    <AuthScreenShell
      badge={copy.badge}
      title={copy.title}
      description={copy.description}
      footerHint={t('pages.auth.integration')}
    >
      <Stack gap="md">
        <Button color="sun" c="#2d2208" radius="xl" size="lg" onClick={() => navigate(routePaths.appLogin)}>
          {t('pages.auth.login.submit')}
        </Button>

        <Button variant="light" color="forest" radius="xl" size="lg" onClick={() => navigate(routePaths.appRegister)}>
          {t('pages.auth.register.submit')}
        </Button>

        <Group justify="center">
          <Button
            variant="subtle"
            color="gray"
            radius="xl"
            onClick={() => {
              clearPendingProtectedAction();
              navigate(backTo, { replace: true });
            }}
          >
            {t('pages.auth.gate.continueBrowsing', {
              defaultValue: 'Continue browsing',
            })}
          </Button>
        </Group>
      </Stack>
    </AuthScreenShell>
  );
}
