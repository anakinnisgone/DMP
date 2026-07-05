import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
  /** Konum: üst (varsayılan) veya alt */
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * Hafif, CSS tabanlı tooltip. JS ölçümü yok; hover/focus ile görünür,
 * prefers-reduced-motion'a saygılıdır (yalnızca opacity animasyonu).
 */
export function Tooltip({ label, children, side = 'top', className = '' }: TooltipProps) {
  const pos =
    side === 'top'
      ? 'bottom-full left-1/2 mb-1.5 -translate-x-1/2'
      : 'top-full left-1/2 mt-1.5 -translate-x-1/2';

  return (
    <span className={`group/tt relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${pos} z-50 whitespace-nowrap rounded-lg border border-white/10 bg-discord-darker/95 px-2 py-1 text-[11px] font-medium text-discord-text opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100`}
      >
        {label}
      </span>
    </span>
  );
}
