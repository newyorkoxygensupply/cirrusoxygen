import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { RegulatorGaugeShowcase } from "@/components/RegulatorGaugeShowcase";
import { PinIndexValveShowcase } from "@/components/PinIndexValveShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/oxygen/tanks" },
  title: "Oxygen Tanks & Cylinders",
  description: "Medical-grade oxygen tanks and cylinders in all sizes, from portable M4/M6 to large H-tanks, with regulators and accessories.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Oxygen"
      title="Oxygen Tanks & Cylinders"
      intro="Medical-grade oxygen tanks and cylinders in all sizes — from portable M4/M6 to large H-tanks — with regulators and accessories, for backup or supplemental supply."
      base="/oxygen/tanks"
      science={[
        {
          eyebrow: "Two-stage pressure reduction",
          heading: "From 2,000 psi to a number you can breathe.",
          imageSide: "right",
          visual: <RegulatorGaugeShowcase />,
          body: (
            <>
              <p>
                A full cylinder holds gas at pressure no one could inhale directly. A two-stage
                regulator steps it down — a spring-loaded diaphragm at each stage — to a steady
                delivery pressure, while a Bourdon-tube gauge on the same body reads remaining
                content, full to empty, so you know before it runs out.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                How tanks compare to concentrators day-to-day, in{" "}
                <Link href="/journal/portable-concentrators-vs-oxygen-tanks" className="text-accent underline underline-offset-2 hover:no-underline">
                  portable concentrators vs. oxygen tanks
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          eyebrow: "A mechanical safety interlock",
          heading: "It can't connect to the wrong gas.",
          imageSide: "left",
          visual: <PinIndexValveShowcase />,
          body: (
            <p>
              Medical oxygen cylinders use the CGA-870 pin-index system: two pins on the
              regulator yoke, in a position specific to oxygen, that only seat into a matching
              valve post. A regulator built for a different gas simply won&rsquo;t dock — the
              mismatch is physical, not a label someone could miss.
            </p>
          ),
        },
      ]}
    />
  );
}
