import { Badge, Button, Center, Container, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '../i18n';
import { markLanguageStepCompleted } from '../features/app-flow/model/appFlow';
import { routePaths } from '../router/paths';

export function AppLanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language) as AppLanguage;

  const handleChooseLanguage = async (language: AppLanguage) => {
    await i18n.changeLanguage(language);
    markLanguageStepCompleted();
    navigate(routePaths.appOnboarding, { replace: true });
  };

  return (
    <Center mih="100vh" bg="linear-gradient(180deg, #fffaf2 0%, #f6f0e4 100%)" py="xl">
      <Container size="sm" w="100%">
        <Paper withBorder radius="28px" p={{ base: 'lg', sm: 'xl' }} bg="white">
          <Stack gap="lg">
            <Stack gap={6}>
              <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                {t('pages.appIntro.languageEyebrow', { defaultValue: 'Language' })}
              </Badge>
              <Text fw={800} size="1.7rem" lh={1.12}>
                {t('pages.appIntro.languageTitle', {
                  defaultValue: 'Choose app language',
                })}
              </Text>
              <Text c="dimmed" size="sm">
                {t('pages.appIntro.languageDescription', {
                  defaultValue: 'You can change it later from the app header.',
                })}
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {SUPPORTED_LANGUAGES.map((language) => {
                const selected = language === currentLanguage;
                return (
                  <Button
                    key={language}
                    variant={selected ? 'filled' : 'light'}
                    color={selected ? 'sun' : 'forest'}
                    c={selected ? '#2d2208' : undefined}
                    radius="xl"
                    size="lg"
                    justify="space-between"
                    onClick={() => void handleChooseLanguage(language)}
                    styles={{
                      root: {
                        height: 56,
                        fontWeight: 700,
                      },
                    }}
                  >
                    {t(`languages.${language}.name`)}
                  </Button>
                );
              })}
            </SimpleGrid>

            <Button
              variant="subtle"
              color="gray"
              onClick={() => {
                markLanguageStepCompleted();
                navigate(routePaths.appOnboarding, { replace: true });
              }}
            >
              {t('pages.appIntro.languageContinue', { defaultValue: 'Continue with current language' })}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
