/**
 * Discord Manager Panel - Compact Logo (SVG)
 * Küçük UI alanları için (header, sidebar, loading screens)
 */
export function CompactLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="compact-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" opacity="1" />
          <stop offset="100%" stopColor="currentColor" opacity="0.8" />
        </linearGradient>
      </defs>

      {/* Crown */}
      <g transform="translate(128, 50)">
        <circle cx="0" cy="0" r="2" fill="url(#compact-gradient)" />
        <path
          d="M -4 3 L -2 0 L 0 5 L 2 0 L 4 3 L 2 7 L -2 7 Z"
          fill="url(#compact-gradient)"
        />
      </g>

      {/* Sword */}
      <g transform="translate(128, 70)">
        <circle cx="0" cy="20" r="2.5" fill="url(#compact-gradient)" />
        <path
          d="M -1.5 20 L 0 -5 L 1.5 20 Z"
          fill="url(#compact-gradient)"
          stroke="url(#compact-gradient)"
          strokeWidth="0.5"
        />
      </g>

      {/* DMP Text */}
      <text
        x="128"
        y="140"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#compact-gradient)"
        letterSpacing="1"
      >
        DMP
      </text>
    </svg>
  );
}
