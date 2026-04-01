import { Badge, Box, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { ServiceCardData, ServiceKind } from '../entities/service/model/types';
import { publicUi } from '../shared/config/publicUi';

interface ServiceCardProps {
  item: ServiceCardData;
  actionLabel?: string;
  kind?: ServiceKind;
}

interface ServiceGlyphProps {
  kind: ServiceKind;
}

function ServiceGlyph({ kind }: ServiceGlyphProps) {
  const stroke = '#1f4337';

  const commonProps = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (kind) {
    case 'accommodation':
      return (
        <svg {...commonProps}>
          <path d="M4 17V8.5A2.5 2.5 0 0 1 6.5 6H17a3 3 0 0 1 3 3v8" />
          <path d="M4 12h16" />
          <path d="M7.5 12V9.75A1.75 1.75 0 0 1 9.25 8h1.5A1.25 1.25 0 0 1 12 9.25V12" />
          <path d="M4 17h16" />
        </svg>
      );
    case 'guides':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 19a7 7 0 0 1 14 0" />
          <path d="M18 6l2-2" />
          <path d="M4 10l2-2" />
        </svg>
      );
    case 'transport':
      return (
        <svg {...commonProps}>
          <path d="M5 15V9.5A2.5 2.5 0 0 1 7.5 7h9A2.5 2.5 0 0 1 19 9.5V15" />
          <path d="M3 15h18" />
          <path d="M7 15v2" />
          <path d="M17 15v2" />
          <circle cx="8" cy="15" r="1.2" fill={stroke} stroke="none" />
          <circle cx="16" cy="15" r="1.2" fill={stroke} stroke="none" />
        </svg>
      );
    case 'agencies':
    case 'tour_support':
      return (
        <svg {...commonProps}>
          <path d="M5 19V8l7-3 7 3v11" />
          <path d="M9 19v-5h6v5" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
        </svg>
      );
    case 'food':
      return (
        <svg {...commonProps}>
          <path d="M8 4v8" />
          <path d="M6 4v4" />
          <path d="M10 4v4" />
          <path d="M14 4v15" />
          <path d="M14 10c2 0 4-1.5 4-4V4" />
        </svg>
      );
    case 'tickets':
      return (
        <svg {...commonProps}>
          <path d="M5 8.5A2.5 2.5 0 0 1 7.5 6H18v4a2 2 0 0 0 0 4v4H7.5A2.5 2.5 0 0 1 5 15.5z" />
          <path d="M11 6v12" strokeDasharray="2 2" />
        </svg>
      );
    case 'experiences':
    default:
      return (
        <svg {...commonProps}>
          <path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.5L12 16.5 7.2 19l.9-5.5-3.9-3.8 5.4-.8L12 4z" />
        </svg>
      );
  }
}

const cardAccentByKind: Record<ServiceKind, string> = {
  agencies: 'rgba(88, 124, 103, 0.18)',
  guides: 'rgba(117, 164, 142, 0.18)',
  transport: 'rgba(86, 126, 154, 0.18)',
  accommodation: 'rgba(212, 176, 113, 0.22)',
  experiences: 'rgba(188, 143, 87, 0.18)',
  food: 'rgba(196, 121, 86, 0.18)',
  tickets: 'rgba(127, 123, 182, 0.18)',
  tour_support: 'rgba(90, 145, 123, 0.2)',
};

export function ServiceCard({ item, actionLabel, kind }: ServiceCardProps) {
  const { t } = useTranslation();
  const resolvedKind = kind ?? 'experiences';
  const resolvedActionLabel = actionLabel ?? item.contactLabel ?? t('common.viewDetails');
  const coverage = item.availableCities && item.availableCities.length > 0
    ? item.availableCities.join(', ')
    : item.city;

  return (
    <Paper
      withBorder
      p={{ base: 'md', md: 'xl' }}
      radius={publicUi.radius.card}
      h="100%"
      style={{
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <Stack justify="space-between" h="100%" gap="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Box>
              <Text size="xs" fw={700} c="sun.8" tt="uppercase" style={{ letterSpacing: '0.08em' }}>
                {item.meta}
              </Text>
              <Title order={3} size="h4" mt={10} style={{ lineHeight: 1.22 }}>
                {item.title}
              </Title>
            </Box>

            <Box
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                borderRadius: 16,
                display: 'grid',
                placeItems: 'center',
                background: cardAccentByKind[resolvedKind],
                border: '1px solid rgba(31,67,55,0.08)',
              }}
            >
              <ServiceGlyph kind={resolvedKind} />
            </Box>
          </Group>

          <Text c="dimmed" size="sm" style={{ lineHeight: 1.72 }}>
            {item.description}
          </Text>

          <Stack gap={8}>
            {coverage ? (
              <Text size="sm" c="dimmed">
                <Text span fw={700} c="dark">{t('pages.services.card.coverageLabel')}:</Text>{' '}
                {coverage}
              </Text>
            ) : null}
            {item.availability ? (
              <Text size="sm" c="dimmed">
                <Text span fw={700} c="dark">{t('pages.services.card.availabilityLabel')}:</Text>{' '}
                {item.availability}
              </Text>
            ) : null}
            {item.note ? (
              <Text size="sm" c="dimmed">
                <Text span fw={700} c="dark">{t('pages.services.card.noteLabel')}:</Text>{' '}
                {item.note}
              </Text>
            ) : null}
          </Stack>

          <Group gap="xs" wrap="wrap">
            {item.tags.map((tag) => (
              <Badge key={tag} color="sun" variant="light" radius="xl" c="#5a420b">
                {tag}
              </Badge>
            ))}
          </Group>
        </Stack>

        {item.contactHref ? (
          <Button component="a" href={item.contactHref} target={item.contactHref.startsWith('http') ? '_blank' : undefined} rel={item.contactHref.startsWith('http') ? 'noreferrer' : undefined} variant="light" color="forest" radius="xl" fullWidth>
            {resolvedActionLabel}
          </Button>
        ) : (
          <Button variant="light" color="forest" radius="xl" fullWidth>
            {resolvedActionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
