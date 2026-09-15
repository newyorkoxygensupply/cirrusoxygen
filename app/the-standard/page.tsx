import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, EditorialSection, StatRow } from "@/components/EditorialPage";
import { StandardGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/the-standard" },
  title: "The Standard",
  description: "Our sourcing philosophy, manufacturing partners, and why we sell a narrow catalog instead of a broad one.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<StandardGraphic />}
        eyebrow="Company"
        title="A narrow catalog, held to one standard."
        intro="Most DME retailers carry thousands of SKUs at every quality tier. We carry six product lines, chosen for a single reason each — and we test every unit against the same bar before it ships."
      />

      <StatRow
        items={[
          ["6", "Product lines carried"],
          ["100%", "FAA-approved oxygen line"],
          ["3–5 yr", "Warranty range by device"],
          ["48 hr", "Standard ship window"],
        ]}
      />

      <EditorialSection heading="Why narrow beats broad">
        <p>
          A catalog with six product lines is a catalog we can actually stand behind. Every unit
          that carries the CIRRUS name has been used by our own team for at least sixty days before
          we list it &mdash; on flights, through humid summers, and through the kind of daily wear
          a showroom demo never sees.
        </p>
        <p>
          If a manufacturer changes a component supplier, a battery chemistry, or a firmware
          revision in a way that changes real-world performance, that model comes off the site
          until we&rsquo;ve re-tested it. We would rather sell five things well than fifty things
          adequately.
        </p>
      </EditorialSection>

      <EditorialSection heading="What we test for">
        <ul className="flex flex-col gap-3">
          {[
            "Sound level at each flow setting, measured at 3 feet, not the manufacturer's anechoic-chamber number.",
            "Battery life under real ambulatory use, not laboratory idle-drain conditions.",
            "FAA and TSA documentation, verified current for every unit at time of listing.",
            "Failure-mode research — what breaks first, and how the warranty actually handles it.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection heading="Where the equipment comes from">
        <p>
          We source through authorized distribution channels for every manufacturer we carry —
          never gray-market, never parallel-import. Serial numbers on every unit register with the
          manufacturer under CIRRUS as the authorized seller, which keeps the factory warranty
          intact from day one.
        </p>
      </EditorialSection>

      <div className="px-8 py-16 text-center">
        <Link href="/why-cash-pay" className="cursor-pointer text-[13px] font-semibold text-accent underline underline-offset-2 hover:no-underline">
          Read why we don&rsquo;t bill insurance →
        </Link>
      </div>
    </div>
  );
}
