import type { Metadata } from "next";
import { ProductListing } from "@/components/ProductListing";
import { BatteryArchitectureShowcase } from "@/components/BatteryArchitectureShowcase";

export const metadata: Metadata = {
  alternates: { canonical: "/oxygen/accessories" },
  title: "Oxygen Accessories",
  description: "Batteries, carrying cases, carts, and cannulas for every concentrator we carry.",
};

export default function Page() {
  return (
    <ProductListing
      eyebrow="Oxygen"
      title="Oxygen Accessories"
      intro="Batteries, carrying cases, and cannulas for every concentrator we carry."
      base="/oxygen/accessories"
      science={[
        {
          eyebrow: "Capacity scales by count, not chemistry",
          heading: "An 8-cell pack is two of the 4-cell pack.",
          visual: <BatteryArchitectureShowcase />,
          body: (
            <p>
              The 4-, 8-, and 16-cell packs sold here aren&rsquo;t different battery designs —
              they&rsquo;re the same lithium-ion cell, wired in parallel groups on a shared bus
              bar. More cells means more stored charge and roughly proportional runtime, which is
              why the largest pack for a given concentrator costs more and weighs more: it's
              carrying more of the same cell, not a different one.
            </p>
          ),
        },
      ]}
    />
  );
}
