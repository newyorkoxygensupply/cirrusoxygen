import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/philips-respironics" },
  title: "Philips Respironics Oxygen, CPAP & Ventilators",
  description:
    "Philips Respironics equipment CIRRUS carries: DreamStation CPAP/BiPAP, EverFlo stationary oxygen, SimplyGo portable oxygen (discontinued, still supported), and the Trilogy Evo ventilator. Cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "Is the Philips SimplyGo still available new?",
    "No — the SimplyGo and SimplyGo Mini portable concentrators are manufacturer-discontinued, which CIRRUS discloses directly on each listing. Units sold are from remaining authorized-channel inventory or refurbished stock, not new manufacturer production.",
  ],
  [
    "What's the difference between the Philips EverFlo and EverFlo Q?",
    "Both are 1–5 LPM continuous-flow stationary concentrators with the same footprint and 40 dBA noise rating — EverFlo Q is the quieter-marketed variant of the same core platform. CIRRUS also carries a refurbished EverFlo at a lower price point.",
  ],
  [
    "Does the Philips DreamStation 2 require a prescription?",
    "Yes. The DreamStation 2 Auto CPAP and DreamStation BiPAP are prescription devices like every CPAP/BiPAP machine on the site — CIRRUS verifies a valid prescription before any sleep-therapy device ships.",
  ],
  [
    "What is the Philips Trilogy Evo used for?",
    "The Trilogy Evo is a life-support-capable ventilator supporting both invasive and non-invasive ventilation across pediatric (2.5 kg+) through adult patients — a clinical/institutional device, not a consumer sleep-therapy product, with up to 15 hours of internal battery life.",
  ],
  [
    "Does CIRRUS ship Philips Respironics equipment nationwide?",
    "Yes — orders ship across the continental United States, typically within 48 hours of prescription verification where one is required. CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Philips Respironics"
      slug="philips-respironics"
      heading="Philips Respironics Equipment"
      intro="Philips Respironics spans sleep, oxygen, and clinical ventilation: the DreamStation CPAP/BiPAP line, EverFlo stationary oxygen concentrators, the now-discontinued-but-still-available SimplyGo portable line, and the Trilogy Evo ventilator. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={[
        "sleep-cpap",
        "sleep-bipap",
        "sleep-travel",
        "sleep-mask",
        "oxygen-portable",
        "oxygen-stationary",
        "respiratory-accessory",
        "ventilator",
        "cpap-rental",
        "oxygen-rental",
      ]}
      faqs={FAQS}
    />
  );
}
