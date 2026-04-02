import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { loginWithBackend } from '../features/auth/api/authApi';
import {
  clearPendingProtectedAction,
  getPendingProtectedAction,
  readProtectedActionIntent,
  savePendingProtectedAction,
} from '../features/auth/model/protectedAction';
import { AuthScreenShell } from '../features/auth/ui/AuthScreenShell';
import { createBackendAuthSession, getAuthSession, setAuthSession } from '../features/auth/model/session';
import { routePaths } from '../router/paths';

export function AppLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const stateIntent = useMemo(() => readProtectedActionIntent(location.state), [location.state]);
  const legacyFrom =
    typeof (location.state as { from?: string } | null)?.from === 'string'
      ? (location.state as { from?: string }).from
      : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (stateIntent) {
      savePendingProtectedAction(stateIntent);
    }
  }, [stateIntent]);

  const continueAfterAuth = () => {
    const pendingIntent = getPendingProtectedAction();
    const redirectTo = pendingIntent?.redirectTo ?? legacyFrom ?? routePaths.appHome;
    const redirectState = pendingIntent?.redirectState;

    if (pendingIntent && pendingIntent.reason !== 'save-route') {
      clearPendingProtectedAction();
    }

    navigate(redirectTo, { replace: true, state: redirectState });
  };

  useEffect(() => {
    if (getAuthSession()) {
      continueAfterAuth();
    }
  }, [navigate]);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError(t('pages.auth.login.error'));
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await loginWithBackend({
        email: normalizedEmail,
        password,
      });

      setAuthSession(
        createBackendAuthSession({
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        }),
      );

      continueAfterAuth();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('pages.auth.login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      badge={t('pages.auth.login.badge')}
      title={t('pages.auth.login.title')}
      description={t('pages.auth.login.description')}
      footerActionLabel={t('pages.auth.login.switchAction')}
      footerActionTo={routePaths.appRegister}
      footerHint={t('pages.auth.integration')}
    >
      <Stack gap="md">
        {error ? <Alert color="red" variant="light">{error}</Alert> : null}

        <TextInput
          label={t('pages.auth.fields.email')}
          placeholder="traveler@baramiz.uz"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          radius="xl"
          size="md"
        />
        <PasswordInput
          label={t('pages.auth.fields.password')}
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          radius="xl"
          size="md"
        />

        <Button
          color="sun"
          c="#2d2208"
          radius="xl"
          size="lg"
          onClick={() => void handleSubmit()}
          loading={submitting}
        >
          {t('pages.auth.login.submit')}
        </Button>

        <Button component={Link} to={routePaths.appRegister} variant="subtle" color="forest" radius="xl">
          {t('pages.auth.login.createAccount')}
        </Button>
      </Stack>
    </AuthScreenShell>
  );
}
