import { Box, Center, Loader, Overlay, Stack, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  hasCompletedLanguageStep,
  hasCompletedOnboarding,
  hasSavedLanguage,
} from '../features/app-flow/model/appFlow';
import { destinationCatalog } from '../entities/destination/model/catalog';
import { routePaths } from '../router/paths';

export function AppSplashPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const splashImage = destinationCatalog[0]?.heroImage;

  useEffect(() => {
    const nextPath = !hasCompletedLanguageStep() || !hasSavedLanguage()
      ? routePaths.appLanguage
      : hasCompletedOnboarding()
        ? routePaths.appHome
        : routePaths.appOnboarding;

    const timer = window.setTimeout(() => {
      navigate(nextPath, { replace: true });
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <Center
      mih="100vh"
      style={{
        position: 'relative',
        backgroundColor: '#f6efe1',
        backgroundImage: splashImage ? `url(${splashImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(18,16,13,0.35) 0%, rgba(30,23,16,0.62) 66%, rgba(22,17,13,0.8) 100%)"
        opacity={1}
        zIndex={0}
      />
      <Stack align="center" gap="md" style={{ position: 'relative', zIndex: 1 }}>
        <Box
          w={74}
          h={74}
          style={{
            borderRadius: 24,
            background: 'linear-gradient(160deg, #f5c099, #c86d3f)',
            boxShadow: '0 16px 32px rgba(26, 17, 12, 0.28)',
          }}
        />
        <Text fw={800} size="2rem" c="white" style={{ letterSpacing: '-0.02em' }}>
          {t('common.appName')}
        </Text>
        <Text size="sm" c="rgba(255,255,255,0.82)">
          {t('pages.appIntro.splashTagline')}
        </Text>
        <Loader color="dune" size="sm" mt={4} />
      </Stack>
    </Center>
  );
}
