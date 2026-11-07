import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/fisher-paykel" },
  title: "Fisher & Paykel CPAP & Masks",
  description:
    "The Fisher & Paykel lineup CIRRUS carries: SleepStyle Auto CPAP, the Vitera full face mask, and the Brevida nasal pillow mask, plus SleepStyle rentals. Cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "What makes the Fisher & Paykel SleepStyle different from other auto CPAP machines?",
    "The SleepStyle runs at 26 dBA, among the quieter auto-adjusting CPAP machines CIRRUS carries, with an integrated ThermoSmart humidifier and SensAwake technology that eases pressure when it detects you're waking up, rather than holding full pressure through a wake event.",
  ],
  [
    "What's the difference between the Fisher & Paykel Vitera and Brevida masks?",
    "The Vitera is a full-face mask with a RollFit XT silicone cushion, sized Small/Medium/Large with two frame sizes. The Brevida is a nasal pillow mask with an AirPillow seal, sized XS-S/M-L — nasal pillow masks sit under the nose rather than covering the whole face, which some users prefer for a lighter feel.",
  ],
  [
    "Does CIRRUS rent the Fisher & Paykel SleepStyle?",
    "Yes — it's available as a weekly or monthly rental in addition to purchase, for situations where ownership doesn't make sense (short-term need, trial before buying, travel).",
  ],
  [
    "Is a prescription required for the SleepStyle CPAP?",
    "Yes — CPAP machines are prescription medical devices regardless of brand. The Vitera and Brevida masks don't require a prescription on their own, but the CPAP machine they connect to does.",
  ],
  [
    "Does CIRRUS ship Fisher & Paykel equipment nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification where one is required. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Fisher & Paykel"
      slug="fisher-paykel"
      heading="Fisher & Paykel CPAP & Masks"
      intro="Fisher & Paykel's SleepStyle Auto CPAP — one of the quietest machines CIRRUS carries — plus the Vitera full-face and Brevida nasal pillow masks, with SleepStyle available to rent or buy. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["sleep-cpap", "sleep-mask", "cpap-rental"]}
      faqs={FAQS}
    />
  );
}
