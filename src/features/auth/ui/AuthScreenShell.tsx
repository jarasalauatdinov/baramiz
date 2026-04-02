import type { ReactNode } from 'react';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';

interface AuthScreenShellProps {
  badge: string;
  title: string;
  description: string;
  footerActionLabel?: string;
  footerActionTo?: string;
  footerHint?: string;
  children: ReactNode;
}

export function AuthScreenShell({
  badge,
  title,
  description,
  footerActionLabel,
  footerActionTo,
  footerHint,
  children,
}: AuthScreenShellProps) {
  return (
    <Center mih="100vh" bg="linear-gradient(180deg, #fffaf2 0%, #f5ecde 100%)" py="xl">
      <Container size={460} w="100%">
        <Paper
          withBorder
          radius="32px"
          p={{ base: 'lg', sm: 'xl' }}
          bg="white"
          style={{
            borderColor: 'rgba(193, 148, 117, 0.24)',
            boxShadow: '0 22px 48px rgba(65, 44, 27, 0.1)',
          }}
        >
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={8} maw={280}>
                <Badge color="sun" variant="light" radius="xl" w="fit-content" c="#5a420b">
                  {badge}
                </Badge>
                <Text fw={800} size="1.7rem" lh={1.08}>
                  {title}
                </Text>
                <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                  {description}
                </Text>
              </Stack>

              <Box
                w={52}
                h={52}
                style={{
                  borderRadius: 18,
                  background: 'linear-gradient(160deg, #f2b07f, #cf7141)',
                  boxShadow: '0 14px 26px rgba(183, 94, 48, 0.22)',
                }}
              />
            </Group>

            {children}

            {footerActionLabel && footerActionTo ? (
              <Stack gap={8}>
                {footerHint ? (
                  <Text size="sm" c="dimmed" ta="center">
                    {footerHint}
                  </Text>
                ) : null}
                <Button component={Link} to={footerActionTo} variant="subtle" color="forest" radius="xl">
                  {footerActionLabel}
                </Button>
              </Stack>
            ) : null}
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}

