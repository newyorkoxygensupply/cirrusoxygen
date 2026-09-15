/**
 * Real, explanatory process diagrams for the three pillar guides — grounded
 * in facts already stated in the article bodies they sit beside, drawn in
 * the same restrained line-art language as the rest of the site (stroke-
 * only, currentColor/CSS-var, no fill renders). Deliberately schematic
 * rather than photorealistic: we don't have licensed product photography or
 * real device silhouettes to draw from, and a fabricated "realistic" render
 * of a medical device would misrepresent what we sell. An honest diagram
 * that teaches the real mechanism is worth more than a fake product shot.
 *
 * Text labels live in HTML beside/under each SVG, not embedded in the SVG
 * itself — consistent with how every other icon on the site handles labels,
 * and it keeps the graphic itself legible at any zoom or export.
 */

function DiagramFrame({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="overflow-hidden rounded-[3px] border border-border bg-surface">
      <div className="flex items-center justify-center p-8">{children}</div>
      <p className="border-t border-border px-5 py-3 text-center font-mono text-[11px] text-muted-2">
        {caption}
      </p>
    </div>
  );
}

// Pressure-swing adsorption: room air in, twin sieve beds alternate
// adsorbing nitrogen / venting it, concentrated oxygen out. Matches the
// mechanism described in "how-oxygen-concentrators-work-psa-sieve-beds."
export function OxygenProcessDiagram() {
  return (
    <DiagramFrame caption="Room air in → nitrogen adsorbed → 87–96% O₂ out">
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" aria-hidden="true">
        {/* intake */}
        <path d="M4 75h26" stroke="var(--muted-2)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M24 70l6 5-6 5" stroke="var(--muted-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* housing */}
        <rect x="34" y="20" width="120" height="110" rx="4" stroke="var(--border-strong)" strokeWidth="1.6" />
        {/* twin sieve-bed columns */}
        <rect x="50" y="36" width="34" height="78" rx="3" fill="var(--accent)" fillOpacity="0.16" stroke="var(--accent)" strokeWidth="1.6" />
        <rect x="104" y="36" width="34" height="78" rx="3" stroke="var(--border-strong)" strokeWidth="1.6" />
        {/* adsorbing column: flow down, animated */}
        <path d="M67 50v34" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" className="diagram-flow" />
        <path d="M62 78l5 6 5-6" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* venting column: N2 escaping up, animated */}
        <path d="M121 100V60" stroke="var(--muted-2)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 4" className="diagram-flow" />
        <path d="M116 68l5-6 5 6" stroke="var(--muted-2)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {/* manifold link */}
        <path d="M84 122h20" stroke="var(--border-strong)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="94" cy="122" r="2.4" fill="var(--border-strong)" />
        {/* concentrated output — the payoff, pulsing to draw the eye */}
        <g className="diagram-pulse">
          <path d="M154 60h34" stroke="var(--accent-warm)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M180 53l8 7-8 7" stroke="var(--accent-warm)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* N2 exhaust from housing top */}
        <path d="M121 20V6" stroke="var(--muted-2)" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1 3" className="diagram-flow" />
        <path d="M117 11l4-5 4 5" stroke="var(--muted-2)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </DiagramFrame>
  );
}

// Airway cross-section: unsupported airway collapses during sleep; CPAP's
// positive pressure splints it open. Matches "how-cpap-machines-work-
// pressure-not-oxygen."
export function CpapPressureDiagram() {
  return (
    <DiagramFrame caption="Unsupported airway collapses — CPAP pressure splints it open">
      <svg width="240" height="130" viewBox="0 0 240 130" fill="none" aria-hidden="true">
        {/* panel A: collapsed airway */}
        <path d="M14 24C40 24 46 40 46 52c0 10-8 14-8 14s8 4 8 14c0 12-6 28-32 28" stroke="var(--muted-2)" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M78 24C52 24 46 40 46 52c0 10 8 14 8 14s-8 4-8 14c0 12 6 28 32 28" stroke="var(--muted-2)" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="46" cy="66" r="2" fill="var(--accent-warm)" />
        {/* divider */}
        <path d="M116 14v102" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="2 4" />
        {/* panel B: open airway under pressure */}
        <path d="M150 20c30 0 40 12 40 46s-10 46-40 46" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M214 20c-30 0-40 12-40 46s10 46 40 46" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
        {/* outward pressure arrows — pulsing like a breath, the whole point */}
        <g className="diagram-pulse">
          <path d="M164 50h-8m8 32h-8" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M160 46l-4 4 4 4M160 78l-4 4 4 4" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M200 50h8m-8 32h8" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M204 46l4 4-4 4M204 78l4 4-4 4" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </DiagramFrame>
  );
}

// Institutional ventilator segments as a scale/capability axis rather than
// device silhouettes we have no real reference for — honest abstraction,
// anchored to the real price spread from "ventilator-classes-icu-transport-
// mri-explained" ($12,500–$58,000).
export function VentilatorSegmentsDiagram() {
  const nodes = [
    { x: 30, r: 5, label: "Transport" },
    { x: 100, r: 8, label: "General / ICU" },
    { x: 175, r: 10, label: "MRI-Conditional" },
    { x: 250, r: 7, label: "Neonatal" },
  ];
  return (
    <DiagramFrame caption="Segments by capability, not tier — $12.5K transport to $58K MRI-conditional">
      <svg width="280" height="90" viewBox="0 0 280 90" fill="none" aria-hidden="true">
        <path d="M20 50h240" stroke="var(--border-strong)" strokeWidth="1.4" strokeLinecap="round" />
        {nodes.map((n, i) => (
          <circle
            key={n.label}
            className="diagram-node"
            style={{ animationDelay: `${i * 0.4}s` }}
            cx={n.x}
            cy="50"
            r={n.r}
            fill="var(--accent)"
            fillOpacity="0.18"
            stroke="var(--accent)"
            strokeWidth="1.6"
          />
        ))}
      </svg>
    </DiagramFrame>
  );
}
