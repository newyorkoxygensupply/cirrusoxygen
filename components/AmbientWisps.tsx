/**
 * A sitewide atmospheric graphic — not a logo watermark, not a repeating
 * texture. Cirrus-wisp strokes (the exact motif from LogoMark, scaled up
 * ~40x) sweep across the upper-right of the viewport, plus a second, smaller
 * cluster low on the left so the graphic still has presence once a visitor
 * has scrolled past the hero. The idea is literal: cirrus clouds are the
 * real high-altitude weather this brand is named for, so "the sky behind
 * the page" is the one background texture that's actually about something,
 * rather than a generic grid or noise pattern.
 *
 * Opacity is high enough to be clearly, immediately visible — this is meant
 * to register at a glance, not reward someone who goes looking for it — while
 * staying behind every solid card/surface, so it never touches text
 * contrast. The whole graphic sways slowly (animate-wisp-drift) so it reads
 * as live weather instead of a printed watermark.
 */
export function AmbientWisps() {
  return (
    <svg
      aria-hidden="true"
      className="animate-wisp-drift pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-[0.16] dark:opacity-[0.24]"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMin slice"
      fill="none"
    >
      {/* upper-right primary cluster */}
      <path
        d="M380 50 C 700 -70 1180 -70 1640 90"
        stroke="var(--accent)"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d="M520 190 C 800 80 1220 80 1660 220"
        stroke="var(--accent)"
        strokeWidth="24"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M660 330 C 880 240 1240 240 1620 350"
        stroke="var(--accent-warm)"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M820 450 C 1000 390 1280 390 1600 470"
        stroke="var(--accent)"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* lower-left secondary cluster, for presence after scrolling */}
      <path
        d="M-60 760 C 160 660 480 660 760 780"
        stroke="var(--accent-warm)"
        strokeWidth="20"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M-40 860 C 140 800 420 800 660 880"
        stroke="var(--accent)"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
