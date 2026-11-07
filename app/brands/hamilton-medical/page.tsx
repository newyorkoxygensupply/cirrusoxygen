import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/hamilton-medical" },
  title: "Hamilton Medical Ventilators",
  description:
    "The Hamilton Medical lineup CIRRUS carries: G5, C1, C3, C6, S1, T1, MR1, and HF90 — ICU, transport, MRI-conditional, and standalone high-flow ventilators for institutional and clinical buyers.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the Hamilton-G5 and Hamilton-C1?",
    "The Hamilton-G5 is Hamilton's high-end modular ventilator covering neonatal through adult patients with ASV and full invasive/non-invasive modes. The Hamilton-C1 is positioned as an all-rounder across departments, with the same core adult/pediatric/neonatal coverage and a 4-hour internal battery, at a lower price point than the G5.",
  ],
  [
    "Is the Hamilton-MR1 actually safe to use inside an MRI scanner?",
    "The MR1 is MR-conditional up to 50 mT and supports both 1.5T and 3.0T scanners, with TeslaSpy Navigator and auto-lock brakes as part of its MRI safety design — it's purpose-built for ventilating a patient during an MRI, not a general ICU ventilator with MRI tolerance bolted on.",
  ],
  [
    "What is the Hamilton-HF90 used for?",
    "The HF90 is a standalone high-flow nasal cannula (HFNC) therapy device, not a full ventilator — it delivers heated, humidified high-flow oxygen for adult and pediatric patients, a different clinical category from Hamilton's invasive/non-invasive ventilator line.",
  ],
  [
    "Is a prescription required to buy a Hamilton Medical ventilator?",
    "No — these are institutional/clinical capital equipment purchases (hospitals, EMS, transport services), not consumer prescription devices, so the standard CIRRUS prescription-verification flow for oxygen and CPAP/BiPAP equipment doesn't apply here.",
  ],
  [
    "Does CIRRUS ship Hamilton Medical ventilators nationwide?",
    "Yes — CIRRUS ships these as institutional orders across the continental United States. As with every device on the site, CIRRUS is a cash-pay retailer only: no insurance, Medicaid, or Medicare billing.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="Hamilton Medical"
      slug="hamilton-medical"
      heading="Hamilton Medical Ventilators"
      intro="Hamilton Medical's full line, from the modular high-end G5 and C-series all-rounders to the MR-conditional MR1 and the standalone high-flow HF90 — institutional and clinical ventilation equipment, not consumer devices. Cash-pay, shipped nationwide."
      categoryOrder={["ventilator"]}
      faqs={FAQS}
    />
  );
}
