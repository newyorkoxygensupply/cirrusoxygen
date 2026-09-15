import type { Metadata } from "next";
import Link from "next/link";
import { faqJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ",
  description: "Answers on prescription verification, cash-pay policy, shipping, returns, and how CIRRUS actually works.",
};

const FAQ_GROUPS: { heading: string; items: [string, string][] }[] = [
  {
    heading: "Insurance & Payment",
    items: [
      [
        "Does CIRRUS accept insurance, Medicaid, or Medicare?",
        "No. Currently we don't accept Insurance, Medicaid, or Medicare — all orders are self-pay. This is by design: removing insurance billing eliminates prior-authorization queues and claim-adjudication delays, in exchange for no insurance reimbursement.",
      ],
      [
        "How is payment actually completed?",
        "Payment is finalized by phone with your assigned concierge specialist after prescription verification clears. We don't collect card numbers through the website checkout form.",
      ],
      [
        "Are there hidden fees beyond the listed price?",
        "The price shown on a product page is the price at checkout, before shipping and any applicable tax, which your concierge specialist confirms directly with you before finalizing payment.",
      ],
      [
        "Can I use my HSA or FSA to pay?",
        "Yes. Oxygen concentrators, CPAP/BiPAP devices, and related accessories are HSA/FSA-eligible medical expenses. We don't bill your HSA/FSA card directly during phone checkout — pay with the card yourself, or pay another way and request an itemized receipt from your concierge specialist for reimbursement.",
      ],
      [
        "Is financing available?",
        "Ask your concierge specialist — financing options may be available depending on the device and order total. Payment is always finalized directly with your specialist, never automated on this site.",
      ],
    ],
  },
  {
    heading: "Prescriptions",
    items: [
      [
        "Do I need a prescription for an oxygen concentrator or CPAP/BiPAP machine?",
        "Yes. Oxygen concentrators and CPAP/BiPAP devices are Class II medical devices under FDA regulation, and a valid prescription is required by law regardless of payment method.",
      ],
      [
        "What if I don't have a current prescription?",
        "Our concierge team can connect you with a telehealth physician for an evaluation — a separate clinical service, since we don't write or approve prescriptions ourselves.",
      ],
      [
        "How long does prescription verification take?",
        "Typically within two hours during business hours once your prescription is uploaded or your physician's office confirms it directly.",
      ],
      [
        "Do masks and accessories require a prescription?",
        "No — masks and most accessories don't require prescription verification, only the CPAP/BiPAP/oxygen devices themselves.",
      ],
    ],
  },
  {
    heading: "Shipping & Delivery",
    items: [
      [
        "How fast does an order ship?",
        "Orders ship within 48 hours of prescription verification clearing, not 48 hours of order placement. Continental US delivery then typically runs 2–5 business days.",
      ],
      [
        "Does CIRRUS ship to all 50 states?",
        "Yes. Alaska, Hawaii, and US territories may see extended transit windows of 5–8 business days. International shipping isn't currently available.",
      ],
      [
        "Is the packaging discreet?",
        "Yes — all packaging ships unmarked, with no manufacturer logos or medical-supply branding on the exterior box.",
      ],
    ],
  },
  {
    heading: "Returns & Warranty",
    items: [
      [
        "Can I return a device after I've ordered it?",
        "No. All sales are final — we don't accept returns or exchanges on any order, including devices, masks, and accessories. Please confirm model, size, and prescription details with your concierge specialist before completing your order.",
      ],
      [
        "Can I exchange a mask if the fit doesn't work?",
        "No. All sales are final, so masks and cushions aren't eligible for exchange based on fit. Talk to your concierge specialist about sizing before you order.",
      ],
      [
        "What happens if a device arrives defective?",
        "Manufacturer warranty coverage still applies — contact your concierge specialist directly. Defective units are handled as a warranty exchange, separate from our no-return, no-exchange sales policy.",
      ],
    ],
  },
  {
    heading: "Devices & Equipment",
    items: [
      [
        "What's the difference between a portable and stationary oxygen concentrator?",
        "A portable concentrator is battery-powered and built for ambulatory or travel use; a stationary concentrator plugs into wall power and is built for continuous home use, typically at a higher maximum flow rate.",
      ],
      [
        "Are your portable concentrators approved for air travel?",
        "Every portable oxygen concentrator we carry ships with FAA travel documentation. See our glossary entry on FAA-approved oxygen for exactly what that documentation covers.",
      ],
      [
        "What's the difference between CPAP, BiPAP, and APAP?",
        "CPAP delivers one fixed pressure; APAP (auto-titrating CPAP) adjusts pressure in real time within a prescribed range; BiPAP delivers two separate pressures for inhale and exhale, typically prescribed when standard CPAP isn't sufficient.",
      ],
      [
        "Do you carry refurbished equipment?",
        "Yes — refurbished units are factory-tested and inspected before resale, typically at a lower price than new, with warranty terms confirmed by your concierge specialist.",
      ],
    ],
  },
];

export default function Page() {
  const allQA = FAQ_GROUPS.flatMap((g) => g.items);
  const jsonLd = faqJsonLd(allQA);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b border-border px-8 py-20">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">Support</p>
          <h1 className="font-display mt-4 text-[clamp(28px,4vw,42px)] font-semibold text-balance">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            The real questions we get most from prospective customers — payment, prescriptions,
            shipping, and equipment.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[760px]">
          {FAQ_GROUPS.map((group) => (
            <div key={group.heading} className="mb-12 last:mb-0">
              <h2 className="font-display mb-5 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">
                {group.heading}
              </h2>
              <div className="border-t border-border">
                {group.items.map(([q, a]) => (
                  <div key={q} className="border-b border-border py-5">
                    <h3 className="text-[15px] font-semibold">{q}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-4 text-[13px] text-muted">
            Question not answered here?{" "}
            <Link href="/concierge" className="cursor-pointer text-accent underline underline-offset-2 hover:no-underline">
              Talk to concierge
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
