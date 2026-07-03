/**
 * Discord Manager Panel - Crest Logo (SVG)
 * Mor-Siyah marka kimliği
 */
export function CrestLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield base */}
      <path
        d="M12 2L4 5V11.5C4 17.5 12 21 12 21C12 21 20 17.5 20 11.5V5L12 2Z"
        fill="url(#crest-gradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner accent - Crest crown detail */}
      <path
        d="M12 5L8 7.5V11C8 15 12 18 12 18C12 18 16 15 16 11V7.5L12 5Z"
        fill="currentColor"
        opacity="0.3"
      />

      {/* Center star - Authority symbol */}
      <path
        d="M12 8L14 13L19 13H15.5L17 18L12 14.5L7 18L8.5 13H5L10 13L12 8Z"
        fill="currentColor"
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="crest-gradient" x1="4" y1="2" x2="20" y2="21">
          <stop offset="0%" stopColor="#5865f2" />
          <stop offset="100%" stopColor="#4752c4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
