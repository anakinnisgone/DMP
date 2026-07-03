import { Shield } from 'lucide-react';

/**
 * Discord Manager Panel - Compact Logo
 * Küçük UI alanları için (header, sidebar, loading screens)
 * DMP marka kimliğinin kompakt versiyonu
 */
export function CompactLogo({ size = 20 }: { size?: number }) {
  return (
    <Shield
      size={size}
      className="text-white"
      fill="currentColor"
      strokeWidth={1.5}
    />
  );
}
