import { Icon } from '@/assets/icons';
import { IconName } from '@/types';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-illustration">
        <Icon name={icon} className="size-8" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
