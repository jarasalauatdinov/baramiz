import { Paper, SimpleGrid, Stack } from '@mantine/core';
import type { ReactNode } from 'react';
import { publicUi } from '../../shared/config/publicUi';
import { PageHeaderBlock } from './PageHeaderBlock';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  visual?: ReactNode;
}

export function HeroSection({
  eyebrow,
  title,
  description,
  actions,
  meta,
  visual,
}: HeroSectionProps) {
  return (
    <Paper className={styles.shell} p={{ base: 'xl', md: '3rem' }} radius={publicUi.radius.hero}>
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={{ base: 'xl', lg: '2.9rem' }} className={styles.grid}>
        <Stack gap="xl" className={styles.content}>
          <PageHeaderBlock
            eyebrow={eyebrow}
            title={title}
            description={description}
            size="page"
            mb={0}
          />
          {actions}
          {meta}
        </Stack>

        {visual ? (
          <div className={`${styles.visualPanel} ${styles.hideVisualBelow1215}`}>
            <div className={styles.visualBody}>{visual}</div>
          </div>
        ) : null}
      </SimpleGrid>
    </Paper>
  );
}
