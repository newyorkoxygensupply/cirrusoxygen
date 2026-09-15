import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "@/components/EditorialPage";
import { EquipmentGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/equipment" },
  title: "Other Equipment",
  description: "Durable medical equipment outside our core focus — kept available, kept secondary.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<EquipmentGraphic />}
        eyebrow="Secondary catalog"
        title="Other equipment, sourced on request."
        intro="Oxygen and sleep systems are what we test, stock, and stand behind. For other DME categories, our concierge team sources from vetted partners — the catalog below is where those requests start."
      />
      <section className="grid grid-cols-1 border-b border-border sm:grid-cols-2">
        <Link
          href="/equipment/mobility"
          className="group cursor-pointer border-r border-b border-border p-11 transition-colors hover:bg-surface-2 sm:border-b-0"
        >
          <h3 className="text-[15px] font-semibold">Mobility</h3>
          <p className="mt-2 max-w-[34ch] text-[13px] text-muted">
            Wheelchairs, scooters, and walking aids.
          </p>
          <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">Browse</span>
        </Link>
        <Link
          href="/equipment/beds"
          className="group cursor-pointer p-11 transition-colors hover:bg-surface-2"
        >
          <h3 className="text-[15px] font-semibold">Beds & Bedroom</h3>
          <p className="mt-2 max-w-[34ch] text-[13px] text-muted">
            Hospital beds, pressure-relief mattresses, and bedroom safety equipment.
          </p>
          <span className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-accent">Browse</span>
        </Link>
      </section>
      <section className="px-8 py-16 text-center">
        <Link href="/concierge" className="cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          Request a sourcing quote →
        </Link>
      </section>
    </div>
  );
}
