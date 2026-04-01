import { Button, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { publicUi } from '../../../shared/config/publicUi';

interface OptionItem {
  value: string;
  label: string;
  description?: string;
}

interface PlannerOptionGroupProps {
  label: string;
  description?: string;
  options: OptionItem[];
  multiple?: boolean;
  value: string | null | string[];
  onToggle: (value: string) => void;
  error?: string;
}

export function PlannerOptionGroup({
  label,
  description,
  options,
  multiple = false,
  value,
  onToggle,
  error,
}: PlannerOptionGroupProps) {
  const { t } = useTranslation();
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  const columns = multiple ? { base: 1, sm: 2, xl: 3 } : { base: 1, md: 2 };

  return (
    <Stack gap="sm">
      <div>
        <Text fw={700}>{label}</Text>
        {description ? (
          <Text size="sm" c="dimmed" mt={4}>
            {description}
          </Text>
        ) : null}
      </div>

      <SimpleGrid cols={columns} spacing="sm">
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);

          return (
            <Paper
              key={option.value}
              withBorder
              p={{ base: 'md', md: 'lg' }}
              radius={publicUi.radius.cardInner}
              onClick={() => onToggle(option.value)}
              style={{
                borderColor: selected ? 'rgba(229,182,47,0.44)' : 'rgba(23,49,42,0.08)',
                background: selected ? '#fff8e6' : publicUi.background.surface,
                boxShadow: selected ? '0 10px 24px rgba(229, 182, 47, 0.10)' : 'none',
                cursor: 'pointer',
                minHeight: 156,
              }}
            >
              <Stack gap="md" h="100%" justify="space-between">
                <div>
                  <Text fw={700} style={{ lineHeight: 1.28 }}>
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text size="sm" c="dimmed" mt={6} style={{ lineHeight: 1.6 }}>
                      {option.description}
                    </Text>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant={selected ? 'filled' : 'light'}
                  color={selected ? 'sun' : 'gray'}
                  c={selected ? '#2d2208' : undefined}
                  radius="xl"
                  size="md"
                  fullWidth
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggle(option.value);
                  }}
                >
                  {selected
                    ? t('routeGenerator.optionGroup.selected', { defaultValue: 'Selected' })
                    : multiple
                      ? t('routeGenerator.optionGroup.add', { defaultValue: 'Add' })
                      : t('routeGenerator.optionGroup.choose', { defaultValue: 'Choose' })}
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>

      {error ? (
        <Text size="sm" c="red">
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
