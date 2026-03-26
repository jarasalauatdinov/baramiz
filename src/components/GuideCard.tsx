import { Badge, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GuideProfile } from '../data/guides';
import { publicUi } from '../shared/config/publicUi';

interface GuideCardProps {
  guide: GuideProfile;
}

export function GuideCard({ guide }: GuideCardProps) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState(guide.image);

  return (
    <Paper
      withBorder
      p={0}
      radius={publicUi.radius.card}
      shadow="xs"
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
        style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', background: '#f5ead2' }}
      />

      <Stack gap="md" p="lg">
        <div>
          <Title order={3} size="h4">
            {guide.name}
          </Title>
          <Text size="sm" c="dimmed" mt={4}>
            {guide.city}
          </Text>
        </div>

        <Group gap="xs">
          {guide.languages.map((language) => (
            <Badge key={language} color="sun" variant="light" radius="xl" c="#5a420b">
              {language}
            </Badge>
          ))}
        </Group>

        <Stack gap={6}>
          <Text size="xs" fw={700} tt="uppercase" c="sun.8" style={{ letterSpacing: '0.08em' }}>
            {t('homeV2.guides.specialtiesTitle', { defaultValue: 'Specialties' })}
          </Text>
          <Group gap="xs">
            {guide.specialties.map((specialty) => (
              <Badge key={specialty} color="forest" variant="light" radius="xl">
                {specialty}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Group justify="space-between" align="center" wrap="wrap">
          <Text fw={700} c="forest.8">
            {guide.contact}
          </Text>
          <Button component="a" href={`tel:${guide.contact.replace(/\s+/g, '')}`} color="sun" c="#2c2006">
            {t('homeV2.guides.contactAction', { defaultValue: 'Contact guide' })}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
