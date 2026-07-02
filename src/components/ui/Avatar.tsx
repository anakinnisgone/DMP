import type { Role } from '../../types';
import { ROLE_CONFIG } from '../../utils/constants';
import { initials, nameColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string | null;
  role?: Role;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

export function Avatar({ name, src, role, size = 'md', ring = false }: AvatarProps) {
  const ringCls = ring && role ? `ring-2 ring-offset-2 ring-offset-discord-bg ${ROLE_CONFIG[role].ring}` : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover ${ringCls}`}
      />
    );
  }

  return (
    <div
      className={`${SIZES[size]} grid shrink-0 place-items-center rounded-full font-semibold text-white/90 ${ringCls}`}
      style={{ backgroundColor: nameColor(name) }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
