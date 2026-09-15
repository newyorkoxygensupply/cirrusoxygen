import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero, EditorialSection, StatRow } from "@/components/EditorialPage";
import { DirectPriceGraphic } from "@/components/EditorialGraphics";

export const metadata: Metadata = {
  alternates: { canonical: "/why-cash-pay" },
  title: "Why Cash-Pay",
  description: "The full reasoning behind not billing insurance, Medicaid, or Medicare — and what it buys you instead.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<DirectPriceGraphic />}
        eyebrow="Company"
        title="We don't bill insurance. On purpose."
        intro="This isn't a limitation we're working around — it's the design. Cutting the claims process out entirely is what makes a 48-hour ship time and a single fixed price possible."
      />

      <StatRow
        items={[
          ["0", "Claims filed, ever"],
          ["48 hr", "Order to ship"],
          ["1", "Price shown, price paid"],
          ["100%", "Self-pay, no exceptions"],
        ]}
      />

      <EditorialSection heading="What insurance billing actually costs">
        <p>
          A typical DME insurance claim runs through prior authorization, coding review, and
          adjudication before a unit ever ships — a process that commonly takes two to six weeks,
          and can end in a denial after all of it. That timeline, and that risk, gets built into
          the price whether the claim is approved or not.
        </p>
        <p>
          By selling directly, we remove the authorization queue, the coding overhead, and the
          administrative staff required to fight denials. The price on the page reflects that —
          it&rsquo;s what the equipment and service actually cost, not a number inflated to absorb
          claims friction.
        </p>
      </EditorialSection>

      <EditorialSection heading="What you get in exchange">
        <ul className="flex flex-col gap-3">
          {[
            ["Speed", "Orders ship in 48 hours once prescription verification clears — no authorization queue to wait behind."],
            ["Privacy", "No claim is filed, which means no record with your insurance carrier of what you purchased or why."],
            ["Price clarity", "The number on the product page is the number at checkout. No adjudication, no balance bill weeks later."],
            ["Model access", "We aren't limited to whatever a payer's formulary covers — you get the model that fits, not the one that's reimbursable."],
          ].map(([k, v]) => (
            <li key={k} className="flex flex-col gap-1">
              <span className="font-semibold text-text">{k}</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection heading="The policy, stated plainly">
        <div className="rounded-[3px] border border-border-strong p-5 text-[14px]">
          <p className="font-medium text-text">
            Currently we don&rsquo;t accept Insurance, Medicaid, or Medicare. All orders are
            self-pay.
          </p>
          <p className="mt-2">
            This is stated here, at checkout, and in our{" "}
            <Link href="/prescription" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
              prescription verification
            </Link>{" "}
            flow — no exceptions, no fine print. A valid prescription is still required by federal
            law for oxygen and CPAP/BiPAP devices, and we verify one regardless of how the order is
            paid for.
          </p>
        </div>
      </EditorialSection>
    </div>
  );
}
