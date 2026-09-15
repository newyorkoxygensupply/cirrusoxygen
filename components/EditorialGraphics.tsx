/**
 * Hero icons for the editorial/policy pages (The Standard, Why Cash-Pay,
 * Prescription, Shipping, Returns, Concierge, Equipment, Account, Privacy,
 * Terms). Each is a real, specific concept for that page's actual subject —
 * not a generic document/checkmark repeated eleven times.
 *
 * The circular backdrop reuses the exact "instrument dial" motif already
 * used for product-image placeholders (two concentric rings + a filled
 * center) elsewhere on the site, so this reads as one visual system rather
 * than a new decorative style bolted onto policy pages.
 */
function Dial({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex h-[116px] w-[116px] items-center justify-center" aria-hidden="true">
      <div className="dial-pulse-ring absolute h-[80px] w-[80px] rounded-full border-2 border-accent" />
      <div className="dial-bezel absolute h-[116px] w-[116px] rounded-full" />
      <div className="absolute h-[80px] w-[80px] rounded-full border border-accent/40" />
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="relative text-accent">
        {children}
      </svg>
    </div>
  );
}

// Precision measurement — calipers — for "held to one standard."
export function StandardGraphic() {
  return (
    <Dial>
      <path d="M4 4v13m16-13v13M4 17h16M8 4v6m4-6v9m4-9v6" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// A single direct line from you to CIRRUS — no claim chain, no middleman.
export function DirectPriceGraphic() {
  return (
    <Dial>
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
      <path d="M7.5 12h9" strokeLinecap="round" strokeDasharray="0.5 4" />
      <path d="M13 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// Document with a verification check — prescription verified before ship.
export function VerifyGraphic() {
  return (
    <Dial>
      <path d="M7 3h8l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3v3h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 14.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// Package with motion lines — 48-hour dispatch.
export function DispatchGraphic() {
  return (
    <Dial>
      <path d="M3 8l8-4 8 4-8 4-8-4Zm0 0v9l8 4m0-9v9m8-13v9l-8 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 6h2M20.5 9h1.5" strokeLinecap="round" />
    </Dial>
  );
}

// Circular return arrow — 30-day return window.
export function ReturnGraphic() {
  return (
    <Dial>
      <path d="M4 12a8 8 0 1 1 2.5 5.8" strokeLinecap="round" />
      <path d="M3 16.5V21h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// Headset — the concierge line, one person.
export function ConciergeGraphic() {
  return (
    <Dial>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1m-16 0v3a2 2 0 0 0 2 2h1v-6H5a1 1 0 0 0-1 1Zm16 0v3a2 2 0 0 1-2 2h-1v-6h1a1 1 0 0 1 1 1Zm-3 5a3 3 0 0 1-3 3h-2" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// A crate/case — secondary equipment catalog, distinct from oxygen/sleep imagery.
export function EquipmentGraphic() {
  return (
    <Dial>
      <path d="M3 8l9-5 9 5-9 5-9-5Zm0 0v8l9 5 9-5V8M12 13v8" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// Wheelchair — mobility equipment.
export function MobilityGraphic() {
  return (
    <Dial>
      <circle cx="9.5" cy="15" r="4.2" />
      <path d="M9.5 15V5m0 0h3.5M9.5 8h5l3 7h-3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="17.5" r="1.3" />
    </Dial>
  );
}

// Bed — beds & bedroom equipment (same real motif used in the journal
// icon set for consistency, redrawn at this component's stroke weight).
export function BedGraphic() {
  return (
    <Dial>
      <path d="M3 18v-7a2 2 0 0 1 2-2h5v5M3 18h18v-5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v5M3 18v2m18-2v2M5 9V6a2 2 0 0 1 2-2h1" strokeLinecap="round" strokeLinejoin="round" />
    </Dial>
  );
}

// A simple person outline — account.
export function AccountGraphic() {
  return (
    <Dial>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </Dial>
  );
}

// Padlock — data privacy specifically (distinct from the FDA "shield" used
// in the trust bar, which is about device regulation, not data).
export function PrivacyGraphic() {
  return (
    <Dial>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.3" />
    </Dial>
  );
}

// A simple lined document — the terms themselves.
export function TermsGraphic() {
  return (
    <Dial>
      <path d="M7 3h8l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3v3h3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6M9 16h6M9 10h3" strokeLinecap="round" />
    </Dial>
  );
}
