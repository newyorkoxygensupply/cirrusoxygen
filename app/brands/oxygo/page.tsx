import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/oxygo" },
  title: "OxyGo Portable Oxygen Concentrators",
  description:
    "The OxyGo lineup CIRRUS carries: FIT, FIT+, NEXT, and NEXT NG portable concentrators. FAA-approved, cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the OxyGo FIT and OxyGo NEXT?",
    "The FIT is the lighter unit at 4.8 lbs with up to 5 pulse-dose settings and 6.5–13 hours of battery life. The NEXT adds a 6th pulse-dose setting and carries a longer 5-year warranty on the concentrator itself (vs. 3 years on the FIT), at a comparable weight.",
  ],
  [
    "Is the OxyGo FIT+ the same as the FIT?",
    "No — the FIT+ is a separate, smaller model at 2.9 lbs (single battery), with up to 4 pulse-dose settings. It trades some output and battery runtime for a meaningfully lighter unit than the original FIT.",
  ],
  [
    "Are OxyGo concentrators FAA-approved?",
    "Yes — every current OxyGo model CIRRUS carries is on the FAA's approved portable oxygen concentrator list for in-flight use. Airlines still require advance notice and a physician's letter; check your carrier's specific policy before flying.",
  ],
  [
    "Is a prescription required for an OxyGo concentrator?",
    "Yes. Oxygen concentrators are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any oxygen concentrator order ships.",
  ],
  [
    "Does CIRRUS ship OxyGo concentrators nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="OxyGo"
      slug="oxygo"
      heading="OxyGo Portable Oxygen Concentrators"
      intro="OxyGo builds compact, FAA-approved portable concentrators across four current models — FIT, FIT+, NEXT, and NEXT NG — sized for daily carry rather than home continuous-flow use. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["oxygen-portable"]}
      faqs={FAQS}
    />
  );
}
