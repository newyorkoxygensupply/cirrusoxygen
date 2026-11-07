import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/drive-devilbiss" },
  title: "Drive DeVilbiss Oxygen & CPAP Equipment",
  description:
    "The Drive DeVilbiss lineup CIRRUS carries: iGo2 portable oxygen, the 525DS stationary concentrator, and the IntelliPAP CPAP/bilevel line, new and refurbished. Cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "Is the Drive DeVilbiss iGo2 FAA-approved for air travel?",
    "Yes — the iGo2 is on the FAA's approved portable oxygen concentrator list for in-flight use. Airlines still require advance notice and a physician's letter; check your carrier's specific policy before flying.",
  ],
  [
    "Does CIRRUS sell a refurbished Drive DeVilbiss iGo2 and 525DS?",
    "Yes — both the iGo2 portable concentrator and the 525DS stationary concentrator are available as refurbished units at a discount off the new price, each listing disclosing that it's refurbished.",
  ],
  [
    "What's the difference between the IntelliPAP 2 AutoAdjust and IntelliPAP Auto Bilevel?",
    "The IntelliPAP 2 AutoAdjust is a standard auto-adjusting CPAP (single pressure level that varies within a range). The IntelliPAP Auto Bilevel delivers two separate pressures — a higher one on inhale, lower on exhale — for prescriptions that specifically call for bilevel rather than CPAP therapy.",
  ],
  [
    "Is a prescription required for Drive DeVilbiss equipment?",
    "Yes, for the oxygen concentrators and CPAP/bilevel machines — all are prescription medical devices regardless of brand. CIRRUS verifies a valid prescription before any Rx-gated device ships.",
  ],
  [
    "Does CIRRUS ship Drive DeVilbiss equipment nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Drive DeVilbiss"
      slug="drive-devilbiss"
      heading="Drive DeVilbiss Equipment"
      intro="Drive DeVilbiss covers oxygen and sleep therapy in one catalog: the iGo2 portable concentrator, the 525DS stationary concentrator, and the IntelliPAP CPAP and auto-bilevel machines — new and refurbished. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["oxygen-portable", "oxygen-stationary", "sleep-cpap", "sleep-bipap"]}
      faqs={FAQS}
    />
  );
}
