/**
 * Discord Manager Panel - Signet Logo (SVG)
 * Avatar ve Discord Bot için (circular badge)
 */
export function SignetLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="signet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" opacity="1" />
          <stop offset="100%" stopColor="currentColor" opacity="0.8" />
        </linearGradient>
      </defs>

      {/* Outer Circle */}
      <circle cx="128" cy="128" r="120" fill="url(#signet-gradient)" opacity="0.9" />

      {/* Inner Circle Border */}
      <circle cx="128" cy="128" r="115" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      {/* Crown Top */}
      <g transform="translate(128, 70)">
        <circle cx="0" cy="0" r="3" fill="white" opacity="0.8" />
        <path
          d="M -6 4 L -3 0 L 0 6 L 3 0 L 6 4 L 4 9 L -4 9 Z"
          fill="white"
          opacity="0.8"
        />
      </g>

      {/* Center Sword */}
      <g transform="translate(128, 85)">
        <circle cx="0" cy="30" r="4" fill="white" opacity="0.8" />
        <rect x="-2.5" y="22" width="5" height="12" fill="white" opacity="0.8" />
        <path
          d="M -2.5 22 L -0.5 -8 L 0 -20 L 0.5 -8 L 2.5 22 Z"
          fill="white"
          opacity="0.8"
          stroke="white"
          strokeWidth="0.5"
        />
      </g>

      {/* DMP Text */}
      <text
        x="128"
        y="155"
        fontFamily="Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
        opacity="0.9"
        letterSpacing="2"
      >
        DMP
      </text>
    </svg>
  );
}
