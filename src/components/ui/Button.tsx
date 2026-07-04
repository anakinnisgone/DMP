import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle';
type Size = 'sm' | 'md' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-discord-blurple text-white hover:bg-discord-blurple-hover shadow-sm active:scale-[0.98] disabled:bg-discord-muted disabled:text-discord-faint',
  secondary:
    'bg-discord-elevated text-discord-text border border-discord-border hover:bg-discord-hover disabled:bg-discord-surface disabled:text-discord-faint disabled:border-discord-faint',
  ghost: 'text-discord-muted hover:text-discord-text hover:bg-white/5 disabled:text-discord-faint disabled:hover:bg-transparent',
  danger: 'bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98] disabled:bg-red-500/50 disabled:text-white/70',
  subtle: 'bg-white/5 text-discord-text hover:bg-white/10 border border-white/5 disabled:bg-white/2 disabled:text-discord-faint disabled:border-white/2',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  icon: 'h-9 w-9 justify-center',
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex select-none items-center rounded-lg font-medium transition-all duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}
