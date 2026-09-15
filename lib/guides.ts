import { getProduct, type Category } from "./products";

export type GuideProductRef = { category: Category; slug: string; note: string };

export type Guide = {
  slug: string;
  title: string;
  dek: string;
  intro: string[];
  products: GuideProductRef[];
  closing: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "best-portable-oxygen-concentrator-for-air-travel",
    title: "Best Portable Oxygen Concentrator for Air Travel",
    dek: "Every unit we carry is FAA-approved — the real differentiator for travel is battery life and weight.",
    intro: [
      "All portable concentrators in our catalog ship with FAA travel documentation, so \"FAA-approved\" itself doesn't narrow the field much. What actually matters for a long travel day is battery runtime relative to weight, since airlines require the device (and its documentation) with you, not checked.",
    ],
    products: [
      { category: "oxygen-portable", slug: "oxygo-next-ng", note: "Longest documented battery runtime in our catalog with a double battery installed — the strongest pick for long-haul or multi-leg travel days." },
      { category: "oxygen-portable", slug: "inogen-rove-6", note: "A well-established, widely prescribed choice for ambulatory travel use, with broad airline familiarity." },
      { category: "oxygen-portable", slug: "oxygo-fit-plus", note: "The lightest option if your prescription fits within its 4 pulse settings and you're prioritizing carry weight over maximum runtime." },
    ],
    closing: "Confirm your specific prescription's pulse-dose setting fits the unit you're considering before booking travel, and call your airline 48 hours ahead regardless of which unit you choose.",
  },
  {
    slug: "best-lightweight-portable-oxygen-concentrator-daily-carry",
    title: "Best Lightweight Portable Oxygen Concentrator for Daily Carry",
    dek: "For everyday ambulatory use, weight on your shoulder matters more than maximum battery runtime.",
    intro: [
      "If a concentrator is coming with you most of the day, every pound matters more than it does for occasional travel. This is a different priority ranking than the travel guide above — daily comfort over maximum battery capacity.",
    ],
    products: [
      { category: "oxygen-portable", slug: "oxygo-fit-plus", note: "2.9 lbs with a single battery — the lightest unit in our current catalog." },
      { category: "oxygen-portable", slug: "inogen-rove-6", note: "A heavier but still genuinely portable option, worth considering if your prescription needs settings beyond what FIT+ offers." },
    ],
    closing: "Weight differences of a pound or two sound minor on paper but are noticeable after a full day of wear — if you can, ask your concierge specialist about a trial period before committing.",
  },
  {
    slug: "best-cpap-mask-for-side-sleepers",
    title: "Best CPAP Mask for Side Sleepers",
    dek: "Most first-week mask leaks for side sleepers trace back to cushion shape against a pillow, not size.",
    intro: [
      "A mask that seals perfectly on your back can leak the moment you roll onto your side, because the cushion's contact angle against the pillow changes. Minimal-contact nasal pillow designs generally handle this better than full-face masks.",
    ],
    products: [
      { category: "sleep-mask", slug: "resmed-airfit-p10", note: "Minimal-contact nasal pillow with QuietAir venting — a common starting point for side sleepers." },
      { category: "sleep-mask", slug: "f-p-brevida", note: "AirPillow seal technology designed to move with position changes through the night, at a lower price point." },
      { category: "sleep-mask", slug: "resmed-airfit-p30i", note: "Top-of-head tube routing keeps the hose out of the way when lying on your side." },
    ],
    closing: "Talk sizing through with your concierge specialist before you order — all sales are final, so getting the cushion shape right up front matters more than it would with a retailer that accepts exchanges.",
  },
  {
    slug: "best-travel-cpap-for-frequent-flyers",
    title: "Best Travel CPAP for Frequent Flyers",
    dek: "Two real options exist in this category, and they solve genuinely different travel problems.",
    intro: [
      "Travel CPAP machines trade some features of a full-size unit for size and weight. Between our two options, the choice mostly comes down to whether minimum size or power independence matters more for how you travel.",
    ],
    products: [
      { category: "sleep-travel", slug: "resmed-airmini", note: "The smallest full-featured CPAP in our catalog, with the widest mask-compatibility ecosystem." },
      { category: "sleep-travel", slug: "transcend-365-auto", note: "Integrated battery for camping or off-grid stays without reliable outlet access." },
    ],
    closing: "See our full comparison of AirMini vs. Transcend 365 for the detailed tradeoffs.",
  },
  {
    slug: "best-bipap-for-complex-or-central-sleep-apnea",
    title: "Best BiPAP for Complex or Central Sleep Apnea",
    dek: "Standard CPAP is often insufficient for central or complex apnea — this is where adaptive servo-ventilation comes in.",
    intro: [
      "Central and complex sleep apnea involve the brain's breathing signal itself, not just airway obstruction — standard CPAP and even standard bilevel support can fall short. This category is squarely a physician-directed decision, not a consumer preference choice.",
    ],
    products: [
      { category: "sleep-bipap", slug: "resmed-aircurve-10-asv", note: "Adaptive servo-ventilation, continuously adjusting pressure support breath-by-breath — the standard device category for central and complex apnea." },
      { category: "sleep-bipap", slug: "resmed-aircurve-10-st", note: "A fixed bi-level option with spontaneous/timed backup for patients who need a scheduled backup rate rather than full ASV." },
    ],
    closing: "Any device in this category ships only after prescription verification confirms the specific indication with your prescribing physician.",
  },
  {
    slug: "best-stationary-oxygen-concentrator-for-home-use",
    title: "Best Stationary Oxygen Concentrator for Home Use",
    dek: "The right stationary unit depends almost entirely on your prescribed LPM range, not brand preference.",
    intro: [
      "Stationary concentrators split cleanly into two flow classes — 5L units for lower-to-moderate prescriptions, and 10L units for higher-flow needs. Start with your prescribed range, then compare price within that class.",
    ],
    products: [
      { category: "oxygen-stationary", slug: "philips-everflo-q", note: "5L unit (1–5 LPM), currently our lowest-priced new 5L option." },
      { category: "oxygen-stationary", slug: "caire-companion-5", note: "5L unit with a slightly lower minimum flow setting (0.5 LPM) than EverFlo Q." },
      { category: "oxygen-stationary", slug: "invacare-platinum-10", note: "10L unit (2–10 LPM), our lower-priced option in the high-flow class." },
      { category: "oxygen-stationary", slug: "caire-newlife-intensity-10", note: "10L unit, the alternative high-flow option if Platinum 10 isn't the right fit." },
    ],
    closing: "See our Companion 5 vs. EverFlo Q and NewLife Intensity 10 vs. Platinum 10 comparisons for the detailed differences within each class.",
  },
  {
    slug: "best-budget-refurbished-oxygen-concentrator",
    title: "Best Budget Refurbished Oxygen Concentrator",
    dek: "Refurbished units are factory-tested and typically warrantied, at a meaningful discount to new.",
    intro: [
      "A refurbished concentrator has been inspected, serviced, and tested before resale — a reasonable way to reduce cost if a new-unit warranty isn't the deciding factor for you. Confirm the specific warranty length with your concierge specialist, since it's typically shorter than on a new unit.",
    ],
    products: [
      { category: "oxygen-stationary", slug: "refurbished-devilbiss-525ds", note: "Our lowest-priced refurbished stationary option." },
      { category: "oxygen-stationary", slug: "refurbished-invacare-perfecto2-v", note: "A close second on price, similar 5L flow range." },
      { category: "oxygen-portable", slug: "refurbished-drive-devilbiss-igo2", note: "The most accessible refurbished portable option currently in stock." },
    ],
    closing: "Refurbished availability changes as units come in — ask your concierge specialist for current refurbished stock beyond what's listed here.",
  },
  {
    slug: "best-minimal-contact-cpap-mask",
    title: "Best Minimal-Contact CPAP Mask",
    dek: "For anyone who's struggled with a full-face mask, these are the least bulky options in our catalog.",
    intro: [
      "Minimal-contact nasal pillow masks seal directly at the nostril rather than covering the outside of the nose — the lowest-profile option available, and often the first thing worth trying for anyone who finds a full-face mask claustrophobic.",
    ],
    products: [
      { category: "sleep-mask", slug: "resmed-airfit-p10", note: "QuietAir woven-mesh venting for quieter exhaust." },
      { category: "sleep-mask", slug: "f-p-brevida", note: "AirPillow seal, our lowest-priced nasal pillow option." },
      { category: "sleep-mask", slug: "resmed-airfit-n30i", note: "A nasal cradle style with top-of-head tube routing, for those who want a bit more nasal coverage than a pillow style." },
    ],
    closing: "All sales are final, so it's worth talking sizing through with your concierge specialist before you order rather than reading specs alone.",
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

export function resolveGuideProducts(guide: Guide) {
  return guide.products
    .map((p) => ({ ...p, product: getProduct(p.category, p.slug) }))
    .filter((p) => p.product);
}
