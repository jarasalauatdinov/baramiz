import type { ReactNode } from 'react';
import { Badge, Box, Button, Container, Group, Paper, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { PageSection } from '../../../components/layout/PageSection';
import { publicUi } from '../../../shared/config/publicUi';

interface BookingFlowShellProps {
  step: number;
  totalSteps?: number;
  eyebrow: string;
  title: string;
  description: string;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}

export function BookingFlowShell({
  step,
  totalSteps = 4,
  eyebrow,
  title,
  description,
  backTo,
  backLabel,
  children,
}: BookingFlowShellProps) {
  return (
    <PageSection py={{ base: 14, md: 22 }}>
      <Container size={520}>
        <Stack gap="lg">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Stack gap={6}>
              <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                {eyebrow}
              </Badge>
              <Text fw={800} size="1.6rem" lh={1.08}>
                {title}
              </Text>
              <Text c="dimmed" size="sm" maw={380} style={{ lineHeight: 1.6 }}>
                {description}
              </Text>
            </Stack>

            <Group gap={6} wrap="nowrap">
              {Array.from({ length: totalSteps }).map((_, index) => {
                const active = index + 1 <= step;
                return (
                  <Box
                    key={index}
                    w={index + 1 === step ? 28 : 9}
                    h={6}
                    style={{
                      borderRadius: 999,
                      background: active ? '#d28354' : '#d8c7b0',
                      transition: 'width 180ms ease',
                    }}
                  />
                );
              })}
            </Group>
          </Group>

          <Paper
            withBorder
            radius={publicUi.radius.panel}
            p={{ base: 'lg', md: 'xl' }}
            bg={publicUi.background.panel}
            style={{
              borderColor: publicUi.border.default,
              boxShadow: publicUi.shadow.card,
            }}
          >
            <Stack gap="lg">{children}</Stack>
          </Paper>

          {backTo && backLabel ? (
            <Button component={Link} to={backTo} variant="subtle" color="forest" radius="xl">
              {backLabel}
            </Button>
          ) : null}
        </Stack>
      </Container>
    </PageSection>
  );
}

