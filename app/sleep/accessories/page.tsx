import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { MaskSealShowcase } from "@/components/MaskSealShowcase";
import { UVSanitizeShowcase } from "@/components/UVSanitizeShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/sleep/accessories" },
  title: "Sleep Accessories",
  description: "Masks, tubing, filters, and humidifiers, matched to your machine.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Sleep"
      title="Sleep Accessories"
      intro="Masks and sanitizers from ResMed, Philips, and Fisher & Paykel — fitted to your system, not guessed at."
      base="/sleep/accessories"
      science={[
        {
          eyebrow: "No moving parts",
          heading: "It vents constantly, not on demand.",
          imageSide: "right",
          visual: <MaskSealShowcase />,
          body: (
            <>
              <p>
                Nearly every modern mask uses a passive diffuser vent — a small cluster of
                drilled holes with nothing to jam or stick — that bleeds exhaled CO2 out
                continuously, all night, so it can&rsquo;t pool inside the mask and be
                re-breathed. The seal itself is just the silicone cushion pressing against skin;
                the vent is doing the safety work.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                Why a seal that looked fine on day one can start leaking, in{" "}
                <Link href="/journal/why-your-mask-doesnt-fit-yet" className="text-accent underline underline-offset-2 hover:no-underline">
                  why your mask doesn&rsquo;t fit yet
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          eyebrow: "No water, no chemicals",
          heading: "A timed dose of germicidal light.",
          imageSide: "left",
          visual: <UVSanitizeShowcase />,
          body: (
            <>
              <p>
                The SoClean and Lumin sanitizers sold here work the same way: a sealed chamber, a
                UV-C lamp, and a timed exposure cycle — no soaking, no soap, nothing left to
                rinse off before the next use. UV-C sits outside visible light, so the glow shown
                here is a stand-in for a wavelength you wouldn&rsquo;t actually see.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                The cleaning schedule this replaces, in{" "}
                <Link href="/journal/how-to-clean-cpap-equipment-schedule" className="text-accent underline underline-offset-2 hover:no-underline">
                  how to clean CPAP equipment
                </Link>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
