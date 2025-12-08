'use client';

import { Badge } from '@/components/ui/Badge';

interface StatusBadgeProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    pending: 'warning' as const,
    processing: 'info' as const,
    completed: 'success' as const,
    failed: 'error' as const,
  };

  const labels = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
}