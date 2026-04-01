import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '../i18n';
import { markLanguageStepCompleted } from '../features/app-flow/model/appFlow';
import { routePaths } from '../router/paths';

export function AppLanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language) as AppLanguage;
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage>(currentLanguage);

  const handleContinue = async () => {
    await i18n.changeLanguage(selectedLanguage);
    markLanguageStepCompleted();
    navigate(routePaths.appOnboarding, { replace: true });
  };

  return (
    <Center mih="100vh" bg="linear-gradient(180deg, #fffaf2 0%, #f6f0e4 100%)" py="xl">
      <Container size={460} w="100%">
        <Paper
          withBorder
          radius="28px"
          p={{ base: 'lg', sm: 'xl' }}
          bg="white"
          style={{ borderColor: 'rgba(193, 148, 117, 0.24)' }}
        >
          <Stack gap="xl">
            <Stack gap={8}>
              <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                {t('pages.appIntro.languageEyebrow')}
              </Badge>
              <Text fw={800} size="1.7rem" lh={1.12}>
                {t('pages.appIntro.languageTitle')}
              </Text>
              <Text c="dimmed" size="sm">
                {t('pages.appIntro.languageDescription')}
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {SUPPORTED_LANGUAGES.map((language) => {
                const selected = language === selectedLanguage;
                return (
                  <UnstyledButton
                    key={language}
                    onClick={() => setSelectedLanguage(language)}
                    styles={{
                      root: {
                        textAlign: 'left',
                      },
                    }}
                    style={{
                      borderRadius: 18,
                      border: selected
                        ? '1px solid rgba(198, 109, 63, 0.46)'
                        : '1px solid rgba(39, 49, 43, 0.1)',
                      background: selected ? 'rgba(255, 243, 227, 0.96)' : '#fff',
                      boxShadow: selected ? '0 12px 24px rgba(72, 52, 34, 0.12)' : 'none',
                      padding: '14px 14px',
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <Box
                          w={32}
                          h={32}
                          style={{
                            borderRadius: 12,
                            background: selected
                              ? 'linear-gradient(160deg, #f1b385, #c96d3f)'
                              : 'linear-gradient(160deg, #f5f2eb, #ece4d8)',
                            color: selected ? '#fff' : '#6b5f53',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: 11,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}
                        >
                          {language}
                        </Box>
                        <Text fw={700} c={selected ? '#4f2d1e' : 'inherit'}>
                          {t(`languages.${language}.name`)}
                        </Text>
                      </Group>
                      <Box
                        w={20}
                        h={20}
                        style={{
                          borderRadius: 999,
                          border: selected
                            ? '6px solid #c96d3f'
                            : '1px solid rgba(43, 50, 46, 0.24)',
                          background: selected ? '#fff6ea' : 'transparent',
                        }}
                      />
                    </Group>
                  </UnstyledButton>
                );
              })}
            </SimpleGrid>

            <Button
              color="sun"
              c="#2d2208"
              radius="xl"
              size="lg"
              onClick={() => void handleContinue()}
            >
              {t('pages.appIntro.languageContinue')}
            </Button>

            <Group justify="center" gap={8}>
              <Box w={30} h={6} style={{ borderRadius: 999, background: '#d28354' }} />
              <Box w={8} h={6} style={{ borderRadius: 999, background: '#d9c5ac' }} />
              <Box w={8} h={6} style={{ borderRadius: 999, background: '#d9c5ac' }} />
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
