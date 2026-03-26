import type { ReactNode } from 'react';
import classes from './AdminPageHeader.module.css';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className={classes.header}>
      <div className={classes.copy}>
        <div className={classes.title}>{title}</div>
        {description ? <div className={classes.description}>{description}</div> : null}
      </div>
      {action ? <div className={classes.action}>{action}</div> : null}
    </div>
  );
}
