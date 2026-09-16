// Lightweight, hand-drawn SVG floral ornament — no images, so it stays
// crisp at any size and adds ~1KB instead of a heavy raster asset.
export default function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 110"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
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
      </g>

      <use href="#invite-leaf" x="14" y="10" transform="rotate(35 14 10)" opacity="0.95" />
      <use href="#invite-leaf" x="9" y="22" transform="rotate(70 9 22)" opacity="0.9" />
      <use href="#invite-leaf" x="24" y="16" transform="rotate(-15 24 16)" opacity="0.85" />
      <use href="#invite-leaf" x="20" y="34" transform="rotate(60 20 34)" opacity="0.85" />
      <use href="#invite-leaf" x="33" y="30" transform="rotate(10 33 30)" opacity="0.8" />

      <use href="#invite-bloom" x="46" y="52" />
      <use href="#invite-bloom" x="27" y="25" transform="scale(0.75)" />
      <use href="#invite-bloom" x="16" y="38" transform="scale(0.6)" />
    </svg>
  );
}
