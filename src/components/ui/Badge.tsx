import type { ReactNode } from 'react';
import type { Role, TaskPriority, TaskStatus, PromotionStatus, DisciplineRecord } from '../../types';
import {
  PRIORITY_CONFIG,
  PROMOTION_CONFIG,
  ROLE_CONFIG,
  STATUS_CONFIG,
} from '../../utils/constants';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role, showIcon = true }: { role: Role; showIcon?: boolean }) {
  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;
  return (
    <Badge className={cfg.badge}>
      {showIcon && <Icon size={12} />}
      {cfg.label}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <Badge className={cfg.badge}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.solid}`} />
      {cfg.label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge className={cfg.badge}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </Badge>
  );
}

export function PromotionBadge({ status }: { status: PromotionStatus }) {
  const cfg = PROMOTION_CONFIG[status];
  return <Badge className={cfg.badge}>{cfg.label}</Badge>;
}

const SEVERITY_CONFIG: Record<DisciplineRecord['severity'], { cls: string; label: string }> = {
  low: { cls: 'bg-yellow-500/15 text-yellow-300', label: 'Hafif' },
  medium: { cls: 'bg-orange-500/15 text-orange-300', label: 'Orta' },
  high: { cls: 'bg-red-500/15 text-red-300', label: 'Ağır' },
};

export function SeverityBadge({ severity }: { severity: DisciplineRecord['severity'] }) {
  const cfg = SEVERITY_CONFIG[severity];
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
