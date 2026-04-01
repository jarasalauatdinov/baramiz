import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { routePaths } from '../router/paths';

export function NotFoundPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith(routePaths.admin.root);

  return (
    <Container size="md" py={{ base: 48, md: 80 }}>
      <Paper withBorder radius="28px" p={{ base: 'xl', md: '2.2rem' }} bg="white">
        <Stack gap="lg" align="flex-start">
          <Badge color="gray" variant="light" radius="xl">
            404
          </Badge>

          <div>
            <Title order={1} style={{ lineHeight: 1.08 }}>
              {t('pages.notFound.title')}
            </Title>
            <Text mt="sm" size="lg" c="dimmed" style={{ lineHeight: 1.7 }}>
              {isAdminPath
                ? t('pages.notFound.adminDescription')
                : t('pages.notFound.description')}
            </Text>
          </div>

          <Group gap="sm" wrap="wrap">
            {isAdminPath ? (
              <Button component={Link} to={routePaths.admin.root} color="forest">
                {t('pages.notFound.adminAction')}
              </Button>
            ) : (
              <Button component={Link} to={routePaths.home} color="sun" c="#2d2208">
                {t('pages.notFound.homeAction')}
              </Button>
            )}
            <Button component={Link} to={routePaths.destinations} variant="light" color="forest">
              {t('pages.notFound.destinationsAction')}
            </Button>
            {!isAdminPath ? (
              <Button component={Link} to={routePaths.routeGenerator} variant="subtle">
                {t('pages.notFound.routeAction')}
              </Button>
            ) : null}
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
