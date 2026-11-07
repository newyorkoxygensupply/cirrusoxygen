import type { Metadata } from "next";
import { BrandHub, type BrandFaq } from "@/components/BrandHub";

export const metadata: Metadata = {
  alternates: { canonical: "/brands/resmed" },
  title: "ResMed CPAP, BiPAP & Masks",
  description:
    "The full ResMed lineup CIRRUS carries: AirSense 10/11 CPAP, AirCurve/Lumis/Astral/Stellar BiPAP, AirMini travel CPAP, AirFit/AirTouch masks, and the Mobi portable concentrator. Cash-pay, ships in 48 hours.",
};

const FAQS: BrandFaq[] = [
  [
    "What's the difference between the ResMed AirSense 10 and AirSense 11?",
    "Both are auto-adjusting CPAP machines with the same 4–20 cmH₂O pressure range and built-in HumidAir humidifier. The AirSense 11 is the newer platform with integrated cellular, Wi-Fi, and Bluetooth connectivity built in; the AirSense 10 uses an SD card or an optional add-on module for data and connectivity.",
  ],
  [
    "What's the difference between ResMed BiPAP models (AirCurve, Lumis, Astral, Stellar)?",
    "AirCurve 10 is ResMed's standard home bilevel line (S, ST, VAuto, ASV variants for different breathing-support needs). Lumis is the newer platform replacing AirCurve with the same tiering. Astral and Stellar are ResMed's life-support-capable ventilators, built for patients who need continuous ventilatory support rather than nightly bilevel therapy — a clinically different category from AirCurve/Lumis.",
  ],
  [
    "Is the ResMed AirMini a full CPAP replacement?",
    "The AirMini is purpose-built for travel — it's roughly the size of a soda can but uses the same pressure settings as your prescribed machine. It requires a specific proprietary mask-connector setup (HumidX instead of a standard humidifier) and isn't intended as a full-time nightly replacement for a standard AirSense machine.",
  ],
  [
    "Does CIRRUS carry ResMed masks?",
    "Yes — the AirFit F20/F30/F30i/F40 full-face masks, AirFit N20/N30/N30i nasal masks, AirFit P10/P30i nasal pillow masks, and the AirTouch N20/F20 memory-foam cushion line. Masks don't require a prescription; the CPAP machine itself does.",
  ],
  [
    "Does ResMed make a portable oxygen concentrator?",
    "Yes — the ResMed Mobi is ResMed's portable oxygen concentrator, distinct from its much larger CPAP/BiPAP catalog. It's a separate device from its sleep-therapy lineup and serves oxygen therapy rather than sleep apnea treatment.",
  ],
];

export default function Page() {
  return (
    <BrandHub
      brand="ResMed"
      slug="resmed"
      heading="ResMed CPAP, BiPAP & Sleep Systems"
      intro="ResMed is the largest CPAP/BiPAP catalog CIRRUS carries — AirSense auto-adjusting CPAP, the AirCurve/Lumis/Astral/Stellar bilevel and ventilator lines, the AirMini travel CPAP, a full AirFit/AirTouch mask lineup, and the Mobi portable oxygen concentrator. Cash-pay, shipped nationwide in 48 hours."
      categoryOrder={["sleep-cpap", "sleep-bipap", "sleep-travel", "sleep-mask", "oxygen-portable", "cpap-rental"]}
      faqs={FAQS}
    />
  );
}
