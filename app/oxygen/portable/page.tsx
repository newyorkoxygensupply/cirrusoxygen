import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { PulseDoseShowcase } from "@/components/PulseDoseShowcase";
import { BatteryCellShowcase } from "@/components/BatteryCellShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/oxygen/portable" },
  title: "FAA-Approved Portable Oxygen Concentrators",
  description: "Battery-powered concentrators under 5 lbs, every one FAA-approved for in-flight use.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Oxygen"
      title="Portable Oxygen Concentrators"
      intro="Battery-powered concentrators, FAA-approved for in-flight use, from Inogen, Caire, OxyGo, and Drive DeVilbiss — including refurbished units at a discount."
      base="/oxygen/portable"
      science={[
        {
          eyebrow: "Not a steady stream",
          heading: "It waits for you to inhale.",
          imageSide: "right",
          visual: <PulseDoseShowcase />,
          body: (
            <>
              <p>
                A portable concentrator doesn&rsquo;t run continuously — a sensor detects the
                start of each breath and fires a single metered bolus, then waits for the next
                one. That&rsquo;s what makes 8+ hours of battery life possible from a unit that
                fits in a bag.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                The mechanics, in full, in{" "}
                <Link href="/journal/pulse-dose-vs-continuous-flow-oxygen" className="text-accent underline underline-offset-2 hover:no-underline">
                  pulse dose vs. continuous flow
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          eyebrow: "What actually runs it",
          heading: "The cells behind the runtime spec.",
          imageSide: "left",
          visual: <BatteryCellShowcase />,
          body: (
            <>
              <p>
                Every &ldquo;8&ndash;16 hours&rdquo; on a spec sheet traces back to a real cell
                pack, not a marketing round number — and the number moves with flow setting, cold
                weather, and battery age the same way it would in any lithium pack.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                What actually determines runtime, in{" "}
                <Link href="/journal/portable-oxygen-concentrator-battery-life" className="text-accent underline underline-offset-2 hover:no-underline">
                  portable battery life explained
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
