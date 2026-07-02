import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Search, Inbox } from 'lucide-react';

// ---------------------------------------------------------------------------
export function SearchInput({
  value,
  onChange,
  placeholder = 'Ara...',
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-discord-faint"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-discord-border/60 bg-discord-surface/30 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-discord-faint">
        <Icon size={22} />
      </span>
      <div>
        <p className="font-semibold text-discord-text">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-sm text-discord-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-discord-blurple/10 text-discord-blurple">
            <Icon size={22} />
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-discord-text">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-discord-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function SectionTitle({
  children,
  icon: Icon,
  action,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-discord-muted">
        {Icon && <Icon size={15} />}
        {children}
      </h2>
      {action}
    </div>
  );
}
