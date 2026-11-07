import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/caire" },
  title: "Caire Portable & Stationary Oxygen Concentrators",
  description:
    "The Caire lineup CIRRUS carries: FreeStyle Comfort and Eclipse 5 portable concentrators, stationary units, refurbished options, and rentals. FAA-approved, cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the Caire FreeStyle Comfort and Eclipse 5?",
    "The FreeStyle Comfort is a pulse-dose-only unit at 5 lbs with up to 16 hours of battery life — built for portability. The Eclipse 5 is a hybrid unit (continuous flow up to 3 LPM plus 9 pulse-dose settings) at 18.4 lbs with its battery — it covers continuous-flow prescriptions the FreeStyle Comfort can't, at the cost of size and weight.",
  ],
  [
    "Is the Caire FreeStyle Comfort FAA-approved?",
    "Yes — the FreeStyle Comfort and Eclipse 5 are both on the FAA's approved portable oxygen concentrator list for in-flight use. Airlines still require advance notice and a physician's letter; check your carrier's specific policy before flying.",
  ],
  [
    "Does CIRRUS sell Caire units for rent?",
    "Yes — the Caire Eclipse 5 is available as a weekly or monthly rental in addition to purchase, for situations where ownership doesn't make sense (short-term need, trial before buying, travel).",
  ],
  [
    "Is a prescription required for a Caire concentrator?",
    "Yes. Oxygen concentrators are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any oxygen concentrator order ships.",
  ],
  [
    "Does CIRRUS ship Caire concentrators nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Caire"
      slug="caire"
      heading="Caire Oxygen Concentrators"
      intro="Caire makes the FreeStyle Comfort — one of the lightest FAA-approved portable concentrators on the market — and the Eclipse 5, a hybrid continuous-flow and pulse-dose unit for prescriptions a pulse-only device can't cover. CIRRUS carries both new, with rentals available on the Eclipse 5. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["oxygen-portable", "oxygen-stationary", "oxygen-rental"]}
      faqs={FAQS}
    />
  );
}
