import { getProduct, type Category } from "./products";
import { SERIES } from "./journal";

export type Comparison = {
  slug: string; // "slug-a-vs-slug-b"
  categoryA: Category;
  slugA: string;
  categoryB: Category;
  slugB: string;
  verdict: string[]; // genuinely written, not templated
};

// Curated by hand — each pair has a real, meaningful difference (price, weight
// class, brand, or clinical use case) and a written verdict grounded only in
// facts already established in lib/products.ts. No auto-generated pairs.
export const COMPARISONS: Comparison[] = [
  {
    slug: "inogen-rove-6-vs-caire-freestyle-comfort",
    categoryA: "oxygen-portable",
    slugA: "inogen-rove-6",
    categoryB: "oxygen-portable",
    slugB: "caire-freestyle-comfort",
    verdict: [
      "Both are FAA-approved portable concentrators from established manufacturers, and both show up repeatedly in this comparison for good reason — they're the two most commonly prescribed units in our portable line.",
      "The practical difference for most buyers is pricing transparency: FreeStyle Comfort ships with a published price ($2,995); Rove 6 pricing is confirmed directly with your concierge specialist rather than listed. If a fixed number matters for budgeting up front, that alone may decide it before specs do.",
      "Beyond price, the decision usually comes down to which one your prescribing physician and DME experience already trust — both are broadly comparable for daily ambulatory use, and neither is a clear technical upgrade over the other at this level of detail.",
    ],
  },
  {
    slug: "oxygo-fit-plus-vs-oxygo-next-ng",
    categoryA: "oxygen-portable",
    slugA: "oxygo-fit-plus",
    categoryB: "oxygen-portable",
    slugB: "oxygo-next-ng",
    verdict: [
      "Same manufacturer, same generation, genuinely different use case: the FIT+ is built around minimum weight (2.9 lbs single battery, 4 pulse settings), while the NEXT NG trades some of that weight (4.8 lbs single battery) for two additional pulse settings and roughly double the maximum battery life with a double battery installed.",
      "If your prescription tops out at setting 3–4 and daily carry weight is the priority, FIT+ is the lighter daily-wear option. If your prescription needs the higher settings, or you regularly need the longest possible runtime between charges, NEXT NG is the one built for that.",
      "This is less a \"better vs. worse\" comparison than a genuine spec tradeoff — confirm which pulse setting your prescription actually calls for before choosing based on weight alone.",
    ],
  },
  {
    slug: "caire-eclipse-5-vs-inogen-rove-6",
    categoryA: "oxygen-portable",
    slugA: "caire-eclipse-5",
    categoryB: "oxygen-portable",
    slugB: "inogen-rove-6",
    verdict: [
      "The Eclipse 5 sits in a different weight and price class than the Rove 6 — it's built for higher continuous-flow-equivalent prescriptions and is heavier and pricier ($3,200) as a result, not simply a more expensive version of the same thing.",
      "Rove 6 is the lighter, more travel-oriented choice for pulse-dose prescriptions where portability is the priority day to day.",
      "If your prescription genuinely calls for the Eclipse 5's higher output capability, that clinical requirement should drive the choice — the two aren't interchangeable substitutes for each other despite both being \"portable\" concentrators.",
    ],
  },
  {
    slug: "caire-companion-5-vs-philips-everflo-q",
    categoryA: "oxygen-stationary",
    slugA: "caire-companion-5",
    categoryB: "oxygen-stationary",
    slugB: "philips-everflo-q",
    verdict: [
      "Both are budget-tier 5L continuous-flow home concentrators with nearly identical flow ranges (0.5–5 LPM and 1–5 LPM respectively). The meaningful difference here is price: Companion 5 is currently $995 (on sale from $1,095), EverFlo Q is $749.",
      "Neither has a documented spec advantage over the other in the data we can confirm — this is genuinely a price-driven decision between two comparable units rather than one being a clear technical upgrade.",
      "If price is the deciding factor and your prescription is within the 1–5 LPM range both units cover, EverFlo Q is the lower-cost option; Companion 5's narrower low-end range (starting at 0.5 LPM) may matter if your prescription calls for a lower minimum flow setting.",
    ],
  },
  {
    slug: "caire-newlife-intensity-10-vs-invacare-platinum-10",
    categoryA: "oxygen-stationary",
    slugA: "caire-newlife-intensity-10",
    categoryB: "oxygen-stationary",
    slugB: "invacare-platinum-10",
    verdict: [
      "Both are 10L continuous-flow units built for higher-LPM prescriptions, with an identical 2–10 LPM range. The clearest difference is price: NewLife Intensity 10 is $1,995, Platinum 10 is currently $1,595 (on sale from $1,895).",
      "With matching flow ranges and no other documented spec differences between them, this comparison is largely a price decision — Platinum 10 is the lower-cost option for the same prescribed flow range.",
      "As with any 10L unit, confirm noise level and footprint fit your specific room setup directly with your concierge specialist, since neither manufacturer publishes that data on the general listing.",
    ],
  },
  {
    slug: "resmed-airsense-11-autoset-vs-resmed-airsense-10-autoset",
    categoryA: "sleep-cpap",
    slugA: "resmed-airsense-11-autoset",
    categoryB: "sleep-cpap",
    slugB: "resmed-airsense-10-autoset",
    verdict: [
      "This is a generational comparison within the same product line — both are ResMed's auto-adjusting CPAP with an identical 4–20 cmH₂O range, but the AirSense 11 is the newer platform at a higher price ($949 vs. $699).",
      "The AirSense 10 remains a fully capable, widely prescribed auto-CPAP — buyers prioritizing the lowest price for a proven, well-established platform commonly choose it over the newer 11.",
      "The AirSense 11 is the better choice if you specifically want the latest platform ResMed is actively developing for going forward, since long-term software and accessory support tends to concentrate on the newer generation over time.",
    ],
  },
  {
    slug: "resmed-airsense-11-autoset-vs-philips-dreamstation-2",
    categoryA: "sleep-cpap",
    slugA: "resmed-airsense-11-autoset",
    categoryB: "sleep-cpap",
    slugB: "philips-dreamstation-2",
    verdict: [
      "A cross-brand comparison between the two most commonly prescribed auto-CPAP platforms. AirSense 11 is priced slightly higher ($949 vs. $849) and is ResMed's current flagship auto-titrating platform.",
      "DreamStation 2 remains a widely used platform, though it's worth knowing Philips exited new US retail sales of most of its sleep and respiratory device line in 2024 following a major recall — inventory sold now is final-stock, not newly manufactured, which is a meaningfully different situation than the actively-produced AirSense line.",
      "For that reason, if long-term manufacturer support and ongoing production are a priority, AirSense 11 is the more conservative choice between these two at this point in time.",
    ],
  },
  {
    slug: "resmed-airmini-vs-transcend-365-auto",
    categoryA: "sleep-travel",
    slugA: "resmed-airmini",
    categoryB: "sleep-travel",
    slugB: "transcend-365-auto",
    verdict: [
      "Both are purpose-built travel CPAPs, and both are FAA-approved for air travel. AirMini is priced higher ($849 vs. $599) and is marketed around being the smallest full-featured CPAP available; Transcend 365 differentiates on its integrated battery, letting it run untethered from wall power for a stretch without an external battery pack.",
      "If minimizing size and weight in a carry-on is the top priority, AirMini is the more established choice with a larger accessory and mask-compatibility ecosystem.",
      "If off-grid or camping-style use without reliable outlet access matters more than absolute minimum size, Transcend 365's built-in battery is the more specifically useful feature for that scenario.",
    ],
  },
  {
    slug: "resmed-aircurve-10-vauto-vs-philips-dreamstation-bipap",
    categoryA: "sleep-bipap",
    slugA: "resmed-aircurve-10-vauto",
    categoryB: "sleep-bipap",
    slugB: "philips-dreamstation-bipap",
    verdict: [
      "Both are auto-adjusting bilevel devices in a similar price range (AirCurve 10 VAuto at $1,695, DreamStation BiPAP at $1,495). AirCurve is ResMed's currently produced platform; as with the CPAP comparison above, DreamStation-line inventory reflects Philips' 2024 US sleep and respiratory market exit, so it's final inventory rather than an ongoing product line.",
      "For a patient just starting bilevel therapy who wants the most straightforward path to long-term parts and software support, AirCurve 10 VAuto is the more conservative pick.",
      "DreamStation BiPAP remains a functional, lower-priced option worth considering if a patient or their physician already has established familiarity with the Philips ecosystem.",
    ],
  },
  {
    slug: "resmed-astral-150-vs-resmed-stellar-150",
    categoryA: "sleep-bipap",
    slugA: "resmed-astral-150",
    categoryB: "sleep-bipap",
    slugB: "resmed-stellar-150",
    verdict: [
      "Both are ResMed's higher-acuity bilevel/life-support-capable devices, priced very differently ($8,995 for Astral 150 vs. $4,995 for Stellar 150) — this reflects a real difference in clinical scope, not just a brand premium.",
      "Astral 150 is positioned for more complex, higher-acuity ventilation needs and is the significantly more expensive of the two; Stellar 150 covers a narrower but still substantial range of bilevel and life-support ventilation use cases at roughly half the price.",
      "This is squarely a decision for a prescribing physician or respiratory specialist to make based on the specific clinical scope required — not a consumer preference comparison, which is why we verify the specific device indication with your concierge specialist before either ships.",
    ],
  },
  {
    slug: "resmed-airfit-f30-vs-resmed-airfit-f20",
    categoryA: "sleep-mask",
    slugA: "resmed-airfit-f30",
    categoryB: "sleep-mask",
    slugB: "resmed-airfit-f20",
    verdict: [
      "Both are ResMed full-face masks at a similar price point (F30 at $159, F20 at $149 — both currently on sale). The meaningful difference is cushion design: F30 uses an under-nose cushion for a lower-profile fit, while F20 uses ResMed's InfinitySeal cushion covering more of the nose and mouth.",
      "F30's smaller cushion footprint tends to suit side sleepers and anyone who found a standard full-face mask too bulky against a pillow; F20's larger seal area is often the more forgiving fit for restless sleepers or mouth breathers with a wider face shape.",
      "All sales are final, so it's worth talking cushion fit through with your concierge specialist before you order rather than deciding on specs alone.",
    ],
  },
  {
    slug: "resmed-airfit-p10-vs-fisher-paykel-brevida",
    categoryA: "sleep-mask",
    slugA: "resmed-airfit-p10",
    categoryB: "sleep-mask",
    slugB: "f-p-brevida",
    verdict: [
      "Both are minimal-contact nasal pillow masks aimed at the same use case — the least bulky mask style available — at different price points (AirFit P10 at $99, Brevida at $79, both on sale).",
      "AirFit P10 uses ResMed's QuietAir woven-mesh venting, designed to diffuse exhaled air more quietly than a standard vent; Brevida uses Fisher & Paykel's AirPillow seal, designed to move with facial expression and position changes through the night.",
      "Both are genuinely minimal-contact designs — the lower price on Brevida makes it a reasonable first try if budget is the deciding factor. Since all sales are final, talk face-shape fit through with your concierge specialist before you order either one.",
    ],
  },
  {
    slug: "hamilton-c6-vs-draeger-evita-v800",
    categoryA: "ventilator",
    slugA: "hamilton-c6",
    categoryB: "ventilator",
    slugB: "draeger-evita-v800",
    verdict: [
      "Both are top-tier ICU ventilators from established manufacturers, priced close together ($52,000 for the Hamilton-C6, $55,000 for the Dräger Evita V800), and both are FDA-cleared for adult, pediatric, and neonatal populations.",
      "The disclosed difference is in what each spec sheet emphasizes: the Hamilton-C6 leads with Adaptive Support Ventilation and a lifetime warranty on its turbine drive; the Evita V800 leads with a broader listed mode set (VC, PC, PS, SIMV, CPAP, NIV, APRV, MMV) and hospital-network connectivity (SDC-Standard, HL7).",
      "If integrating with an existing hospital data/EHR network is a procurement requirement, the Evita V800's listed connectivity is the more directly relevant spec. If the turbine's long-term warranty coverage matters more than mode breadth, the Hamilton-C6's spec sheet speaks to that instead. Procurement and service-contract specifics are handled directly by your concierge specialist.",
    ],
  },
  {
    slug: "zoll-z-vent-731-vs-zoll-emv-plus",
    categoryA: "ventilator",
    slugA: "zoll-z-vent-731",
    categoryB: "ventilator",
    slugB: "zoll-emv-plus",
    verdict: [
      "Same manufacturer, same transport-ventilator category, close in weight (13 lbs for the Z Vent 731, 12.5 lbs for the EMV+) and both military-rated — Z Vent 731 to MIL-STD-810, EMV+ to the more recent MIL-STD-810G revision.",
      "The EMV+ data sheet discloses two transport-specific numbers the Z Vent 731's listing doesn't: 10+ hours of battery life and a 15,000 ft altitude rating. That's a real, documented difference — not a claim that the Z Vent 731 lacks those capabilities, only that its current spec sheet doesn't state them.",
      "If altitude rating or a specific battery runtime figure is a hard procurement requirement, the EMV+'s disclosed specs answer that directly. Otherwise both are comparable EMS/fire-service-ready transport ventilators from the same product family.",
    ],
  },
];

export function getComparison(slug: string) {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function resolveComparison(c: Comparison) {
  const a = getProduct(c.categoryA, c.slugA);
  const b = getProduct(c.categoryB, c.slugB);
  return { a, b };
}

// ── Satellite-spoke wiring: comparisons ↔ pillar guides ─────────────
// The guide a comparison belongs to is derived from its products' categories,
// not from a hand-kept list — new comparisons join the right cluster
// automatically, and a comparison outside every cluster simply returns null.
function guideKeyForCategory(cat: Category): keyof typeof SERIES | null {
  if (cat.startsWith("oxygen")) return "oxygen-guide";
  if (cat.startsWith("sleep")) return "cpap-guide";
  if (cat === "ventilator") return "ventilator-guide";
  return null;
}

export function guideForComparison(c: Comparison): { title: string; href: string } | null {
  const key = guideKeyForCategory(c.categoryA) ?? guideKeyForCategory(c.categoryB);
  return key ? SERIES[key] : null;
}

/** All comparisons belonging to a pillar guide, resolved to real products —
 *  used by the pillars' "Compare the contenders" sections. */
export function comparisonsForGuide(key: keyof typeof SERIES) {
  return COMPARISONS.filter(
    (c) => guideKeyForCategory(c.categoryA) === key || guideKeyForCategory(c.categoryB) === key
  )
    .map((c) => ({ slug: c.slug, ...resolveComparison(c) }))
    .filter((x) => x.a && x.b);
}
