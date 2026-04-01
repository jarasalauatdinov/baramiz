import { Box, Center, Loader, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  hasCompletedLanguageStep,
  hasCompletedOnboarding,
  hasSavedLanguage,
} from '../features/app-flow/model/appFlow';
import { routePaths } from '../router/paths';

export function AppSplashPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const nextPath = !hasCompletedLanguageStep() || !hasSavedLanguage()
      ? routePaths.appLanguage
      : hasCompletedOnboarding()
        ? routePaths.appHome
        : routePaths.appOnboarding;

    const timer = window.setTimeout(() => {
      navigate(nextPath, { replace: true });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <Center mih="100vh" bg="linear-gradient(180deg, #fff9ef 0%, #f6f0e3 100%)">
      <Stack align="center" gap="md">
        <Box
          w={72}
          h={72}
          style={{
            borderRadius: 24,
            background: 'linear-gradient(160deg, #ffd379, #efaa46)',
            boxShadow: '0 12px 28px rgba(239, 170, 70, 0.3)',
          }}
        />
        <Text fw={800} size="2rem" c="forest.9" style={{ letterSpacing: '-0.02em' }}>
          {t('common.appName')}
        </Text>
        <Text size="sm" c="dimmed">
          {t('pages.appIntro.splashTagline', {
            defaultValue: 'Karakalpakstan travel app',
          })}
        </Text>
        <Loader color="sun" size="sm" mt={4} />
      </Stack>
    </Center>
  );
}
