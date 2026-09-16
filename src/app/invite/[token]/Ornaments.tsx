// Lightweight, hand-drawn SVG ornaments for the invitation card — no
// images, so they stay crisp at any size and add only a few KB total.

export function FloralCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 110" className={className} aria-hidden="true" focusable="false">
      <defs>
        <g id="invite-bloom">
          <ellipse cx="0" cy="-6" rx="3.2" ry="5.4" fill="var(--gold-light)" />
          <ellipse cx="0" cy="-6" rx="3.2" ry="5.4" fill="var(--gold-light)" transform="rotate(72)" />
          <ellipse cx="0" cy="-6" rx="3.2" ry="5.4" fill="var(--gold-light)" transform="rotate(144)" />
          <ellipse cx="0" cy="-6" rx="3.2" ry="5.4" fill="var(--gold-light)" transform="rotate(216)" />
          <ellipse cx="0" cy="-6" rx="3.2" ry="5.4" fill="var(--gold-light)" transform="rotate(288)" />
          <circle cx="0" cy="0" r="2.4" fill="var(--gold)" />
        </g>
        <path id="invite-leaf" d="M0 0 C 4 -2.4, 9 -2.4, 13 0 C 9 2.4, 4 2.4, 0 0 Z" fill="var(--olive)" />
      </defs>

      <g strokeLinecap="round" fill="none">
        <path d="M6 6 C 26 12, 40 28, 46 52" stroke="var(--olive)" strokeWidth="2" />
        <path d="M12 8 C 22 18, 27 26, 30 38" stroke="var(--olive-light)" strokeWidth="1.5" />
        <path d="M8 20 C 18 24, 24 30, 24 40" stroke="var(--olive-light)" strokeWidth="1.5" />
        <path d="M4 14 C 12 22, 14 34, 12 46" stroke="var(--olive-light)" strokeWidth="1.3" />
      </g>

      <use href="#invite-leaf" x="14" y="10" transform="rotate(35 14 10)" opacity="0.95" />
      <use href="#invite-leaf" x="9" y="22" transform="rotate(70 9 22)" opacity="0.9" />
      <use href="#invite-leaf" x="24" y="16" transform="rotate(-15 24 16)" opacity="0.85" />
      <use href="#invite-leaf" x="20" y="34" transform="rotate(60 20 34)" opacity="0.85" />
      <use href="#invite-leaf" x="33" y="30" transform="rotate(10 33 30)" opacity="0.8" />
      <use href="#invite-leaf" x="10" y="40" transform="rotate(95 10 40)" opacity="0.75" />

      <use href="#invite-bloom" x="46" y="52" />
      <use href="#invite-bloom" x="27" y="25" transform="scale(0.75)" />
      <use href="#invite-bloom" x="16" y="38" transform="scale(0.6)" />
      <circle cx="36" cy="14" r="1.6" fill="var(--gold)" opacity="0.8" />
      <circle cx="6" cy="30" r="1.4" fill="var(--gold)" opacity="0.7" />
    </svg>
  );
}

export function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 36" className={className} aria-hidden="true" focusable="false">
      <defs>
        <g id="flourish-bloom">
          <ellipse cx="0" cy="-5" rx="2.6" ry="4.4" fill="var(--gold-light)" />
          <ellipse cx="0" cy="-5" rx="2.6" ry="4.4" fill="var(--gold-light)" transform="rotate(72)" />
          <ellipse cx="0" cy="-5" rx="2.6" ry="4.4" fill="var(--gold-light)" transform="rotate(144)" />
          <ellipse cx="0" cy="-5" rx="2.6" ry="4.4" fill="var(--gold-light)" transform="rotate(216)" />
          <ellipse cx="0" cy="-5" rx="2.6" ry="4.4" fill="var(--gold-light)" transform="rotate(288)" />
          <circle cx="0" cy="0" r="2" fill="var(--gold)" />
        </g>
      </defs>
      <g stroke="var(--olive)" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M100 18 C 82 12, 66 16, 46 10" />
        <path d="M100 18 C 118 12, 134 16, 154 10" />
      </g>
      <circle cx="72" cy="14" r="1.5" fill="var(--olive-light)" />
      <circle cx="128" cy="14" r="1.5" fill="var(--olive-light)" />
      <g transform="translate(46 10) scale(0.8)">
        <use href="#flourish-bloom" />
      </g>
      <g transform="translate(154 10) scale(0.8)">
        <use href="#flourish-bloom" />
      </g>
      <g transform="translate(100 18)">
        <use href="#flourish-bloom" />
      </g>
    </svg>
  );
}

// Full-bleed page background: a soft warm wash plus a faint repeating
// sprig motif (native SVG <pattern>, not a raster image) so it stays
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
        <radialGradient id="bg-wash-top" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#f3ecdc" />
        </radialGradient>
        <radialGradient id="bg-wash-bottom" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="var(--olive-light)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--olive-light)" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="bg-sprig"
          width="130"
          height="130"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(14)"
        >
          <g strokeLinecap="round" fill="none" opacity="0.55">
            <path d="M14 118 C 24 106, 26 92, 21 78" stroke="var(--olive)" strokeWidth="1.1" />
            <ellipse
              cx="17"
              cy="96"
              rx="3.2"
              ry="1.7"
              fill="var(--olive)"
              transform="rotate(35 17 96)"
              opacity="0.7"
            />
            <ellipse
              cx="24"
              cy="86"
              rx="3.2"
              ry="1.7"
              fill="var(--olive)"
              transform="rotate(-25 24 86)"
              opacity="0.7"
            />
          </g>
          <circle cx="21" cy="76" r="2" fill="var(--gold)" opacity="0.55" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg-wash-top)" />
      <rect width="100%" height="100%" fill="url(#bg-wash-bottom)" />
      <rect width="100%" height="100%" fill="url(#bg-sprig)" />
    </svg>
  );
}

export function Divider() {
  return (
    <div className="mx-auto my-6 flex items-center justify-center gap-2" aria-hidden="true">
      <span className="h-px w-10 bg-gold-light sm:w-14" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
      <span className="h-px w-10 bg-gold-light sm:w-14" />
    </div>
  );
}
