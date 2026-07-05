/**
 * Discord Manager Panel - "D" Marka Logosu (v0.8.7+)
 *
 * Yuvarlatılmış blurple kare üzerinde beyaz, geometrik "D" harfi.
 * build/icon.ico ve public/favicon.svg ile aynı çizimden üretilir
 * (bkz. scripts/generate-brand.js) — marka her yerde birebir aynıdır.
 */
interface DLogoProps {
  size?: number;
  className?: string;
  /** true: yalnızca beyaz D (renkli bir kapsayıcının içinde kullanmak için) */
  plain?: boolean;
}

export function DLogo({ size = 24, className = '', plain = false }: DLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {!plain && (
        <>
          <rect width="512" height="512" rx="118" fill="url(#dlogo-bg)" />
          <rect
            x="1.5"
            y="1.5"
            width="509"
            height="509"
            rx="116.5"
            stroke="white"
            strokeOpacity="0.08"
            strokeWidth="3"
          />
        </>
      )}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M164 124H272C350 124 402 178 402 256C402 334 350 388 272 388H164V124ZM230 186V326H266C310 326 338 300 338 256C338 212 310 186 266 186H230Z"
        fill={plain ? 'currentColor' : 'white'}
      />
      {!plain && (
        <defs>
          <linearGradient id="dlogo-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B67F5" />
            <stop offset="1" stopColor="#4F5BE8" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
