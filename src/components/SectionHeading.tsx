import type { ReactNode } from 'react';
import { PageHeaderBlock } from './layout/PageHeaderBlock';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <PageHeaderBlock
      eyebrow={eyebrow}
      title={title}
      description={description}
      action={action}
      size="section"
    />
  );
}
