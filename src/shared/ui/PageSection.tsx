import { Box, Container, type MantineSpacing, type StyleProp } from '@mantine/core';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

interface PageSectionProps {
  children: ReactNode;
  size?: ComponentProps<typeof Container>['size'];
  py?: StyleProp<MantineSpacing | number | string>;
  background?: CSSProperties['background'];
  withContainer?: boolean;
}

export function PageSection({
  children,
  size = 'xl',
  py = { base: 20, md: 42 },
  background,
  withContainer = true,
}: PageSectionProps) {
  const content = withContainer ? <Container size={size}>{children}</Container> : children;

  return (
    <Box
      component="section"
      py={py}
      style={{
        position: 'relative',
        ...((background ? { background } : {}) as CSSProperties),
      }}
    >
      {content}
    </Box>
  );
}
