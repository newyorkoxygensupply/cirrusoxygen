/**
 * The CIRRUS mark: three wisp strokes echoing actual cirrus clouds — thin,
 * high-altitude streaks that (unlike lower clouds) catch warm light first at
 * sunset while the sky around them stays cool. The two upper wisps stay in
 * brand green; the lowest one alone carries the warm accent, like a cirrus
 * streak lit from below — a real, specific idea, not a decorative gradient.
 */
export function LogoMark({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={(size * 26) / 34}
      viewBox="0 0 34 26"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 7.5C9 2.5 19 2.5 31 7"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <path
        d="M6.5 14.5C11.5 11 19.5 11 26.5 14"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        d="M10 21.5C13.7 19.3 18.7 19.3 23 21"
        stroke="currentColor"
        className="text-accent-warm"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The 404/error illustration: the same three wisp strokes as LogoMark, but
 * drifted apart — the formation has scattered rather than swept together.
 * One idea, extended, instead of a generic broken-robot or torn-paper
 * cliché. Framed in the same "instrument dial" rings used for editorial
 * hero icons, so an error page still reads as part of one visual system.
 */
export function ScatteredWisps({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="58" stroke="var(--border-strong)" strokeWidth="1" />
      <circle cx="60" cy="60" r="40" stroke="var(--border-strong)" strokeWidth="1" />
      <path
        d="M22 34C34 24 50 22 66 30"
        stroke="var(--accent)"
        strokeWidth="4.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M70 58C80 50 92 50 100 58"
        stroke="var(--accent)"
        strokeWidth="3.6"
        strokeLinecap="round"
        opacity="0.55"
        transform="rotate(18 85 58)"
      />
      <path
        d="M18 82C28 76 42 76 52 84"
        stroke="var(--accent-warm)"
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(-8 35 82)"
      />
    </svg>
  );
}

export function Logo({ className = "", iconSize = 24 }: { className?: string; iconSize?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={iconSize} />
      <span className="font-display font-bold tracking-tight">
        CIRRUS<span className="text-accent-warm">.</span>
      </span>
    </span>
  );
}
