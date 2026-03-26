import { Button, Group, Menu, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type AppLanguage } from '../i18n';

interface LanguageSwitcherProps {
  fullWidth?: boolean;
  variant?: 'site' | 'admin';
}

export function LanguageSwitcher({ fullWidth = false, variant = 'site' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language) as AppLanguage;
  const isAdmin = variant === 'admin';

  return (
    <Menu position="bottom-end" shadow="md" width={220}>
      <Menu.Target>
        <Button
          variant={isAdmin ? 'default' : 'light'}
          color={isAdmin ? 'gray' : 'forest'}
          radius={isAdmin ? 'xs' : 'xl'}
          size="sm"
          fullWidth={fullWidth}
          aria-label={t('languages.switcherLabel')}
          styles={
            isAdmin
              ? {
                  root: {
                    borderColor: '#dbe1e8',
                    backgroundColor: '#ffffff',
                    color: '#111827',
                    fontWeight: 600,
                    minWidth: 60,
                  },
                }
              : undefined
          }
        >
          {t(`languages.${currentLanguage}.short`)}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('languages.switcherLabel')}</Menu.Label>
        {SUPPORTED_LANGUAGES.map((language) => (
          <Menu.Item
            key={language}
            onClick={() => {
              void i18n.changeLanguage(language);
            }}
          >
            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" fw={700}>
                {t(`languages.${language}.short`)}
              </Text>
              <Text size="sm" c="dimmed">
                {t(`languages.${language}.name`)}
              </Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
