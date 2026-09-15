import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { ContinuousFlowShowcase } from "@/components/ContinuousFlowShowcase";
import { PuritySpectrumShowcase } from "@/components/PuritySpectrumShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/oxygen/stationary" },
  title: "Home Stationary Oxygen Concentrators",
  description: "Home-base oxygen concentrators for continuous, higher-flow therapy.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Oxygen"
      title="Stationary Oxygen Concentrators"
      intro="Continuous-flow units built for the bedroom or living room, not the runway — for prescriptions above what a portable unit can deliver."
      base="/oxygen/stationary"
      science={[
        {
          eyebrow: "No waiting on a breath",
          heading: "A stream that never stops.",
          imageSide: "right",
          visual: <ContinuousFlowShowcase />,
          body: (
            <>
              <p>
                Where a portable meters a bolus per breath, a stationary unit runs an
                uninterrupted stream at a set flow rate the entire time it&rsquo;s plugged in —
                the reason continuous flow reaches higher LPM prescriptions than a pulse-dose
                unit can cover.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                Which one your prescription actually calls for, in{" "}
                <Link href="/journal/portable-vs-home-oxygen-concentrator" className="text-accent underline underline-offset-2 hover:no-underline">
                  portable vs. home oxygen concentrators
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          eyebrow: "What the output actually is",
          heading: "Mostly oxygen. Not pure oxygen.",
          imageSide: "left",
          visual: <PuritySpectrumShowcase />,
          body: (
            <>
              <p>
                Every unit on this page outputs 87&ndash;96% oxygen, not 100% &mdash; the sieve
                bed strips out nitrogen, not every trace gas in room air. That range is what you
                should expect to see printed on the label, not a rounder number.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                How saturation and purity actually relate, in{" "}
                <Link href="/journal/understanding-oxygen-saturation-spo2" className="text-accent underline underline-offset-2 hover:no-underline">
                  understanding oxygen saturation (SpO2)
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
