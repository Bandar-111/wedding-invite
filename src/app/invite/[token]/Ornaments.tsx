// Lightweight, hand-drawn SVG ornaments for the invitation card — no
// images, so they stay crisp at any size and add only a few KB total.

// Full-bleed page background: a deep emerald/night wash with a soft
// marble grain (native SVG turbulence, not a raster image) so it stays
// crisp and near-weightless while adding depth behind the card.
export function PageBackground({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="bg-glow-top" cx="15%" cy="-5%" r="70%">
          <stop offset="0%" stopColor="#1d4a41" />
          <stop offset="100%" stopColor="#0d2b27" />
        </radialGradient>
        <radialGradient id="bg-glow-bottom" cx="90%" cy="105%" r="65%">
          <stop offset="0%" stopColor="#173b34" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d2b27" stopOpacity="0" />
        </radialGradient>
        <filter id="marble-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.9"
            numOctaves="2"
            seed="11"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.79  0 0 0 0 0.68  0 0 0 0 0.45  0 0 0 0.05 0"
          />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="#0d2b27" />
      <rect width="100%" height="100%" fill="url(#bg-glow-top)" />
      <rect width="100%" height="100%" fill="url(#bg-glow-bottom)" />
      <rect width="100%" height="100%" filter="url(#marble-grain)" />
    </svg>
  );
}

// A soft, rough-edged gold brush swipe anchored at a corner. Rotate /
// mirror the wrapper element to place it at any corner.
export function BrushCorner({ className, seed = 7 }: { className?: string; seed?: number }) {
  const roughId = `brush-rough-${seed}`;
  const gradId = `brush-gold-${seed}`;
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true" focusable="false">
      <defs>
        <filter id={roughId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.05"
            numOctaves="3"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gold-light)" stopOpacity="0.95" />
          <stop offset="45%" stopColor="var(--gold)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--gold-dark)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${roughId})`}>
        <path
          d="M-50 30 C 30 -20, 100 0, 150 45 C 195 85, 175 135, 215 175 C 250 210, 300 195, 330 240 L 330 -50 L -50 -50 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M-40 95 C 25 65, 65 105, 55 155 C 50 185, 15 195, 4 225"
          stroke="var(--gold-light)"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M60 -10 C 90 25, 85 60, 120 80"
          stroke="var(--gold)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

export function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21s7-7.16 7-12.14A7 7 0 1 0 5 8.86C5 13.84 12 21 12 21Z" />
      <circle cx="12" cy="8.7" r="2.6" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.4" />
      <path d="M3.5 9.8h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

export function QrIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1" />
      <path d="M14 14h3M14 17.5h6.5M20.5 14v6.5M17.2 20.5h-3.2v-3" />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-2" aria-hidden="true">
      <span className="h-px w-10 bg-gold/40 sm:w-14" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-10 bg-gold/40 sm:w-14" />
    </div>
  );
}
