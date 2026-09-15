import type { Metadata } from "next";
import Link from "next/link";
import { ProductListing } from "@/components/ProductListing";
import { BreathCycleShowcase } from "@/components/BreathCycleShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/ventilators" },
  title: "ICU & Home Ventilators, Authorized Channel",
  description: "ICU, transport, and MRI-compatible mechanical ventilators from Hamilton Medical, Dräger, Getinge, Mindray, and Zoll.",
};

export default function Page() {
  return (
    <ProductListing
      pillar={{ label: "Procuring for a facility? Read the guide", href: "/ventilators/guide" }}
      eyebrow="Institutional"
      title="Ventilators"
      intro="ICU, transport, and MRI-compatible mechanical ventilators for clinical and institutional buyers — sourced through authorized channels from Hamilton Medical, Dräger, Getinge, Mindray, and Zoll. Procurement and service-contract support handled directly by your concierge specialist."
      base="/ventilators"
      science={[
        {
          eyebrow: "Not a symmetric cycle",
          heading: "A shorter breath in, a longer breath out.",
          imageSide: "right",
          visual: <BreathCycleShowcase />,
          body: (
            <>
              <p>
                Mechanical ventilation doesn&rsquo;t move air in and out on equal time —
                inspiration runs on a controlled, shorter phase, expiration is passive and roughly
                twice as long, the same I:E timing every class in this catalog is built around,
                from transport units to full ICU platforms.
              </p>
              <p className="mt-3 text-[13px] text-muted-2">
                How the classes actually differ in capability and price, in{" "}
                <Link href="/journal/ventilator-classes-icu-transport-mri-explained" className="text-accent underline underline-offset-2 hover:no-underline">
                  ICU, transport, and MRI-conditional ventilators explained
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
