import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "@/components/EditorialPage";
import { BedGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/equipment/beds" },
  title: "Beds & Bedroom",
  description: "Hospital beds and bedroom equipment, sourced through our concierge team.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<BedGraphic />}
        eyebrow="Other Equipment"
        title="Beds & Bedroom"
        intro="Hospital beds, pressure-relief mattresses, and bedroom safety equipment aren't stocked directly — our concierge team sources these through vetted DME partners on a per-request basis."
      />
      <section className="px-8 py-16 text-center">
        <Link
          href="/concierge"
          className="cursor-pointer rounded-[3px] bg-accent px-6 py-3 text-[13px] font-semibold text-accent-ink"
        >
          Request a sourcing quote
        </Link>
      </section>
    </div>
  );
}
