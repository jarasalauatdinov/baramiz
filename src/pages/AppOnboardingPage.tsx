import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Image,
  Overlay,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
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
        title: t('pages.appIntro.onboarding.step1.title'),
        description: t('pages.appIntro.onboarding.step1.description'),
        image: stepImages[0] ?? '',
      },
      {
        id: 'plan',
        title: t('pages.appIntro.onboarding.step2.title'),
        description: t('pages.appIntro.onboarding.step2.description'),
        image: stepImages[1] ?? '',
      },
      {
        id: 'support',
        title: t('pages.appIntro.onboarding.step3.title'),
        description: t('pages.appIntro.onboarding.step3.description'),
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
      <Container size={460} w="100%">
        <Paper
          withBorder
          radius="30px"
          p={{ base: 'lg', sm: 'xl' }}
          bg="white"
          style={{ borderColor: 'rgba(193, 148, 117, 0.24)' }}
        >
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Badge color="forest" variant="light" radius="xl">
                {t('pages.appIntro.onboarding.badge')}
              </Badge>
              <Group gap={7}>
                {steps.map((_, index) => (
                  <Box
                    key={index}
                    w={index === stepIndex ? 26 : 8}
                    h={6}
                    style={{
                      borderRadius: 999,
                      background: index === stepIndex ? '#d28354' : '#d9c5ac',
                      transition: 'width 180ms ease',
                    }}
                  />
                ))}
              </Group>
            </Group>

            <Box
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(26, 42, 35, 0.12)',
                background: '#f8f3e8',
                position: 'relative',
              }}
            >
              {step.image ? (
                <Image src={step.image} alt={step.title} h={236} fit="cover" />
              ) : (
                <Box h={236} />
              )}
              <Overlay
                gradient="linear-gradient(180deg, rgba(17,14,11,0.08) 0%, rgba(17,14,11,0.54) 100%)"
                opacity={1}
              />
            </Box>

            <Stack gap={8}>
              <Text fw={800} size="1.6rem" lh={1.12}>
                {step.title}
              </Text>
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                {step.description}
              </Text>
            </Stack>

            <Button
              color="sun"
              c="#2d2208"
              radius="xl"
              size="lg"
              onClick={() => {
                if (isLast) {
                  finishOnboarding();
                } else {
                  setStepIndex((prev) => prev + 1);
                }
              }}
            >
              {isLast ? t('pages.appIntro.onboarding.start') : t('pages.appIntro.onboarding.next')}
            </Button>

            <Button variant="subtle" color="gray" onClick={finishOnboarding}>
              {t('pages.appIntro.onboarding.skip')}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
