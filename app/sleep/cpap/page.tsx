import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { PressureTitrationShowcase } from "@/components/PressureTitrationShowcase";
import { AHITimelineShowcase } from "@/components/AHITimelineShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/sleep/cpap" },
  title: "CPAP Machines — Ships in 48 Hours",
  description: "Continuous positive airway pressure systems for standard sleep apnea therapy.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Sleep"
      title="CPAP Machines"
      intro="Continuous positive airway pressure systems for standard sleep apnea therapy — including compact travel CPAPs — from ResMed, Philips, and Fisher & Paykel."
      base="/sleep/cpap"
      science={[
        {
          eyebrow: "Not one fixed number",
          heading: "The pressure moves with you.",
          imageSide: "right",
          visual: <PressureTitrationShowcase />,
          body: (
            <>
              <p>
                An auto-titrating machine doesn&rsquo;t hold a single cmH2O setting all night —
                it continuously adjusts within a prescribed range as it detects resistance,
                easing off when your airway is open and stepping up when it isn&rsquo;t.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                What the machine is actually reading, in{" "}
                <Link href="/journal/cpap-pressure-what-auto-titrating-actually-adjusts" className="text-accent underline underline-offset-2 hover:no-underline">
                  what auto-titrating pressure actually adjusts
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          eyebrow: "What AHI is measuring",
          heading: "The gaps are the number.",
          imageSide: "left",
          visual: <AHITimelineShowcase />,
          body: (
            <>
              <p>
                AHI counts how often breathing effort drops out or stops each hour — the gaps in
                the top line. Therapy&rsquo;s entire job is closing those gaps, which is what the
                steadier line underneath represents.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                How the score is graded mild to severe, in{" "}
                <Link href="/journal/ahi-number-explained-mild-moderate-severe" className="text-accent underline underline-offset-2 hover:no-underline">
                  the AHI number explained
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
