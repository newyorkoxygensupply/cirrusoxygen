import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/inogen" },
  title: "Inogen Oxygen Concentrators — Portable & Stationary",
  description:
    "Every current Inogen model, cash-pay: Rove 6, Rove 4, One G5, At Home GS-100, Voxi 5, refurbished units, batteries, and rentals. Ships nationwide in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "Are Inogen concentrators FAA-approved for air travel?",
    "Every current Inogen portable model — the Rove 6, Rove 4, and One G5 — is on the FAA's approved portable oxygen concentrator list for in-flight use. Airlines still require advance notice and a physician's letter; check your carrier's specific policy before flying.",
  ],
  [
    "What's the difference between the Inogen Rove 6 and Rove 4?",
    "The Rove 6 is the larger, higher-output unit (up to 6 pulse-dose settings, 6-13 hour battery life) built for users who need more oxygen per breath. The Rove 4 is lighter and more compact (as low as 2.9 lbs) with up to 4 pulse-dose settings — it trades some output for size and weight.",
  ],
  [
    "Does CIRRUS sell refurbished Inogen units?",
    "Yes — refurbished Inogen One G5 and Rove 4 units are available at a discount off the new price, tested to the same functional standard before shipping. Each listing discloses that it's refurbished.",
  ],
  [
    "Is a prescription required for an Inogen concentrator?",
    "Yes. Oxygen concentrators are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any oxygen concentrator order ships — see the prescription verification page for the exact process.",
  ],
  [
    "Does CIRRUS ship Inogen concentrators nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Inogen"
      slug="inogen"
      heading="Inogen Oxygen Concentrators"
      intro="Inogen builds some of the lightest FAA-approved portable concentrators on the market, alongside the At Home GS-100 and Voxi 5 stationary units. CIRRUS carries the full current lineup — new and refurbished — cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["oxygen-portable", "oxygen-stationary", "oxygen-accessory", "oxygen-rental"]}
      faqs={FAQS}
    />
  );
}
