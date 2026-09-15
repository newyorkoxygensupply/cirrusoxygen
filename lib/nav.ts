/** Shared navigation + sitemap data — single source of truth for header, footer, and the IA. */

/** NYOS's free respiratory equipment recycling program — ?ref tags the
 *  visit so the recycling site can show Cirrus-specific messaging. */
export const RECYCLE_PROGRAM_URL =
  (process.env.NEXT_PUBLIC_RECYCLE_URL ?? "https://nyos-recycle.vercel.app") + "?ref=cirrus";

export const PRIMARY_NAV = [
  { label: "Oxygen", href: "/oxygen" },
  { label: "Sleep", href: "/sleep" },
  { label: "Ventilators", href: "/ventilators" },
  { label: "Rentals", href: "/rentals" },
  { label: "Nebulizers & Oximeters", href: "/respiratory-accessories" },
  { label: "The Standard", href: "/the-standard" },
  { label: "Journal", href: "/journal" },
  { label: "Recycle", href: RECYCLE_PROGRAM_URL },
  { label: "Concierge", href: "/concierge" },
] as const;

/** Structured dropdown panels for the two catalog hubs. Keyed by the parent
 *  nav href; entries mirror the real IA (same paths as the sitemap). */
export const NAV_DROPDOWNS: Record<
  string,
  { label: string; href: string; desc: string }[]
> = {
  "/oxygen": [
    { label: "Portable Concentrators", href: "/oxygen/portable", desc: "Battery-powered, FAA-approved" },
    { label: "Stationary Concentrators", href: "/oxygen/stationary", desc: "Continuous-flow home units" },
    { label: "Tanks & Cylinders", href: "/oxygen/tanks", desc: "Backup and supplemental supply" },
    { label: "Oxygen Accessories", href: "/oxygen/accessories", desc: "Batteries and carrying cases" },
    { label: "The Complete Guide", href: "/oxygen/guide", desc: "12 chapters, from PSA to Medicare" },
  ],
  "/sleep": [
    { label: "CPAP Machines", href: "/sleep/cpap", desc: "Auto-titrating and travel models" },
    { label: "BiPAP & VPAP", href: "/sleep/bipap-apap", desc: "Bi-level and adaptive servo" },
    { label: "Masks & Cleaners", href: "/sleep/accessories", desc: "Full-face, nasal, and pillow styles" },
    { label: "The Complete Guide", href: "/sleep/guide", desc: "12 chapters, from pressure to paperwork" },
  ],
};

/** Utility-bar contact facts — the same phone number published in the
 *  Organization schema; never a second, made-up line.
 *  1-877-OXYGEN-5 spells out to 1-877-699-4365 on the keypad. */
export const SUPPORT_PHONE = "1-877-OXYGEN-5";
export const SUPPORT_PHONE_HREF = "tel:+18776994365";

export const FOOTER_NAV = {
  Shop: [
    { label: "Portable Oxygen", href: "/oxygen/portable" },
    { label: "Stationary Oxygen", href: "/oxygen/stationary" },
    { label: "Oxygen Tanks", href: "/oxygen/tanks" },
    { label: "CPAP & BiPAP", href: "/sleep" },
    { label: "Accessories", href: "/respiratory-accessories" },
    { label: "Ventilators", href: "/ventilators" },
  ],
  Company: [
    { label: "The Standard", href: "/the-standard" },
    { label: "Why Cash-Pay", href: "/why-cash-pay" },
    { label: "Journal", href: "/journal" },
    { label: "Concierge", href: "/concierge" },
  ],
  Resources: [
    { label: "Oxygen Concentrator Guide", href: "/oxygen/guide" },
    { label: "CPAP Guide", href: "/sleep/guide" },
    { label: "Ventilator Guide", href: "/ventilators/guide" },
    { label: "Buying Guides", href: "/guides" },
    { label: "Compare", href: "/compare" },
    { label: "Glossary", href: "/glossary" },
    { label: "FAQ", href: "/faq" },
    { label: "Editorial Policy", href: "/editorial-policy" },
  ],
  Support: [
    { label: "Prescription Verification", href: "/prescription" },
    { label: "Shipping", href: "/shipping" },
    { label: "Areas Served", href: "/areas-served" },
    { label: "Returns", href: "/returns" },
    { label: "Other Equipment", href: "/equipment" },
    { label: "Recycle Your Equipment", href: RECYCLE_PROGRAM_URL },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Account", href: "/account" },
  ],
} as const;
