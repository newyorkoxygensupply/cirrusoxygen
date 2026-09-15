import type { Metadata } from "next";
import { EditorialHero } from "@/components/EditorialPage";
import { ConciergeGraphic } from "@/components/EditorialGraphics";
import { ConciergeForm } from "./ConciergeForm";
import { CONCIERGE_HOURS, CONCIERGE_PHONE_DISPLAY } from "@/lib/concierge";

export const metadata: Metadata = {
  alternates: { canonical: "/concierge" },
  title: "Concierge",
  description: "One phone line, one person, for setup help, travel questions, and everything after the sale.",
};

export default function Page() {
  return (
    <div>
      <EditorialHero
        graphic={<ConciergeGraphic />}
        eyebrow="Support"
        title="One line. One person. No hold music."
        intro="Every order is assigned a dedicated specialist at checkout — the same person handles setup help, travel questions, and anything that comes up after delivery."
      />

      <section className="grid grid-cols-1 gap-12 px-8 py-16 md:grid-cols-[1fr_1.2fr]">
        <div className="mx-auto w-full max-w-[420px] md:mx-0">
          <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Direct lines</h2>
          <dl className="mt-5 flex flex-col gap-4 text-[14px]">
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-1 font-mono text-[16px]">{CONCIERGE_PHONE_DISPLAY}</dd>
              <dd className="text-[12px] text-muted-2">{CONCIERGE_HOURS}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1 font-mono text-[16px]">info@cirrusoxygen.com</dd>
              <dd className="text-[12px] text-muted-2">Response within one business day</dd>
            </div>
          </dl>
        </div>
        <div className="mx-auto w-full max-w-[520px] md:mx-0">
          <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Send a message</h2>
          <div className="mt-5">
            <ConciergeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
