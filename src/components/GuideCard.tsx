import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuideProfile } from '../entities/guide/model/types';
import { publicUi } from '../shared/config/publicUi';

interface GuideCardProps {
  guide: GuideProfile;
}

export function GuideCard({ guide }: GuideCardProps) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState(guide.image);
  const availableCitiesLabel = guide.availableCities.join(', ');

  return (
    <Paper
      withBorder
      p={0}
      radius={publicUi.radius.card}
      h="100%"
      style={{
        overflow: 'hidden',
        borderColor: publicUi.border.default,
        background: publicUi.background.surface,
        boxShadow: publicUi.shadow.cardSoft,
      }}
    >
      <img
        src={imageSrc}
        alt={guide.name}
        onError={() => setImageSrc(guide.image)}
        style={{ width: '100%', aspectRatio: '16 / 11', objectFit: 'cover', background: '#f5ead2' }}
      />

      <Stack gap="md" p={{ base: 'md', md: 'xl' }}>
        <div>
          <Title order={3} size="h4" style={{ lineHeight: 1.18 }}>
            {guide.name}
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            {guide.city}
          </Text>
        </div>

        <Text c="dimmed" size="sm" style={{ lineHeight: 1.7 }}>
          {guide.shortBio}
        </Text>

        <Group gap="xs" wrap="wrap">
          {guide.languages.map((language) => (
            <Badge key={language} color="sun" variant="light" radius="xl" c="#5a420b">
              {language}
            </Badge>
          ))}
        </Group>

        <Stack gap={6}>
          <Text size="xs" fw={700} tt="uppercase" c="sun.8" style={{ letterSpacing: '0.08em' }}>
            {t('pages.guides.card.specialtiesLabel')}
          </Text>
          <Group gap="xs" wrap="wrap">
            {guide.specialties.map((specialty) => (
              <Badge key={specialty} color="forest" variant="light" radius="xl">
                {specialty}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap={8}>
          <Text size="sm" c="dimmed">
            <Text span fw={700} c="dark">{t('pages.guides.card.coverageLabel')}:</Text>{' '}
            {availableCitiesLabel}
          </Text>
          <Text size="sm" c="dimmed">
            <Text span fw={700} c="dark">{t('pages.guides.card.regionExpertiseLabel')}:</Text>{' '}
            {guide.regionExpertise.join(', ')}
          </Text>
          <Text size="sm" c="dimmed">
            <Text span fw={700} c="dark">{t('pages.guides.card.availabilityLabel')}:</Text>{' '}
            {guide.availability}
          </Text>
        </Stack>

        <Stack gap="sm">
          <Text fw={700} size="sm" c="forest.8">
            {guide.contact.label}
          </Text>
          <Button component="a" href={guide.contact.href} target={guide.contact.href.startsWith('http') ? '_blank' : undefined} rel={guide.contact.href.startsWith('http') ? 'noreferrer' : undefined} color="sun" c="#2c2006" radius="xl" fullWidth>
            {t('pages.guides.card.contactAction')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
