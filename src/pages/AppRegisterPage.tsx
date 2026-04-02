import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { registerWithBackend } from '../features/auth/api/authApi';
import {
  clearPendingProtectedAction,
  getPendingProtectedAction,
  readProtectedActionIntent,
  savePendingProtectedAction,
} from '../features/auth/model/protectedAction';
import { AuthScreenShell } from '../features/auth/ui/AuthScreenShell';
import { createBackendAuthSession, getAuthSession, setAuthSession } from '../features/auth/model/session';
import { routePaths } from '../router/paths';

export function AppRegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const stateIntent = useMemo(() => readProtectedActionIntent(location.state), [location.state]);
  const [fullName, setFullName] = useState('');
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
    const redirectTo = pendingIntent?.redirectTo ?? routePaths.appHome;
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
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError(t('pages.auth.register.error'));
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await registerWithBackend({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
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
      setError(submitError instanceof Error ? submitError.message : t('pages.auth.register.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      badge={t('pages.auth.register.badge')}
      title={t('pages.auth.register.title')}
      description={t('pages.auth.register.description')}
      footerActionLabel={t('pages.auth.register.switchAction')}
      footerActionTo={routePaths.appLogin}
      footerHint={t('pages.auth.integration')}
    >
      <Stack gap="md">
        {error ? <Alert color="red" variant="light">{error}</Alert> : null}

        <TextInput
          label={t('pages.auth.fields.fullName')}
          placeholder={t('pages.auth.register.fullNamePlaceholder')}
          value={fullName}
          onChange={(event) => setFullName(event.currentTarget.value)}
          radius="xl"
          size="md"
        />
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
          {t('pages.auth.register.submit')}
        </Button>

        <Button component={Link} to={routePaths.appLogin} variant="subtle" color="forest" radius="xl">
          {t('pages.auth.register.haveAccount')}
        </Button>
      </Stack>
    </AuthScreenShell>
  );
}
