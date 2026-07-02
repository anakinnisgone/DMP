import { clamp } from '../../utils/helpers';

interface ProgressBarProps {
  value: number;
  className?: string;
  color?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  className = '',
  color,
  size = 'sm',
  showLabel = false,
}: ProgressBarProps) {
  const v = clamp(value);
  const auto =
    v >= 80 ? 'bg-green-500' : v >= 50 ? 'bg-discord-blurple' : v >= 25 ? 'bg-amber-500' : 'bg-red-500';
  const bar = color ?? auto;
  const height = size === 'md' ? 'h-2' : 'h-1.5';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 overflow-hidden rounded-full bg-white/5 ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${bar}`}
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-9 shrink-0 text-right text-[11px] font-semibold tabular-nums text-discord-muted">
          {v}%
        </span>
      )}
    </div>
  );
}
