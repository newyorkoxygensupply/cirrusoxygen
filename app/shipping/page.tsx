import type { Metadata } from "next";
import { EditorialHero, EditorialSection, StatRow } from "@/components/EditorialPage";
import { DispatchGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/shipping" },
  title: "Shipping",
  description: "Delivery timelines, packaging, and coverage areas.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<DispatchGraphic />}
        eyebrow="Support"
        title="Shipping"
        intro="Every order ships in unmarked packaging with signature confirmation, and every Rx-gated device is fully charged and setup-tested before it leaves our facility."
      />

      <StatRow
        items={[
          ["48 hr", "Ship after Rx verification"],
          ["2–5 day", "Continental US transit"],
          ["100%", "Signature required"],
          ["50 states", "Continental coverage"],
        ]}
      />

      <EditorialSection heading="Timeline">
        <p>
          Orders ship within 48 hours of prescription verification clearing — not 48 hours of order
          placement. Verification itself is typically finished within two hours during business
          hours (see{" "}
          <a href="/prescription" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
            prescription verification
          </a>
          ). Continental US delivery then runs 2–5 business days depending on destination.
        </p>
      </EditorialSection>

      <EditorialSection heading="Packaging & discretion">
        <p>
          All packaging ships unmarked — no manufacturer logos, no medical-supply branding on the
          exterior box. Devices arrive charged, powered on, and setup-tested at the facility before
          they leave, so the first thing you do on delivery is use it, not troubleshoot it.
        </p>
      </EditorialSection>

      <EditorialSection heading="Coverage">
        <p>
          We currently ship to all 50 states. Alaska, Hawaii, and US territories may see extended
          transit windows of 5–8 business days. International shipping is not currently available —
          contact concierge for guidance on traveling internationally with an existing unit.
        </p>
      </EditorialSection>
    </div>
  );
}
