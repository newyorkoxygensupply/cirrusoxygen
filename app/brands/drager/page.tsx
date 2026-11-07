import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/drager" },
  title: "Dräger Ventilators — ICU, Transport & Neonatal",
  description:
    "The Dräger lineup CIRRUS carries: Evita V800/V600/Infinity V500 ICU ventilators, Savina 300, Oxylog 3000 Plus and VE300 transport ventilators, and the Babylog VN800/VN500 neonatal line.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the Dräger Evita and Oxylog lines?",
    "Evita (V800, V600, Infinity V500) are full ICU ventilators built for ongoing critical-care ventilation with the broadest mode sets. Oxylog (3000 Plus, VE300) are transport ventilators — lighter, battery-powered, built to move a ventilated patient between departments or in an ambulance rather than sit permanently at a bedside.",
  ],
  [
    "What's the difference between the Dräger Babylog VN800 and VN500?",
    "Both are neonatal-specific ventilators with volume guarantee and leak compensation for the smallest patients. The VN800 is the newer platform with an 18.3\" touchscreen and added HFO and CPAP modes; the VN500 is the prior-generation unit with the same core neonatal leak-compensation capability.",
  ],
  [
    "Is the Dräger Savina 300 usable without external gas or power hookups?",
    "Yes — gas and power independence is the Savina 300's defining feature, driven by its own turbine rather than requiring a wall gas supply, which matters for facilities or transport scenarios without guaranteed central gas lines.",
  ],
  [
    "Is a prescription required to buy a Dräger ventilator?",
    "No — these are institutional/clinical capital equipment purchases (hospitals, EMS, transport, NICU), not consumer prescription devices, so the standard CIRRUS prescription-verification flow for oxygen and CPAP/BiPAP equipment doesn't apply here.",
  ],
  [
    "Does CIRRUS ship Dräger ventilators nationwide?",
    "Yes — CIRRUS ships these as institutional orders across the continental United States. As with every device on the site, CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Dräger"
      slug="drager"
      heading="Dräger Ventilators"
      intro="Dräger's full ventilation range — Evita ICU ventilators, the gas-and-power-independent Savina 300, Oxylog transport ventilators, and the Babylog neonatal line — institutional and clinical equipment, not consumer devices. Cash-pay, shipped nationwide."
      categoryOrder={["ventilator"]}
      faqs={FAQS}
    />
  );
}
