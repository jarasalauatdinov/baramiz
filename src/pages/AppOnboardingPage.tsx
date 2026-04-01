import { Badge, Box, Button, Center, Container, Group, Image, Paper, Stack, Text } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getLocalizedDestinations } from '../data/destinations';
import { markOnboardingCompleted } from '../features/app-flow/model/appFlow';
import { routePaths } from '../router/paths';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

export function AppOnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  const localizedDestinations = useMemo(() => getLocalizedDestinations(t), [t]);
  const stepImages = localizedDestinations.slice(0, 3).map((item) => item.heroImage);

  const steps = useMemo<OnboardingStep[]>(
    () => [
      {
        id: 'discover',
        title: t('pages.appIntro.onboarding.step1.title', {
          defaultValue: 'Discover real destinations',
        }),
        description: t('pages.appIntro.onboarding.step1.description', {
          defaultValue: 'Start from where to go, not from a complicated form.',
        }),
        image: stepImages[0] ?? '',
      },
      {
        id: 'plan',
        title: t('pages.appIntro.onboarding.step2.title', {
          defaultValue: 'Build a practical route',
        }),
        description: t('pages.appIntro.onboarding.step2.description', {
          defaultValue: 'Use interests and travel style to generate useful stops.',
        }),
        image: stepImages[1] ?? '',
      },
      {
        id: 'support',
        title: t('pages.appIntro.onboarding.step3.title', {
          defaultValue: 'Use local support',
        }),
        description: t('pages.appIntro.onboarding.step3.description', {
          defaultValue: 'Guides, stays, and services stay close to every route.',
        }),
        image: stepImages[2] ?? '',
      },
    ],
    [stepImages, t],
  );

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const finishOnboarding = () => {
    markOnboardingCompleted();
    navigate(routePaths.appHome, { replace: true });
  };

  return (
    <Center mih="100vh" bg="linear-gradient(180deg, #fffaf3 0%, #f6efe2 100%)" py="xl">
      <Container size="sm" w="100%">
        <Paper withBorder radius="30px" p={{ base: 'lg', sm: 'xl' }} bg="white">
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Badge color="forest" variant="light" radius="xl">
                {t('pages.appIntro.onboarding.badge', { defaultValue: 'Getting started' })}
              </Badge>
              <Text size="sm" c="dimmed">
                {stepIndex + 1}/{steps.length}
              </Text>
            </Group>

            <Box
              style={{
                borderRadius: 22,
                overflow: 'hidden',
                border: '1px solid rgba(26, 42, 35, 0.08)',
                background: '#f8f3e8',
              }}
            >
              {step.image ? (
                <Image src={step.image} alt={step.title} h={220} fit="cover" />
              ) : (
                <Box h={220} />
              )}
            </Box>

            <Stack gap={8}>
              <Text fw={800} size="1.6rem" lh={1.12}>
                {step.title}
              </Text>
              <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                {step.description}
              </Text>
            </Stack>

            <Group grow>
              <Button
                variant="subtle"
                color="gray"
                onClick={finishOnboarding}
              >
                {t('pages.appIntro.onboarding.skip', { defaultValue: 'Skip' })}
              </Button>
              <Button
                color="sun"
                c="#2d2208"
                onClick={() => {
                  if (isLast) {
                    finishOnboarding();
                  } else {
                    setStepIndex((prev) => prev + 1);
                  }
                }}
              >
                {isLast
                  ? t('pages.appIntro.onboarding.start', { defaultValue: 'Start app' })
                  : t('pages.appIntro.onboarding.next', { defaultValue: 'Next' })}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
