import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/invacare" },
  title: "Invacare Stationary Oxygen Concentrators",
  description:
    "The Invacare lineup CIRRUS carries: Platinum 10 and Perfecto2 V stationary oxygen concentrators, new and refurbished. Cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the Invacare Platinum 10 and Perfecto2 V?",
    "The Platinum 10 delivers a higher continuous-flow range (2–10 LPM) for prescriptions that need more oxygen output. The Perfecto2 V covers a lower range (0.5–5 LPM) at 40 lbs with a quieter 40 dBA rating — the right fit depends entirely on what flow rate your prescription specifies.",
  ],
  [
    "Does CIRRUS sell refurbished Invacare concentrators?",
    "Yes — both the Platinum 10 and Perfecto2 V are available as refurbished units at a discount off the new price, each listing disclosing that it's refurbished.",
  ],
  [
    "Is the Invacare Platinum 10 portable?",
    "No — both Invacare models CIRRUS carries are stationary, continuous-flow home concentrators built for the bedroom or living room, not battery-powered units for carrying around or air travel.",
  ],
  [
    "Is a prescription required for an Invacare concentrator?",
    "Yes. Oxygen concentrators are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any oxygen concentrator order ships.",
  ],
  [
    "Does CIRRUS ship Invacare concentrators nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Invacare"
      slug="invacare"
      heading="Invacare Oxygen Concentrators"
      intro="Invacare's stationary concentrator line — the higher-output Platinum 10 and the quieter Perfecto2 V — covers home continuous-flow prescriptions from 0.5 up to 10 LPM, new and refurbished. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["oxygen-stationary"]}
      faqs={FAQS}
    />
  );
}
